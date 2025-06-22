const db = require("../config/db");
const { createNotification } = require("../services/notificationsService");
const logAudit = require("../utils/auditLogger");
// יצירת בקשת החלפה חדשה עם אפשרות להצעת עד 4 מוצרים

exports.createExchangeRequest = async (req, res) => {
  const { userId, productId, offeredProductIds, userName } = req.body;

  if (
    !Array.isArray(offeredProductIds) ||
    offeredProductIds.length === 0 ||
    offeredProductIds.length > 4
  ) {
    return res
      .status(400)
      .json({ error: "יש להציע בין מוצר אחד לארבעה מוצרים" });
  }

  // 🛡️ מניעת כפילות
  try {
    const { rows: existingRequests } = await db.query(
      `
      SELECT er.request_id
      FROM Exchange_Requests er
      JOIN Exchange_Proposal_Options epo ON er.request_id = epo.request_id
      WHERE er.user_id = $1
        AND er.product_id = $2
        AND er.status = 'Pending'
      GROUP BY er.request_id
      HAVING ARRAY_AGG(epo.offered_product_id ORDER BY epo.offered_product_id) = $3::int[]
      `,
      [userId, productId, offeredProductIds.slice().sort()]
    );

    if (existingRequests.length > 0) {
      return res.status(409).json({
        error: "כבר הגשת בקשת החלפה על מוצר זה עם אותם מוצרים מוצעים",
      });
    }
  } catch (error) {
    console.error("שגיאה בבדיקת בקשות כפולות:", error);
    return res.status(500).json({ error: "שגיאה בבדיקת בקשה קיימת" });
  }

  // ⚠️ בדיקה לחפיפה חלקית
  let hasPartialOverlap = false;
  try {
    const { rows: overlappingProducts } = await db.query(
      `
      SELECT DISTINCT epo.offered_product_id
      FROM Exchange_Requests er
      JOIN Exchange_Proposal_Options epo ON er.request_id = epo.request_id
      WHERE er.user_id = $1
        AND er.product_id = $2
        AND er.status = 'Pending'
        AND epo.offered_product_id = ANY($3::int[])
      `,
      [userId, productId, offeredProductIds]
    );

    if (overlappingProducts.length > 0) {
      hasPartialOverlap = true;
    }
  } catch (error) {
    console.error("שגיאה בבדיקת חפיפה חלקית:", error);
    // לא חוסם, רק מתריע
  }

  const client = await db.connect();
  try {
    await client.query("BEGIN");

    const { rows } = await client.query(
      `INSERT INTO Exchange_Requests (user_id, product_id, status)
       VALUES ($1, $2, 'Pending') RETURNING request_id`,
      [userId, productId]
    );

    const requestId = rows[0].request_id;

    for (const offeredProductId of offeredProductIds) {
      await client.query(
        `INSERT INTO Exchange_Proposal_Options (request_id, offered_product_id)
         VALUES ($1, $2)`,
        [requestId, offeredProductId]
      );
    }

    // 👇 השינוי החשוב – עדכון זמינות של המוצר שעליו הוגשה הבקשה
    await client.query(
      `UPDATE Products
       SET availability = 'Interested'
       WHERE product_id = $1 AND availability = 'Available'`,
      [productId]
    );

    const { rows: productInfo } = await client.query(
      `SELECT title FROM Products WHERE product_id = $1`,
      [productId]
    );
    const productTitle = productInfo[0]?.title || `#${productId}`;

    // await client.query(
    //   `INSERT INTO Audit_Logs (action, user_id, user_name, details)
    //    VALUES ('יצירת בקשת החלפה', $1, $2, $3)`,
    //   [
    //     userId,
    //     userName,
    //     `נשלחה בקשת החלפה על המוצר "${productTitle}" עם הצעות: ${offeredProductIds.join(
    //       ", "
    //     )}`,
    //   ]
    // );

    await logAudit(
      "יצירת בקשת החלפה",
      userId,
      userName,
      `נשלחה בקשת החלפה על המוצר "${productTitle}" עם הצעות: ${offeredProductIds.join(", ")}`
    );

    const { rows: targetProductOwner } = await client.query(
      `SELECT user_id FROM Products WHERE product_id = $1`,
      [productId]
    );
    const targetUserId = targetProductOwner[0]?.user_id;

    if (targetUserId && targetUserId !== userId) {
      await createNotification({
        userId: targetUserId,
        type: "new_request",
        message: `קיבלת בקשת החלפה חדשה על המוצר "${productTitle}" ממשתמש ${userName}`,
        contextId: requestId,
      });
    }

    await client.query("COMMIT");
    res
      .status(201)
      .json({ message: "הבקשה נשלחה בהצלחה", requestId, hasPartialOverlap });
  } catch (error) {
    await client.query("ROLLBACK");
    console.error(error);
    res.status(500).json({ error: "שגיאה ביצירת בקשת ההחלפה" });
  } finally {
    client.release();
  }
};

