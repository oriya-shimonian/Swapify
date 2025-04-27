const db = require("../config/db");

// יצירת בקשת החלפה חדשה עם אפשרות להצעת עד 4 מוצרים
exports.createExchangeRequest = async (req, res) => {
  const { userId, productId, offeredProductIds, userName } = req.body;

  if (!Array.isArray(offeredProductIds) || offeredProductIds.length === 0 || offeredProductIds.length > 4) {
    return res.status(400).json({ error: "יש להציע בין מוצר אחד לארבעה מוצרים" });
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

      await client.query(
        `UPDATE Products
         SET availability = 'Interested'
         WHERE product_id = $1 AND availability = 'Available'`,
        [offeredProductId]
      );
    }

    await client.query(
      `INSERT INTO Audit_Logs (action, user_id, user_name, details)
       VALUES ('יצירת בקשת החלפה', $1, $2, $3)`,
      [userId, userName, `נשלחה בקשת החלפה על מוצר ${productId} עם הצעות: ${offeredProductIds.join(', ')}`]
    );

    await client.query("COMMIT");
    res.status(201).json({ message: "הבקשה נשלחה בהצלחה", requestId });
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

    const result = await client.query(`
      UPDATE Exchange_Requests
      SET status = 'Approved', chosen_product_id = $1, updated_at = CURRENT_TIMESTAMP
      WHERE request_id = $2
    `, [chosenProductId, requestId]);
    

    if (!result.rows.length) {
      await client.query("ROLLBACK");
      return res.status(404).json({ error: "המוצר לא נמצא" });
    }

    const productStatus = result.rows[0].availability;
    if (productStatus !== "Available" && productStatus !== "Interested") {
      await client.query("ROLLBACK");
      return res.status(400).json({ error: "המוצר אינו זמין לאישור בקשה" });
    }

    await client.query(
      `UPDATE Products SET availability = 'Pending' WHERE product_id = $1`,
      [chosenProductId]
    );

    await client.query(
      `UPDATE Exchange_Requests
       SET status = 'Approved', chosen_product_id = $1, updated_at = CURRENT_TIMESTAMP
       WHERE request_id = $2`,
      [chosenProductId, id]
    );

    await client.query(
      `INSERT INTO Audit_Logs (action, user_id, user_name, details)
       VALUES ('אישור בקשת החלפה', $1, $2, $3)`,
      [userId, userName, `אושר מוצר מספר ${chosenProductId} לבקשה מספר ${id}`]
    );

    await client.query("COMMIT");
    res.status(200).json({ message: "הבקשה אושרה והמוצר הועבר לסטטוס Pending" });
  } catch (error) {
    await client.query("ROLLBACK");
    console.error(error);
    res.status(500).json({ error: "שגיאה באישור הבקשה" });
  } finally {
    client.release();
  }
};

