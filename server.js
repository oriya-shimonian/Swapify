const express = require("express");
const dotenv = require("dotenv");
const pool = require("./config/db");
const cors = require("cors");
const http = require("http");
const cron = require("node-cron");

// const { cleanupPastMeetings } = require("./controllers/exchangeRequestsController");
// cron.schedule("0 0 * * *", async () => {
//   console.log("📆 רץ cron job למחיקת פגישות ישנות...");
//   await cleanupPastMeetings();
// });

const { Server } = require("socket.io");
const {
  initSocketIO,
  setUserCurrentChat,
  clearUserCurrentChat,
} = require("./services/socketEmitter");

dotenv.config();

const app = express();
const server = http.createServer(app);
const PORT = process.env.PORT || 3000;

// ✅ התחברות למסד הנתונים
const connectDB = async () => {
  try {
    await pool.connect();
    console.log("✅ Connected to PostgreSQL");
  } catch (err) {
    console.error("❌ Failed to connect to PostgreSQL", err);
    process.exit(1);
  }
};

// ✅ הגדרת Socket.IO
const io = new Server(server, {
  cors: {
    origin: ["http://localhost:5173", "http://localhost:3000"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  },
});

// ✅ ניהול משתמשים מחוברים
const connectedUsers = new Map();

io.on("connection", (socket) => {
  socket.on("register", (userId) => {
    connectedUsers.set(userId, socket.id);
  });

  socket.on("join_chat", ({ userId, chatId }) => {
    console.log(`📥 User ${userId} joined chat_${chatId}`);
    setUserCurrentChat(userId, chatId);
    socket.join(`chat_${chatId}`);
  });

  socket.on("leave_chat", (userId) => {
    clearUserCurrentChat(userId);
    console.log(`👤 user ${userId} left their current chat`);
  });

  socket.on("disconnect", () => {
    for (const [userId, socketId] of connectedUsers.entries()) {
      if (socketId === socket.id) {
        connectedUsers.delete(userId);
        clearUserCurrentChat(userId);
        console.log(`🔴 user ${userId} disconnected`);
      }
    }
  });
});

// ✅ חיבור Socket למערכת
initSocketIO(io, connectedUsers);

// ✅ JSON + CORS
app.use(express.json({ limit: "15mb" }));

// const allowedOrigins = ["http://localhost:5173", "http://localhost:3000"];
app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// ✅ ראוטים
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/users", require("./routes/usersRoutes"));
app.use("/api/products", require("./routes/productsRoutes"));
app.use("/api/board-games", require("./routes/boardGamesRoutes"));
app.use("/api/books", require("./routes/booksRoutes"));
app.use("/api/puzzles", require("./routes/puzzlesRoutes"));
app.use("/api/exchange-requests", require("./routes/exchangeRequestsRoutes"));
app.use("/api/notifications", require("./routes/notificationsRoutes"));
app.use("/api/roles", require("./routes/rolesRoutes"));
app.use("/api/uploads", require("./routes/uplaodRoutes"));
app.use("/api/about", require("./routes/aboutRoutes"));
app.use("/api/audit-logs", require("./routes/auditLogsRoutes"));
app.use("/api/chats", require("./routes/chatsRoutes"));
app.use("/api/messages", require("./routes/messagesRoutes"));
app.use("/api", require("./routes/autoFillRoutes"));
app.use("/api/statistics", require("./routes/statisticsRoutes"));

// ✅ 404 – אם אף ראוט לא תפס
const { notFoundHandler } = require("./middlewares/404Midlleware");
app.use(notFoundHandler);

// ✅ שגיאות כלליות
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err.stack);
  res.status(500).json({ error: "Something went wrong!" });
});

// ✅ הפעלת השרת
connectDB();
server.listen(PORT, () => {
  console.log(`🚀 Server running on port:${PORT}`);
});