// אישור בקשה והעברת המוצר לסטטוס Pending בלבד
exports.approveExchangeRequest = async (req, res) => {
  const { id } = req.params;
  const { chosenProductId, userId, userName } = req.body;

  const client = await db.connect();
  try {
    await client.query("BEGIN");

    // בדיקת זמינות המוצר הנבחר
    const chosenResult = await client.query(
      `SELECT title, availability FROM Products WHERE product_id = $1`,
      [chosenProductId]
    );

    if (!chosenResult.rows.length) {
      await client.query("ROLLBACK");
      return res.status(404).json({ error: "המוצר הנבחר לא נמצא" });
    }

    const { title: chosenTitle, availability } = chosenResult.rows[0];
    if (availability !== "Available" && availability !== "Interested") {
      await client.query("ROLLBACK");
      return res.status(400).json({ error: "המוצר הנבחר אינו זמין" });
    }

    // עדכון הבקשה ל־Approved
    const { rows: requestRows } = await client.query(
      `UPDATE Exchange_Requests
       SET status = 'Approved', chosen_product_id = $1, updated_at = CURRENT_TIMESTAMP
       WHERE request_id = $2
       RETURNING product_id`,
      [chosenProductId, id]
    );

    if (!requestRows.length) {
      await client.query("ROLLBACK");
      return res.status(404).json({ error: "הבקשה לא נמצאה" });
    }

    const targetProductId = requestRows[0].product_id;

    // שליפת שם המוצר המקורי
    const { rows: targetRows } = await client.query(
      `SELECT title FROM Products WHERE product_id = $1`,
      [targetProductId]
    );

    const targetTitle = targetRows[0]?.title || `#${targetProductId}`;

    // עדכון זמינות
    await client.query(
      `UPDATE Products
       SET availability = 'Pending'
       WHERE product_id = ANY($1::int[])`,
      [[chosenProductId, targetProductId]]
    );

    // לוג
    // await client.query(
    //   `INSERT INTO Audit_Logs (action, user_id, user_name, details)
    //    VALUES ('אישור בקשת החלפה', $1, $2, $3)`,
    //   [
    //     userId,
    //     userName,
    //     `אושר המוצר "${chosenTitle}" לבקשה ${id}. עודכן גם המוצר המבוקש "${targetTitle}"`,
    //   ]
    // );

    await logAudit(
      "אישור בקשת החלפה",
      userId,
      userName,
      `אושר המוצר "${chosenTitle}" לבקשה ${id}. עודכן גם המוצר המבוקש "${targetTitle}"`
    );

    // יצירת התראות עבור ההצעות שלא נבחרו
    const { rows: rejectedProposers } = await client.query(
      `SELECT DISTINCT proposer.user_id, proposerProduct.title AS proposer_product_title,
              targetUser.name AS target_user_name, targetProduct.title AS target_product_title
       FROM Exchange_Proposal_Options epo
       JOIN Products proposerProduct ON epo.offered_product_id = proposerProduct.product_id
       JOIN Users proposer ON proposerProduct.user_id = proposer.user_id
       JOIN Exchange_Requests er ON epo.request_id = er.request_id
       JOIN Products targetProduct ON er.product_id = targetProduct.product_id
       JOIN Users targetUser ON targetProduct.user_id = targetUser.user_id
       WHERE epo.request_id = $1 AND proposerProduct.product_id <> $2`,
      [id, chosenProductId]
    );

    for (const proposer of rejectedProposers) {
      await createNotification({
        userId: proposer.user_id,
        type: "auto_rejected",
        message: `ההצעה שלך למוצר "${proposer.target_product_title}" של ${proposer.target_user_name} נדחתה אוטומטית לאחר שנבחרה הצעה אחרת`,
        contextId: id,
      });
    }

    await client.query("COMMIT");
    res
      .status(200)
      .json({ message: "הבקשה אושרה והמוצרים הועברו לסטטוס Pending" });
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("שגיאה באישור בקשה:", error);
    res.status(500).json({ error: "שגיאה באישור הבקשה" });
  } finally {
    client.release();
  }
};

