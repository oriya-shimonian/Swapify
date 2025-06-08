// 📁 messagesRoutes.js
const express = require("express");
const router = express.Router();

const messagesController = require("../controllers/messagesController");
const { authenticateUser } = require("../middlewares/authMiddleware");
const checkBanStatus = require("../middlewares/checkBanStatus");


// יצירת הודעה בצ'אט
router.post("/chat/:chatId", authenticateUser, checkBanStatus, messagesController.createMessage);

// שליפת כל ההודעות בצ'אט
router.get("/chat/:chatId", authenticateUser, checkBanStatus, messagesController.getMessagesByChatId);

// שליפת הודעה בודדת
router.get("/:messageId", authenticateUser, checkBanStatus, messagesController.getMessageById);

// סימון הודעה כנקראה
router.patch("/:messageId/read", authenticateUser, checkBanStatus, messagesController.markMessageAsRead);

module.exports = router;
