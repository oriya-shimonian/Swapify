const db = require("../db");
const { sendAuditLog } = require("../utils/auditLog"); // אם את משתמשת בזה

// שליחת פנייה ליצירת קשר
exports.createContactMessage = async (req, res) => {
  const {
    name,
    email,
    topic,
    subject,
    message,
    reference_link,
    reported_user_id,
  } = req.body;

  const user_id = req.user?.user_id || null;

  if (!name || !email || !message) {
    return res.status(400).json({ error: "נא למלא שם, מייל והודעה." });
  }

  try {
    const insertQuery = `
      INSERT INTO Contact_Messages (
        user_id, reported_user_id, name, email, topic,
        subject, message, reference_link
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING *
    `;

    const values = [
      user_id,
      reported_user_id || null,
      name,
      email,
      topic || "Other",
      subject || null,
      message,
      reference_link || null,
    ];

    const result = await db.query(insertQuery, values);

    // Audit log אופציונלי
    if (user_id) {
    //   await sendAuditLog({
    //     action: "User Contact Message Sent",
    //     user_id,
    //     details: `נשלחה פנייה בנושא "${topic || "ללא נושא"}"`,
    //   });
    //TODO: Uncomment if you want to use audit logs
    }

    res.status(201).json({ message: "הפנייה התקבלה בהצלחה", data: result.rows[0] });
  } catch (error) {
    console.error("❌ שגיאה בשליחת הפנייה:", error);
    res.status(500).json({ error: "אירעה שגיאה בעת שליחת הפנייה" });
  }
};


exports.getContactMessages = async (req, res) => {
  const {
    topic,
    status,
    fromDate,
    toDate,
    search,
    limit = 50,
    offset = 0,
  } = req.query;

  const filters = [];
  const values = [];
  let i = 1;

  if (topic) {
    filters.push(`topic = $${i++}`);
    values.push(topic);
  }

  if (status) {
    filters.push(`status = $${i++}`);
    values.push(status);
  }

  if (fromDate && toDate) {
    filters.push(`created_at BETWEEN $${i++} AND $${i++}`);
    values.push(fromDate, toDate);
  }

  if (search) {
    filters.push(`(LOWER(name) LIKE $${i} OR LOWER(email) LIKE $${i} OR LOWER(subject) LIKE $${i})`);
    values.push(`%${search.toLowerCase()}%`);
    i++;
  }

  const whereClause = filters.length > 0 ? `WHERE ${filters.join(" AND ")}` : "";

  try {
    const query = `
      SELECT * FROM Contact_Messages
      ${whereClause}
      ORDER BY created_at DESC
      LIMIT $${i++} OFFSET $${i++}
    `;
    values.push(limit, offset);

    const result = await db.query(query, values);
    res.status(200).json(result.rows);
  } catch (err) {
    console.error("❌ שגיאה בשליפת פניות:", err);
    res.status(500).json({ error: "שגיאה בטעינת הפניות" });
  }
};

exports.getContactStats = async (req, res) => {
  try {
    const [totalRes, byStatusRes, byTopicRes] = await Promise.all([
      db.query(`SELECT COUNT(*) FROM Contact_Messages`),
      db.query(`
        SELECT status, COUNT(*) 
        FROM Contact_Messages 
        GROUP BY status
      `),
      db.query(`
        SELECT topic, COUNT(*) 
        FROM Contact_Messages 
        GROUP BY topic
      `),
    ]);

    res.status(200).json({
      total: parseInt(totalRes.rows[0].count, 10),
      byStatus: byStatusRes.rows,
      byTopic: byTopicRes.rows,
    });
  } catch (err) {
    console.error("❌ שגיאה בסטטיסטיקות צור קשר:", err);
    res.status(500).json({ error: "שגיאה בטעינת הסטטיסטיקות" });
  }
};


exports.getMyContactMessages = async (req, res) => {
  const userId = req.user.user_id;

  try {
    const result = await db.query(
      `
      SELECT message_id, topic, subject, status, created_at, reference_link, reported_user_id
      +     , response_message
      FROM Contact_Messages
      WHERE user_id = $1
      ORDER BY created_at DESC
      `,
      [userId]
    );

    res.status(200).json(result.rows);
  } catch (err) {
    console.error("❌ שגיאה בשליפת הפניות של המשתמש:", err);
    res.status(500).json({ error: "שגיאה בטעינת הפניות שלך" });
  }
};


exports.updateContactMessage = async (req, res) => {
  const messageId = req.params.id;
  const { status, response_message } = req.body;
  const handled_by = req.user.user_id;

  if (!status && !response_message) {
    return res.status(400).json({ error: "יש לשלוח סטטוס או תגובה לעדכון." });
  }

  try {
    const updateParts = [];
    const values = [];
    let i = 1;

    if (status) {
      updateParts.push(`status = $${i++}`);
      values.push(status);
    }

    if (response_message) {
      updateParts.push(`response_message = $${i++}`);
      values.push(response_message);
    }

    updateParts.push(`handled_by = $${i++}`);
    values.push(handled_by);

    updateParts.push(`handled_at = CURRENT_TIMESTAMP`);

    const query = `
      UPDATE Contact_Messages
      SET ${updateParts.join(", ")}
      WHERE message_id = $${i}
      RETURNING *
    `;
    values.push(messageId);

    const result = await db.query(query, values);

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "פנייה לא נמצאה." });
    }

    // Audit log (אופציונלי)
    // await sendAuditLog({
    //   action: "Contact Message Updated",
    //   user_id: handled_by,
    //   details: `עודכנה פנייה #${messageId} לסטטוס ${status || "ללא שינוי"}`
    // });

    res.status(200).json({ message: "עודכן בהצלחה", data: result.rows[0] });
  } catch (err) {
    console.error("❌ שגיאה בעדכון הפנייה:", err);
    res.status(500).json({ error: "שגיאה בעדכון הפנייה" });
  }
};