// // השלמת ההחלפה בפועל
exports.completeExchangeRequest = async (req, res) => {
  const { id } = req.params;
  const { userId, userName } = req.body;

  const client = await db.connect();
  try {
    await client.query("BEGIN");

    const { rows } = await client.query(
      `SELECT chosen_product_id, product_id FROM Exchange_Requests
       WHERE request_id = $1 AND status = 'Approved' FOR UPDATE`,
      [id]
    );

    const request = rows[0];
    if (!request) {
      await client.query("ROLLBACK");
      return res.status(404).json({ error: "בקשה לא מאושרת או לא קיימת" });
    }

    const { chosen_product_id, product_id } = request;

    const { rows: titles } = await client.query(
      `SELECT 
         (SELECT title FROM Products WHERE product_id = $1) AS chosen_title,
         (SELECT title FROM Products WHERE product_id = $2) AS target_title`,
      [chosen_product_id, product_id]
    );

    const chosenTitle = titles[0]?.chosen_title || `#${chosen_product_id}`;
    const targetTitle = titles[0]?.target_title || `#${product_id}`;

    await client.query(
      `UPDATE Products SET availability = 'Exchanged' WHERE product_id = $1`,
      [chosen_product_id]
    );

    await client.query(
      `UPDATE Products SET availability = 'Exchanged' WHERE product_id = $1`,
      [product_id]
    );

    await client.query(
      `INSERT INTO Exchange_History (user_id, exchange_product_id, received_product_id, status)
       VALUES ($1, $2, $3, 'Completed')`,
      [userId, chosen_product_id, product_id]
    );

    await client.query(
      `UPDATE Exchange_Requests SET status = 'Completed', updated_at = CURRENT_TIMESTAMP WHERE request_id = $1`,
      [id]
    );

    // await client.query(
    //   `INSERT INTO Audit_Logs (action, user_id, user_name, details)
    //    VALUES ('השלמת החלפה', $1, $2, $3)`,
    //   [
    //     userId,
    //     userName,
    //     `הבקשה ${id} הושלמה – המוצר "${chosenTitle}" הוחלף עם "${targetTitle}"`,
    //   ]
    // );

    await logAudit(
      "השלמת החלפה",
      userId,
      userName,
      `הבקשה ${id} הושלמה – המוצר "${chosenTitle}" הוחלף עם "${targetTitle}"`
    );

    await client.query("COMMIT");
    res.status(200).json({ message: "ההחלפה הושלמה בהצלחה" });
  } catch (error) {
    await client.query("ROLLBACK");
    console.error(error);
    res.status(500).json({ error: "שגיאה בהשלמת ההחלפה" });
  } finally {
    client.release();
  }
};
// todo clean code!!!

// קבלת כל בקשות ההחלפה
exports.getAllExchangeRequests = async (req, res) => {
  try {
    const result = await db.query("SELECT * FROM Exchange_Requests");
    res.status(200).json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch exchange requests" });
  }
};

