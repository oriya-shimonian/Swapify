const express = require("express");
const router = express.Router();

const chatsController = require("../controllers/chatsController");
const { authenticateUser } = require("../middlewares/authMiddleware");
const checkBanStatus = require("../middlewares/checkBanStatus");

// שליפת או יצירת צ'אט לפי מוצר ובקשה מאושרת
router.get("/by-request/:productId", authenticateUser, checkBanStatus, chatsController.getOrCreateChatByProductId);

// שליפת כל הצ'אטים של המשתמש
router.get("/my", authenticateUser, checkBanStatus, chatsController.getUserChats);

// סימון הודעה כנקראה
router.post("/mark-read/:messageId", authenticateUser, checkBanStatus, chatsController.markMessageAsRead);

// מחיקת צ'אט (לשיקולך)
router.delete("/:chatId", authenticateUser, checkBanStatus, chatsController.deleteChat);

module.exports = router;
