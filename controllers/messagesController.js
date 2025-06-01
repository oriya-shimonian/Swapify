// 📁 messagesController.js
const db = require("../config/db");
const { createNotification } = require("../services/notificationsService");
const {
  emitNewNotification,
  emitNewMessage,
  getUserCurrentChatId,
} = require("../services/socketEmitter");

// 1. יצירת הודעה חדשה
exports.createMessage = async (req, res) => {
  const { chatId } = req.params;
  const { senderId, type, content } = req.body;

  if (!senderId || !type) {
    return res.status(400).json({ error: "חייבים לציין מזהה שולח וסוג הודעה" });
  }

  if (!["text", "system"].includes(type)) {
    return res.status(400).json({ error: "סוג הודעה לא חוקי" });
  }

  if (type === "text" && (!content || content.trim() === "")) {
    return res.status(400).json({ error: "הודעת טקסט חייבת לכלול תוכן" });
  }

  try {
    const insertResult = await db.query(
      `INSERT INTO Messages (chat_id, sender_id, type, content)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [chatId, senderId, type, content || null]
    );

    const newMessage = insertResult.rows[0];

    // עדכון זמן פעילות בצ'אט (אם נוסיף שדה updated_at בהמשך)
    await db.query(
      `UPDATE Chats SET updated_at = CURRENT_TIMESTAMP WHERE chat_id = $1`,
      [chatId]
    );

    // שליפת פרטי הבקשה כדי להבין מי הצד השני
    const chatData = await db.query(
      `SELECT er.user_id AS requester_id, p.user_id AS target_user_id, er.request_id
       FROM Chats c
       JOIN Exchange_Requests er ON c.exchange_request_id = er.request_id
       JOIN Products p ON er.product_id = p.product_id
       WHERE c.chat_id = $1`,
      [chatId]
    );

    const { requester_id, target_user_id, request_id } = chatData.rows[0];
    const recipientId =
      senderId === requester_id ? target_user_id : requester_id;

    // בדיקה אם המשתמש השני בצ'אט פעיל בו כעת
    const activeChatId = getUserCurrentChatId(recipientId);
    const shouldNotify = String(activeChatId) !== String(chatId);

    console.log("🔍 recipientId:", recipientId);
    console.log(
      "🔍 activeChatId from memory:",
      getUserCurrentChatId(recipientId)
    );
    console.log("🔍 current chatId:", chatId);

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
    console.error("❌ שגיאה ביצירת הודעה:", err);
    res.status(500).json({ error: "שגיאה פנימית ביצירת הודעה" });
  }
};

// 2. שליפת כל ההודעות בצ'אט מסוים
exports.getMessagesByChatId = async (req, res) => {
  const { chatId } = req.params;

  try {
    const result = await db.query(
      `SELECT * FROM Messages WHERE chat_id = $1 ORDER BY created_at ASC`,
      [chatId]
    );
    res.status(200).json(result.rows);
  } catch (err) {
    console.error("❌ שגיאה בשליפת הודעות:", err);
    res.status(500).json({ error: "שגיאה פנימית" });
  }
};

// 3. שליפת הודעה בודדת לפי מזהה
exports.getMessageById = async (req, res) => {
  const { messageId } = req.params;

  try {
    const result = await db.query(
      `SELECT * FROM Messages WHERE message_id = $1`,
      [messageId]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "הודעה לא נמצאה" });
    }
    res.status(200).json(result.rows[0]);
  } catch (err) {
    console.error("❌ שגיאה בשליפת הודעה בודדת:", err);
    res.status(500).json({ error: "שגיאה פנימית" });
  }
};

// 4. סימון הודעה כנקראה
exports.markMessageAsRead = async (req, res) => {
  const { messageId } = req.params;

  try {
    await db.query(
      `UPDATE Messages SET read_at = CURRENT_TIMESTAMP WHERE message_id = $1`,
      [messageId]
    );
    res.status(200).json({ message: "ההודעה סומנה כנקראה" });
  } catch (err) {
    console.error("❌ שגיאה בסימון הודעה כנקראה:", err);
    res.status(500).json({ error: "שגיאה פנימית" });
  }
};

// // 5. שליפת הודעה אחת לפי ID (לצורך דיווח עתידי או קונטקסט)
// exports.getMessageById = async (req, res) => {
//   const messageId = parseInt(req.params.messageId);

//   try {
//     const result = await db.query(
//       `SELECT * FROM Messages WHERE message_id = $1`,
//       [messageId]
//     );

//     if (result.rows.length === 0) {
//       return res.status(404).json({ error: "ההודעה לא נמצאה" });
//     }

//     res.status(200).json(result.rows[0]);
//   } catch (err) {
//     console.error("❌ Failed to fetch message:", err);
//     res.status(500).json({ error: "שגיאה בעת שליפת הודעה" });
//   }
// };