// // קבלת בקשת החלפה של משתמש לפי ID
exports.getAllUserExchangeRequests = async (req, res) => {
  const { userId } = req.params;

  try {
    const { rows } = await db.query(
      `SELECT 
        r.request_id, 
        r.user_id, 
        r.product_id, 
        r.status, 
        r.created_at, 
        r.updated_at,
        p.title AS requested_title,
        p.image_url AS requested_image_url,
        p.category AS requested_category,
        p.subcategory AS requested_subcategory,
        p.location AS requested_location,
        p.condition AS requested_condition,
        p.availability AS requested_availability,
        owner.user_id AS owner_user_id,
        owner.name AS owner_name
      FROM Exchange_Requests r
      JOIN Products p ON r.product_id = p.product_id
      JOIN Users owner ON p.user_id = owner.user_id
      WHERE r.user_id = $1
      ORDER BY r.created_at DESC`,
      [userId]
    );

    const enrichedRequests = [];

    for (const row of rows) {
      const { rows: offeredProducts } = await db.query(
        `SELECT 
          p.product_id,
          p.title,
          p.category,
          p.subcategory,
          p.availability
        FROM Exchange_Proposal_Options op
        JOIN Products p ON op.offered_product_id = p.product_id
        WHERE op.request_id = $1`,
        [row.request_id]
      );

      enrichedRequests.push({
        request_id: row.request_id,
        user_id: row.user_id,
        product_id: row.product_id,
        status: row.status,
        created_at: row.created_at,
        updated_at: row.updated_at,
        owner_user_id: row.owner_user_id, // ✅ חדש
        owner_name: row.owner_name, // ✅ חדש
        offered_products: offeredProducts.map((p) => ({
          product_id: p.product_id,
          title: p.title,
          category: p.category,
          subcategory: p.subcategory,
          availability: p.availability,
        })),
        requested_product: {
          product_id: row.product_id,
          title: row.requested_title,
          image_url: row.requested_image_url,
          category: row.requested_category,
          subcategory: row.requested_subcategory,
          location: row.requested_location,
          condition: row.requested_condition,
          availability: row.requested_availability,
        },
      });
    }

    res.status(200).json(enrichedRequests);
  } catch (error) {
    console.error("שגיאה בשרת getAllUserExchangeRequests:", error.message);
    res.status(500).json({ error: "שגיאה בטעינת הבקשות" });
  }
};

// קבלת בקשות שהוגשו על מוצרים של המשתמש
exports.getIncomingExchangeRequests = async (req, res) => {
  const { userId } = req.params;

  try {
    const { rows } = await db.query(
      `SELECT er.*, 
       json_agg(DISTINCT jsonb_build_object(
        'product_id', p.product_id,
        'title', p.title,
        'category', p.category,
        'subcategory', p.subcategory,
        'availability', p.availability,
        'location', p.location,          
        'image_url', p.image_url 
      )) AS offered_products,
       json_build_object(
         'product_id', target.product_id,
         'title', target.title,
         'image_url', target.image_url,
         'availability', target.availability,
         'location', target.location,
         'category', target.category,
         'subcategory', target.subcategory,
         'condition', target.condition
       ) AS requested_product,
       requester.name AS requester_name,
       requester.user_id AS requester_user_id
      FROM Exchange_Requests er
      JOIN Products target ON er.product_id = target.product_id
      JOIN Users requester ON er.user_id = requester.user_id
      LEFT JOIN Exchange_Proposal_Options epo ON er.request_id = epo.request_id
      LEFT JOIN Products p ON epo.offered_product_id = p.product_id
      WHERE target.user_id = $1
      GROUP BY er.request_id, target.product_id, requester.name, requester.user_id
      ORDER BY er.created_at DESC`,
      [userId]
    );

    res.status(200).json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "שגיאה בקבלת הבקשות שהתקבלו" });
  }
};

// קבלת בקשת החלפה לפי ID
// קבלת בקשת החלפה לפי ID כולל מידע נלווה לשימוש בצ'אט
exports.getExchangeRequestById = async (req, res) => {
  const { id } = req.params;

  try {
    const { rows } = await db.query(
      `
      SELECT 
        er.request_id,
        er.status,
        er.user_id AS requester_id,
        er.product_id AS requested_product_id,
        er.chosen_product_id,
        p1.title AS requested_product_title,
        p2.title AS chosen_product_title,
        u_requester.name AS requester_name,
        p1.user_id AS requested_product_owner_id,
        u_owner.name AS requested_product_owner_name
      FROM Exchange_Requests er
      JOIN Products p1 ON er.product_id = p1.product_id
      JOIN Products p2 ON er.chosen_product_id = p2.product_id
      JOIN Users u_requester ON er.user_id = u_requester.user_id
      JOIN Users u_owner ON p1.user_id = u_owner.user_id
      WHERE er.request_id = $1
      `,
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: "Exchange request not found" });
    }

    const data = rows[0];

    res.status(200).json({
      request_id: data.request_id,
      status: data.status,
      requester_id: data.requester_id,
      requested_product_id: data.requested_product_id,
      chosen_product_id: data.chosen_product_id,
      requester_name: data.requester_name,
      requested_product_owner_id: data.requested_product_owner_id,
      requested_product_owner_name: data.requested_product_owner_name,
      requested_product: {
        title: data.requested_product_title,
      },
      offered_product: {
        title: data.chosen_product_title,
      },
    });
  } catch (error) {
    console.error("שגיאה בשליפת בקשת החלפה:", error);
    res.status(500).json({ error: "שגיאה בשרת" });
  }
};