// השלמת ההחלפה בפועל
exports.completeExchangeRequest = async (req, res) => {
    const { id } = req.params;
    const { userId, userName } = req.body;
  
    const client = await db.connect();
    try {
      await client.query("BEGIN");
  
      // שליפת הבקשה והפרטים
      const { rows } = await client.query(
        `SELECT chosen_product_id, product_id
         FROM Exchange_Requests
         WHERE request_id = $1 AND status = 'Approved' FOR UPDATE`,
        [id]
      );
  
      const request = rows[0];
      if (!request) {
        await client.query("ROLLBACK");
        return res.status(404).json({ error: "בקשה לא מאושרת או לא קיימת" });
      }
  
      const { chosen_product_id, product_id } = request;
  
      // עדכון סטטוס המוצר
      await client.query(
        `UPDATE Products
         SET availability = 'Exchanged'
         WHERE product_id = $1`,
        [chosen_product_id]
      );
  
      // יצירת רישום היסטוריה
      await client.query(
        `INSERT INTO Exchange_History (user_id, exchange_product_id, received_product_id, status)
         VALUES ($1, $2, $3, 'Completed')`,
        [userId, chosen_product_id, product_id]
      );
  
      // עדכון סטטוס הבקשה
      await client.query(
        `UPDATE Exchange_Requests
         SET status = 'Completed', updated_at = CURRENT_TIMESTAMP
         WHERE request_id = $1`,
        [id]
      );
  
      // לוג ב־Audit
      await client.query(
        `INSERT INTO Audit_Logs (action, user_id, user_name, details)
         VALUES ('השלמת החלפה', $1, $2, $3)`,
        [userId, userName, `הבקשה ${id} הושלמה – מוצר ${chosen_product_id} סומן כהוחלף בפועל`]
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
    // שליפת כל הבקשות שהמשתמש שלח
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
        p.availability AS requested_availability
      FROM Exchange_Requests r
      JOIN Products p ON r.product_id = p.product_id
      WHERE r.user_id = $1
      ORDER BY r.created_at DESC`,
      [userId]
    );

    const enrichedRequests = [];

    for (const row of rows) {
      // שליפת המוצרים שהוצעו בבקשה
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
        offered_products: offeredProducts.map(p => ({
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
        }
      });
    }

    res.status(200).json(enrichedRequests);
  } catch (error) {
    console.error("שגיאה בשרת getAllUserExchangeRequests:", error.message);
    res.status(500).json({ error: "שגיאה בטעינת הבקשות" });  }
};

// קבלת בקשות שהוגשו על מוצרים של המשתמש
exports.getIncomingExchangeRequests = async (req, res) => {
  const { userId } = req.params;

  try {
    const { rows } = await db.query(
      `SELECT er.*, 
                json_agg(json_build_object(
                  'product_id', p.product_id,
                  'title', p.title
                )) AS offered_products,
                json_build_object(
                  'product_id', target.product_id,
                  'title', target.title,
                  'image_url', target.image_url
                ) AS requested_product,
                u.name AS requester_name
         FROM Exchange_Requests er
         JOIN Products target ON er.product_id = target.product_id
         JOIN Users u ON er.user_id = u.user_id
         LEFT JOIN Exchange_Proposal_Options epo ON er.request_id = epo.request_id
         LEFT JOIN Products p ON epo.offered_product_id = p.product_id
         WHERE target.user_id = $1
         GROUP BY er.request_id, target.product_id, u.name
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
exports.getExchangeRequestById = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await db.query(
      "SELECT * FROM Exchange_Requests WHERE request_id = $1",
      [id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Exchange request not found" });
    }
    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch exchange request" });
  }
};

// עדכון סטטוס בקשת החלפה
exports.updateExchangeRequest = async (req, res) => {
    const { id } = req.params;
    const { status, userId, userName } = req.body;
    try {
      const result = await db.query(
        `UPDATE Exchange_Requests 
              SET status = $1, updated_at = CURRENT_TIMESTAMP 
              WHERE request_id = $2 RETURNING *`,
        [status, id]
      );
      if (result.rows.length === 0) {
        return res.status(404).json({ error: "Exchange request not found" });
      }
  
      await db.query(
        `INSERT INTO Audit_Logs (action, user_id, user_name, details)
         VALUES ('עדכון סטטוס בקשת החלפה', $1, $2, $3)`,
        [userId, userName, `עודכן סטטוס לבקשה ${id} ל-${status}`]
      );
  
      res.status(200).json(result.rows[0]);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to update exchange request" });
    }
  };

// ביטול בקשה - מותר רק אם היא עדיין Pending
exports.cancelExchangeRequest = async (req, res) => {
    const { id } = req.params;
    const { userId, userName } = req.body;
  
    const client = await db.connect();
    try {
      await client.query('BEGIN');
  
      const { rows } = await client.query(
        `SELECT * FROM Exchange_Requests WHERE request_id = $1 FOR UPDATE`,
        [id]
      );
  
      const request = rows[0];
      if (!request) {
        await client.query('ROLLBACK');
        return res.status(404).json({ error: 'בקשה לא נמצאה' });
      }
      if (request.status !== 'Pending') {
        await client.query('ROLLBACK');
        return res.status(400).json({ error: 'לא ניתן לבטל בקשה שאושרה או נדחתה' });
      }
  
      await client.query(`DELETE FROM Exchange_Proposal_Options WHERE request_id = $1`, [id]);
      await client.query(`DELETE FROM Exchange_Requests WHERE request_id = $1`, [id]);
  
      await client.query(
        `INSERT INTO Audit_Logs (action, user_id, user_name, details)
         VALUES ('ביטול בקשת החלפה', $1, $2, $3)`,
        [userId, userName, `בוטלה בקשה מספר ${id}`]
      );
  
      await client.query('COMMIT');
      res.status(200).json({ message: 'הבקשה בוטלה בהצלחה' });
    } catch (error) {
      await client.query('ROLLBACK');
      console.error(error);
      res.status(500).json({ error: 'שגיאה בביטול הבקשה' });
    } finally {
      client.release();
    }
  };


// // מחיקת בקשת החלפה
// exports.deleteExchangeRequest = async (req, res) => {
//     const { id } = req.params;
//     try {
//         const result = await db.query('DELETE FROM Exchange_Requests WHERE request_id = $1 RETURNING *', [id]);
//         if (result.rows.length === 0) {
//             return res.status(404).json({ error: 'Exchange request not found' });
//         }
//         res.status(200).json({ message: 'Exchange request deleted successfully', request: result.rows[0] });
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ error: 'Failed to delete exchange request' });
//     }
// };
