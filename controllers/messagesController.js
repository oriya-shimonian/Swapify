const db = require("../config/db");
const {
  emitNewNotification,
  emitNewMessage,
  getUserCurrentChatId,
} = require("../services/socketEmitter");
const { createNotification } = require("../services/notificationsService");

// 1. יצירת הודעה חדשה
exports.createMessage = async (req, res) => {
  const { chatId } = req.params;
  const { senderId, type, content, meetingOptionId } = req.body;

  if (!senderId || !type) {
    return res.status(400).json({ error: "Sender ID and type are required." });
  }

  if (type === "text" && (!content || content.trim() === "")) {
    return res.status(400).json({ error: "Text messages must include content." });
  }

  try {
    const insertResult = await db.query(
      `INSERT INTO Messages (chat_id, sender_id, type, content, meeting_option_id)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [chatId, senderId, type, content || null, meetingOptionId || null]
    );

    const newMessage = insertResult.rows[0];

    await db.query(`UPDATE Chats SET updated_at = CURRENT_TIMESTAMP WHERE chat_id = $1`, [chatId]);

    const chatData = await db.query(
      `SELECT er.user_id AS requester_id, p.user_id AS target_user_id, er.request_id
       FROM Chats c
       JOIN Exchange_Requests er ON c.exchange_request_id = er.request_id
       JOIN Products p ON er.product_id = p.product_id
       WHERE c.chat_id = $1`,
      [chatId]
    );

    const { requester_id, target_user_id, request_id } = chatData.rows[0];
    const recipientId = senderId === requester_id ? target_user_id : requester_id;

    const activeChatId = getUserCurrentChatId(recipientId);
    const shouldNotify = String(activeChatId) !== String(chatId);

    if (shouldNotify) {
      const notification = await createNotification({
        userId: recipientId,
        type: "new_message",
        message: "התקבלה הודעה חדשה בצ'אט ההחלפה",
        contextId: request_id,
      });

      emitNewNotification(recipientId, {
        type: "new_message",
        message: notification.message,
        contextId: request_id,
      });
    }

    emitNewMessage(chatId, newMessage);
    res.status(201).json(newMessage);
  } catch (err) {
    console.error("❌ Failed to create message:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

// 2. שליפת הודעות לפי chatId עם תמיכה ב-limit ו-before
exports.getMessagesByChatId = async (req, res) => {
  const { chatId } = req.params;
  const limit = parseInt(req.query.limit) || 20;
  const before = req.query.before;

  try {
    const query = `
      SELECT * FROM Messages
      WHERE chat_id = $1
      ${before ? "AND created_at < $3" : ""}
      ORDER BY created_at DESC
      LIMIT $2
    `;

    const values = before ? [chatId, limit, before] : [chatId, limit];
    const result = await db.query(query, values);

    res.status(200).json(result.rows.reverse());
  } catch (err) {
    console.error("❌ Failed to fetch messages:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

// 3. סימון הודעה כנקראה (לצ'אט 1 על 1)
exports.markMessageAsRead = async (req, res) => {
  const messageId = parseInt(req.params.messageId);

  try {
    await db.query(
      `UPDATE Messages
       SET read_by_recipient = true, read_at = CURRENT_TIMESTAMP
       WHERE message_id = $1`,
      [messageId]
    );
    res.status(200).json({ message: "ההודעה סומנה כנקראה" });
  } catch (err) {
    console.error("❌ Failed to mark message as read:", err);
    res.status(500).json({ error: "שגיאה בסימון כהודעה נקראה" });
  }
};

// 4. שליפת הודעה אחת לפי ID (לצורך דיווח עתידי או קונטקסט)
exports.getMessageById = async (req, res) => {
  const messageId = parseInt(req.params.messageId);

  try {
    const result = await db.query(
      `SELECT * FROM Messages WHERE message_id = $1`,
      [messageId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "ההודעה לא נמצאה" });
    }

    res.status(200).json(result.rows[0]);
  } catch (err) {
    console.error("❌ Failed to fetch message:", err);
    res.status(500).json({ error: "שגיאה בעת שליפת הודעה" });
  }
};