// עדכון סטטוס בקשת החלפה
exports.updateExchangeRequestStatus = async (req, res) => {
  const { id } = req.params;
  const { status, userId, userName } = req.body;

  const client = await db.connect();
  try {
    await client.query("BEGIN");

    const { rows } = await client.query(
      `SELECT request_id, product_id, chosen_product_id
       FROM Exchange_Requests 
       WHERE request_id = $1 FOR UPDATE`,
      [id]
    );

    if (rows.length === 0) {
      await client.query("ROLLBACK");
      return res.status(404).json({ error: "Exchange request not found" });
    }

    const { product_id, chosen_product_id } = rows[0];

    await client.query(
      `UPDATE Exchange_Requests 
       SET status = $1, updated_at = CURRENT_TIMESTAMP 
       WHERE request_id = $2`,
      [status, id]
    );

    // ⚠️ אם דחינו – נעדכן זמינות של המוצרים
    if (status === "Rejected") {
      // ➤ המוצר שקיבל את הבקשה
      const { rows: otherRequestsOnProduct } = await client.query(
        `SELECT 1 FROM Exchange_Requests
         WHERE product_id = $1 AND status = 'Pending' AND request_id != $2`,
        [product_id, id]
      );

      const newAvailabilityForProduct =
        otherRequestsOnProduct.length === 0 ? "Available" : "Interested";

      await client.query(
        `UPDATE Products
         SET availability = $1
         WHERE product_id = $2`,
        [newAvailabilityForProduct, product_id]
      );

      // ➤ המוצר שהוצע (אם יש כזה)
      if (chosen_product_id) {
        const { rows: otherRequestsOnOffered } = await client.query(
          `SELECT 1
           FROM Exchange_Requests
           WHERE chosen_product_id = $1 AND status = 'Pending' AND request_id != $2`,
          [chosen_product_id, id]
        );

        const newAvailabilityForOffered =
          otherRequestsOnOffered.length === 0 ? "Available" : "Interested";

        await client.query(
          `UPDATE Products
           SET availability = $1
           WHERE product_id = $2`,
          [newAvailabilityForOffered, chosen_product_id]
        );
      }
    }

    const { rows: productRows } = await client.query(
      `SELECT title FROM Products WHERE product_id = $1`,
      [product_id]
    );

    const productTitle = productRows[0]?.title || `מוצר מספר ${product_id}`;

    // await client.query(
    //   `INSERT INTO Audit_Logs (action, user_id, user_name, details)
    //    VALUES ('עדכון סטטוס בקשת החלפה', $1, $2, $3)`,
    //   [userId, userName, `עודכן סטטוס הבקשה על "${productTitle}" ל-${status}`]
    // );

    await logAudit(
      "עדכון סטטוס בקשת החלפה",
      userId,
      userName,
      `עודכן סטטוס הבקשה על "${productTitle}" ל-${status}`
    );

    await client.query("COMMIT");
    res.status(200).json({ message: "הסטטוס עודכן בהצלחה" });
  } catch (error) {
    await client.query("ROLLBACK");
    console.error(error);
    res.status(500).json({ error: "Failed to update exchange request" });
  } finally {
    client.release();
  }
};

