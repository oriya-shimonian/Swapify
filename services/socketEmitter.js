// 📁 services/socketEmitter.js
let io = null;
let connectedUsers = new Map();

function initSocketIO(ioInstance, usersMap) {
  io = ioInstance;
  connectedUsers = usersMap;
}

function emitNotification(userId, data) {
  const socketId = connectedUsers.get(userId);
  if (io && socketId) {
    console.log("📨 שליחת סוקט למשתמש:", userId, "=>", connectedUsers.get(userId));
    io.to(socketId).emit("new_notification", data);
  }
}

module.exports = {
  initSocketIO,
  emitNotification,
};
