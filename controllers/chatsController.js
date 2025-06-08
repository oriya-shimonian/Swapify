const db = require("../config/db");

// 1. יצירת צ'אט חדש
exports.createChat = async (req, res) => {
  const { exchangeRequestId } = req.body;

  if (!exchangeRequestId) {
    return res.status(400).json({ error: "חסר מזהה בקשת החלפה" });
  }

  try {
    // בדיקה אם כבר קיים צ'אט לבקשה הזו
    const existing = await db.query(
      `SELECT * FROM Chats WHERE exchange_request_id = $1`,
      [exchangeRequestId]
    );
    if (existing.rows.length > 0) {
      return res.status(200).json(existing.rows[0]);
    }

    const result = await db.query(
      `INSERT INTO Chats (exchange_request_id)
       VALUES ($1)
       RETURNING *`,
      [exchangeRequestId]
    );

    const newChat = result.rows[0];
    res.status(201).json(newChat);
  } catch (err) {
    console.error("❌ שגיאה ביצירת צ'אט:", err);
    res.status(500).json({ error: "שגיאה פנימית" });
  }
};

// 2. שליפת צ'אט לפי מזהה בקשת החלפה
exports.getChatByExchangeRequestId = async (req, res) => {
  const { requestId } = req.params;

  try {
    const result = await db.query(
      `SELECT * FROM Chats WHERE exchange_request_id = $1`,
      [requestId]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "צ'אט לא נמצא לבקשה זו" });
    }

    res.status(200).json(result.rows[0]);
  } catch (err) {
    console.error("❌ שגיאה בשליפת צ'אט לפי בקשה:", err);
    res.status(500).json({ error: "שגיאה פנימית" });
  }
};

// 3. שליפת צ'אט לפי chat_id
exports.getChatById = async (req, res) => {
  const { chatId } = req.params;

  try {
    const result = await db.query(
      `SELECT * FROM Chats WHERE chat_id = $1`,
      [chatId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "צ'אט לא נמצא" });
    }

    res.status(200).json(result.rows[0]);
  } catch (err) {
    console.error("❌ שגיאה בשליפת צ'אט:", err);
    res.status(500).json({ error: "שגיאה פנימית" });
  }
};

// 4. שליפת כל הצ'אטים של המשתמש
exports.getUserChats = async (req, res) => {
  const userId = req.user.user_id;

  try {
    const result = await db.query(
      `SELECT c.chat_id, c.updated_at, er.request_id, er.product_id,
              p.title AS product_title, p.image_url,
              CASE 
                WHEN er.user_id = $1 THEN p.user_id
                ELSE er.user_id
              END AS other_user_id,
              u.name AS other_user_name
       FROM Chats c
       JOIN Exchange_Requests er ON c.exchange_request_id = er.request_id
       JOIN Products p ON er.product_id = p.product_id
       JOIN Users u ON u.user_id = CASE 
         WHEN er.user_id = $1 THEN p.user_id
         ELSE er.user_id
       END
       WHERE er.user_id = $1 OR p.user_id = $1
       ORDER BY c.updated_at DESC`,
      [userId]
    );

    res.status(200).json(result.rows);
  } catch (err) {
    console.error("❌ Failed to fetch user chats:", err);
    res.status(500).json({ error: "שגיאה בעת טעינת הצ'אטים" });
  }
};