// פעולה חדשה: עדכון המוצרים שהוצעו לבקשת החלפה קיימת
exports.updateExchangeRequestProposalOptions = async (req, res) => {
  const requestId = parseInt(req.params.id);
  const { offeredProductIds } = req.body;

  if (!Array.isArray(offeredProductIds) || offeredProductIds.length === 0) {
    return res.status(400).json({ error: "יש לשלוח לפחות מוצר אחד להצעה" });
  }

  try {
    // בדיקה האם הבקשה קיימת וסטטוסה עדיין Pending
    const { rows } = await db.query(
      `SELECT status FROM Exchange_Requests WHERE request_id = $1`,
      [requestId]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: "בקשה לא נמצאה" });
    }

    if (rows[0].status !== "Pending") {
      return res
        .status(400)
        .json({ error: "ניתן לערוך רק בקשות במצב Pending" });
    }

    // מחיקת ההצעות הקודמות
    await db.query(
      `DELETE FROM Exchange_Proposal_Options WHERE request_id = $1`,
      [requestId]
    );

    // הוספת הצעות חדשות
    const insertValues = offeredProductIds
      .map((productId, idx) => `($1, $${idx + 2})`)
      .join(", ");

    await db.query(
      `INSERT INTO Exchange_Proposal_Options (request_id, offered_product_id)
       VALUES ${insertValues}`,
      [requestId, ...offeredProductIds]
    );

    res.status(200).json({ message: "הצעות עודכנו בהצלחה" });
  } catch (error) {
    console.error("שגיאה בעדכון הצעות לבקשה:", error);
    res.status(500).json({ error: "שגיאה בעת עדכון הצעות" });
  }
};

// ביטול בקשה - מותר רק אם היא עדיין Pending

exports.cancelExchangeRequest = async (req, res) => {
  const { id } = req.params;
  const { userId, userName } = req.body;

  const client = await db.connect();
  try {
    await client.query("BEGIN");

    // שליפת פרטי הבקשה והמוצר
    const { rows } = await client.query(
      `SELECT er.*, p.title AS product_title
       FROM Exchange_Requests er
       JOIN Products p ON er.product_id = p.product_id
       WHERE er.request_id = $1 FOR UPDATE`,
      [id]
    );

    const request = rows[0];
    if (!request) {
      await client.query("ROLLBACK");
      return res.status(404).json({ error: "בקשה לא נמצאה" });
    }

    if (request.status !== "Pending") {
      await client.query("ROLLBACK");
      return res
        .status(400)
        .json({ error: "לא ניתן לבטל בקשה שאושרה או נדחתה" });
    }

    // מחיקת ההצעות והבקשה
    await client.query(
      `DELETE FROM Exchange_Proposal_Options WHERE request_id = $1`,
      [id]
    );
    await client.query(`DELETE FROM Exchange_Requests WHERE request_id = $1`, [
      id,
    ]);

    // 🔁 החזרת זמינות המוצר אם אין עליו בקשות פעילות נוספות
    const { rows: otherRequests } = await client.query(
      `SELECT 1 FROM Exchange_Requests
       WHERE product_id = $1 AND status = 'Pending'`,
      [request.product_id]
    );

    if (otherRequests.length === 0) {
      await client.query(
        `UPDATE Products
         SET availability = 'Available'
         WHERE product_id = $1 AND availability = 'Interested'`,
        [request.product_id]
      );
    }

    // // לוג
    // await client.query(
    //   `INSERT INTO Audit_Logs (action, user_id, user_name, details)
    //    VALUES ('ביטול בקשת החלפה', $1, $2, $3)`,
    //   [
    //     userId,
    //     userName,
    //     `בוטלה בקשה על "${request.product_title}" (מספר ${id})`,
    //   ]
    // );

    await logAudit(
      "ביטול בקשת החלפה",
      userId,
      userName,
      `בוטלה בקשה על "${request.product_title}" (מספר ${id})`
    );

    await client.query("COMMIT");
    res.status(200).json({ message: "הבקשה בוטלה בהצלחה" });
  } catch (error) {
    await client.query("ROLLBACK");
    console.error(error);
    res.status(500).json({ error: "שגיאה בביטול הבקשה" });
  } finally {
    client.release();
  }
};

