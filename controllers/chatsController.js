const db = require("../config/db");

// 1. יצירת או שליפת צ'אט קיים לפי בקשה מאושרת ומוצר
exports.getOrCreateChatByProductId = async (req, res) => {
  const userId = req.user.user_id;
  const productId = parseInt(req.params.productId);

  try {
    const result = await db.query(
      `SELECT * FROM Exchange_Requests
       WHERE product_id = $1 AND user_id = $2 AND status = 'Approved'
       LIMIT 1`,
      [productId, userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "לא נמצאה בקשה מאושרת בין המשתמשים למוצר זה." });
    }

    const request = result.rows[0];

    if (request.chat_id) {
      return res.status(200).json({ chat_id: request.chat_id });
    }

    // יצירת צ'אט חדש
    const insertChat = await db.query(
      `INSERT INTO Chats (exchange_request_id) VALUES ($1) RETURNING chat_id`,
      [request.request_id]
    );
    const newChatId = insertChat.rows[0].chat_id;

    // עדכון בקשה עם ה-chat_id
    await db.query(
      `UPDATE Exchange_Requests SET chat_id = $1 WHERE request_id = $2`,
      [newChatId, request.request_id]
    );

    return res.status(201).json({ chat_id: newChatId });
  } catch (err) {
    console.error("❌ Failed to get or create chat:", err);
    res.status(500).json({ error: "שגיאה בעת פתיחת צ'אט" });
  }
};

// 2. שליפת כל הצ'אטים של המשתמש
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

// 3. סימון הודעה כנקראה (עבור משתמש ספציפי בצ'אט)
exports.markMessageAsRead = async (req, res) => {
  const userId = req.user.user_id;
  const messageId = parseInt(req.params.messageId);

  try {
    await db.query(
      `INSERT INTO Message_Read_Status (message_id, user_id)
       VALUES ($1, $2)
       ON CONFLICT DO NOTHING`,
      [messageId, userId]
    );
    res.status(200).json({ message: "ההודעה סומנה כנקראה" });
  } catch (err) {
    console.error("❌ Failed to mark message as read:", err);
    res.status(500).json({ error: "שגיאה בעת סימון כהודעה שנקראה" });
  }
};

// 4. מחיקת צ'אט (לשיקולך - עשוי להפריע ללוגים)
exports.deleteChat = async (req, res) => {
  const chatId = parseInt(req.params.chatId);

  try {
    await db.query(`DELETE FROM Chats WHERE chat_id = $1`, [chatId]);
    res.status(200).json({ message: "הצ'אט נמחק בהצלחה" });
  } catch (err) {
    console.error("❌ Failed to delete chat:", err);
    res.status(500).json({ error: "שגיאה בעת מחיקת צ'אט" });
  }
};