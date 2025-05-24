// const express = require('express');
// const dotenv = require('dotenv');
// const pool = require('./config/db');
// const cors = require('cors');
// const app = express();
// dotenv.config();

// const PORT = process.env.PORT || 3000;

// // התחברות למסד הנתונים
// const connectDB = async () => {
//     try {
//         await pool.connect();
//         console.log('✅ Connected to PostgreSQL');
//     } catch (err) {
//         console.error('❌ Failed to connect to PostgreSQL', err);
//         process.exit(1);
//     }
// };

// app.use(express.json(({ limit: '15mb' })));

// // ייבוא הנתיבים
// const authRoutes = require('./routes/authRoutes');
// const usersRoutes = require('./routes/usersRoutes');
// const productsRoutes = require('./routes/productsRoutes');
// const boardGamesRoutes = require('./routes/boardGamesRoutes');
// const booksRoutes = require('./routes/booksRoutes');
// const puzzlesRoutes = require('./routes/puzzlesRoutes');
// const exchangeRequestsRoutes = require('./routes/exchangeRequestsRoutes');
// const notificationsRoutes = require('./routes/notificationsRoutes');
// const rolesRoutes = require('./routes/rolesRoutes');
// const uploadRoutes = require('./routes/uplaodRoutes');
// const aboutRoutes = require('./routes/aboutRoutes');
// const auditLogsRoutes = require('./routes/auditLogsRoutes');
// const { notFoundHandler } = require('./middlewares/404Midlleware');
// const { startCrossRequestScheduler } = require('./scripts/crossRequestScheduler');

// // חיבור הנתיבים ל-API
// // app.use(cors()); // לאפשר לכל מקור לגשת ל-API

// // app.use(cors({
// //   origin: function (origin, callback) {
// //       if (!origin || allowedOrigins.includes(origin)) {
// //           callback(null, true);
// //       } else {
// //           callback(new Error('Not allowed by CORS'));
// //       }
// //   },
// //   credentials: true
// // }));


// const allowedOrigins = [
//     'http://localhost:5173', // Vite
//     'http://localhost:3000', // React ב-Dev
//     'https://your-production-domain.com' // לשנות לדומיין שלך בפרודקשן
// ];

// app.use(cors({
//     origin: function (origin, callback) {
//         if (!origin || allowedOrigins.includes(origin)) {
//             callback(null, true);
//         } else {
//             callback(new Error('Not allowed by CORS'));
//         }
//     },
//     credentials: true,
//     methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
//     allowedHeaders: ['Content-Type', 'Authorization']
// }));
// startCrossRequestScheduler();
// app.use('/api/auth', authRoutes);
// app.use('/api/users', usersRoutes);
// app.use('/api/products', productsRoutes);
// app.use('/api/board-games', boardGamesRoutes);
// app.use('/api/books', booksRoutes);
// app.use('/api/puzzles', puzzlesRoutes);
// app.use('/api/exchange-requests', exchangeRequestsRoutes);
// app.use('/api/notifications', notificationsRoutes);
// app.use('/api/roles', rolesRoutes);
// app.use('/api/uploads', uploadRoutes);
// app.use('/api/about', aboutRoutes);
// app.use('/api/audit-logs', auditLogsRoutes);
// // Middleware לטיפול בנתיבים שלא קיימים (404)
// app.use(notFoundHandler);

// app.use((err, req, res, next) => {
//   console.error(err.stack);
//   res.status(500).json({ error: 'Something went wrong!' });
// });

// // התחברות למסד הנתונים
// connectDB();

// // הפעלת השרת
// app.listen(PORT, () => {
//     console.log(`🚀 Server running on http://localhost:${PORT}`);
// });

// module.exports = pool;
// 📁 server.js
const express = require("express");
const dotenv = require("dotenv");
const pool = require("./config/db");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");
const { initSocketIO } = require("./services/socketEmitter");

dotenv.config();

const app = express();
const server = http.createServer(app); // יצירת שרת HTTP
const PORT = process.env.PORT || 3000;

// התחברות למסד הנתונים
const connectDB = async () => {
  try {
    await pool.connect();
    console.log("✅ Connected to PostgreSQL");
  } catch (err) {
    console.error("❌ Failed to connect to PostgreSQL", err);
    process.exit(1);
  }
};

// הגדרת Socket.IO
const io = new Server(server, {
  cors: {
    origin: ["http://localhost:5173"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  },
});

// ניהול משתמשים מחוברים
const connectedUsers = new Map();

io.on("connection", (socket) => {
  // רישום מזהה המשתמש המחובר
  socket.on("register", (userId) => {
    connectedUsers.set(userId, socket.id);
    console.log("🟢 משתמש נרשם עם userId:", userId);
  });

  // התנתקות משתמש
  socket.on("disconnect", () => {
    for (const [userId, id] of connectedUsers.entries()) {
      if (id === socket.id) connectedUsers.delete(userId);
    }
  });
});

// חיבור בין io לשירותים אחרים
initSocketIO(io, connectedUsers);

// פרסינג של JSON
app.use(express.json({ limit: "15mb" }));

// הגדרת CORS
const allowedOrigins = ["http://localhost:5173", "http://localhost:3000"];
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

// ייבוא ראוטים
const authRoutes = require("./routes/authRoutes");
const usersRoutes = require("./routes/usersRoutes");
const productsRoutes = require("./routes/productsRoutes");
const boardGamesRoutes = require("./routes/boardGamesRoutes");
const booksRoutes = require("./routes/booksRoutes");
const puzzlesRoutes = require("./routes/puzzlesRoutes");
const exchangeRequestsRoutes = require("./routes/exchangeRequestsRoutes");
const notificationsRoutes = require("./routes/notificationsRoutes");
const rolesRoutes = require("./routes/rolesRoutes");
const uploadRoutes = require("./routes/uplaodRoutes");
const aboutRoutes = require("./routes/aboutRoutes");
const auditLogsRoutes = require("./routes/auditLogsRoutes");

const { notFoundHandler } = require("./middlewares/404Midlleware");

// שימוש בנתיבים
app.use("/api/auth", authRoutes);
app.use("/api/users", usersRoutes);
app.use("/api/products", productsRoutes);
app.use("/api/board-games", boardGamesRoutes);
app.use("/api/books", booksRoutes);
app.use("/api/puzzles", puzzlesRoutes);
app.use("/api/exchange-requests", exchangeRequestsRoutes);
app.use("/api/notifications", notificationsRoutes);
app.use("/api/roles", rolesRoutes);
app.use("/api/uploads", uploadRoutes);
app.use("/api/about", aboutRoutes);
app.use("/api/audit-logs", auditLogsRoutes);

// טיפול ב־404
app.use(notFoundHandler);

// טיפול בשגיאות כלליות
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err.stack);
  res.status(500).json({ error: "Something went wrong!" });
});

// חיבור למסד הנתונים והפעלת השרת
connectDB();

server.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