// קביעת פגישה בין שני הצדדים אחרי ששניהם הסכימו
exports.confirmMeeting = async (req, res) => {
  const { requestId } = req.params;
  const { meeting_option_id, meeting_date } = req.body;
  const userId = req.user.userId;
  const userName = req.user.name;

  try {
    const result = await db.query(
      `INSERT INTO Scheduled_Meetings (exchange_request_id, meeting_option_id, meeting_date)
       VALUES ($1, $2, $3)
       ON CONFLICT (exchange_request_id) DO UPDATE
       SET meeting_option_id = EXCLUDED.meeting_option_id,
           meeting_date = EXCLUDED.meeting_date`,
      [requestId, meeting_option_id, meeting_date]
    );

    // שליפת פרטי המפגש עבור הלוג
    const meetingDetails = await db.query(
      `SELECT mo.city, mo.location_name, mo.hour
       FROM MeetingOptions mo
       WHERE mo.id = $1`,
      [meeting_option_id]
    );

    const { city, location_name, hour } = meetingDetails.rows[0];

    // // הוספת שורת Audit Log
    // await db.query(
    //   `INSERT INTO Audit_Logs (action, user_id, user_name, details)
    //    VALUES ($1, $2, $3, $4)`,
    //   [
    //     "Meeting Confirmed",
    //     userId,
    //     userName,
    //     `אישר פגישה לבקשה ${requestId} ב-${city}, ${location_name} בתאריך ${meeting_date} בשעה ${hour}`,
    //   ]
    // );

    await logAudit(
      "Meeting Confirmed",
      userId,
      userName,
      `אישר פגישה לבקשה ${requestId} ב-${city}, ${location_name} בתאריך ${meeting_date} בשעה ${hour}`)

    res.status(200).json({ message: "Meeting confirmed successfully." });
  } catch (error) {
    console.error("Error confirming meeting:", error);
    res.status(500).json({ error: "Failed to confirm meeting" });
  }
};

// מוחק פגישות שהזמן שלהן עבר
exports.cleanupPastMeetings = async () => {
  try {
    await db.query(
      `DELETE FROM Scheduled_Meetings
       WHERE scheduled_date < CURRENT_DATE`
    );
    console.log("🧹 Deleted old meetings");
  } catch (err) {
    console.error("❌ Failed to clean old meetings", err);
  }
};

exports.getExistingExchangeRequest = async (req, res) => {
  const product_id = Number(req.query.product_id);
  const user_id = Number(req.query.user_id);
  console.log(req.query);

  if (!product_id || !user_id) {
    return res.status(400).json({ error: "חסרים פרמטרים נדרשים" });
  }

  // 🔹 בדיקה: כל הבקשות על המוצר הזה
  const allRequests = await db.query(
    "SELECT * FROM Exchange_Requests WHERE chosen_product_id = $1",
    [product_id]
  );

  // 🔹 בדיקה: בקשות מאושרות
  const approvedRequests = await db.query(
    "SELECT * FROM Exchange_Requests WHERE chosen_product_id = $1 AND status != 'Pending'",
    [product_id]
  );

  // 🔹 בדיקה: האם המשתמש הוא אחד הצדדים
  const userMatch = await db.query(
    `SELECT er.request_id, er.user_id AS sender, p.user_id AS owner
   FROM Exchange_Requests er
   JOIN Products p ON er.product_id = p.product_id
   WHERE er.product_id = $1`,
    [product_id]
  );

  try {
    const result = await db.query(
      `
      SELECT er.request_id, er.status
      FROM Exchange_Requests er
      JOIN Products p1 ON er.product_id = p1.product_id
      JOIN Products p2 ON er.chosen_product_id = p2.product_id
      WHERE er.status != 'Pending'
        AND (
          er.user_id = $1       -- המשתמש ששלח את הבקשה
          OR p1.user_id = $1    -- המשתמש הוא הבעלים של המוצר שקיבל את הבקשה
          OR p2.user_id = $1    -- המשתמש הוא הבעלים של המוצר שהוצע (chosen_product_id)
        )
        AND (
          er.product_id = $2 OR er.chosen_product_id = $2
        )
      LIMIT 1
      `,
      [user_id, product_id]
    );

    if (result.rows.length === 0) {
      return res
        .status(404)
        .json({ message: "לא נמצאה בקשה מאושרת למוצר זה עם המשתמש הנתון" });
    }

    return res.status(200).json(result.rows[0]);
  } catch (err) {
    console.error("שגיאה בחיפוש בקשה קיימת:", err);
    return res.status(500).json({ error: "שגיאה בשרת" });
  }
};
