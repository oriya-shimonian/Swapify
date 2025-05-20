const db = require("../config/db");
const { emitNotification } = require("./socketEmitter");

async function createNotification({ userId, type, message, contextId = null }) {
  const result = await db.query(
    `INSERT INTO Notifications (user_id, type, message, context_id, status)
         VALUES ($1, $2, $3, $4, 'Unread')
         RETURNING *`,
    [userId, type, message, contextId]
  );

  // ✅ שליחת ההתראה בזמן אמת
  emitNotification(userId, {
    type,
    message,
    contextId,
  });
  return result.rows[0];
}

module.exports = {
  createNotification,
};
