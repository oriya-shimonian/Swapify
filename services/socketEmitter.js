let io = null;
let connectedUsers = new Map();
let userCurrentChats = new Map();

function initSocketIO(ioInstance, usersMap) {
  io = ioInstance;
  connectedUsers = usersMap;
}

function emitNewNotification(userId, data) {
  const socketId = connectedUsers.get(userId);
  if (io && socketId) {
    // console.log("📨 שליחת סוקט למשתמש:", userId, "=>", connectedUsers.get(userId));
    io.to(socketId).emit("new_notification", data);
  }
}

function emitCrossRequestMatch(userId, data) {
  const socketId = connectedUsers.get(userId);
  if (io && socketId) {
    console.log("🔁 שליחת סוקט של התאמה צולבת ל־userId:", userId);
    io.to(socketId).emit("cross_request_match", data);
  }
}

function emitNewMessage(chatId, message) {
  if (io) {
    io.to(`chat_${chatId}`).emit("new_message", message);
  }
}

function getUserCurrentChatId(userId) {
  return userCurrentChats.get(userId);
}

function setUserCurrentChat(userId, chatId) {
  userCurrentChats.set(userId, chatId);
}

function clearUserCurrentChat(userId) {
  userCurrentChats.delete(userId);
}

module.exports = {
  initSocketIO,
  emitNewNotification,
  emitCrossRequestMatch,
  emitNewMessage,
  getUserCurrentChatId, 
  setUserCurrentChat,
  clearUserCurrentChat
};
