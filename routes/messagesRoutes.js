const express = require("express");
const router = express.Router();

const messagesController = require("../controllers/messagesController");
const { authenticateUser, isAdmin } = require("../middlewares/authMiddleware");
const checkBanStatus = require("../middlewares/checkBanStatus");

// יצירת הודעה חדשה בצ'אט
router.post("/:chatId", authenticateUser, checkBanStatus, messagesController.createMessage);

// שליפת הודעות לפי chatId (כולל limit ו-before)
router.get("/:chatId", authenticateUser, checkBanStatus, messagesController.getMessagesByChatId);

// סימון הודעה כנקראה (לשימוש בצ'אט זוגי בלבד)
router.post("/mark-read/:messageId", authenticateUser, checkBanStatus, messagesController.markMessageAsRead);

// שליפת הודעה בודדת לפי ID
router.get("/single/:messageId", isAdmin, checkBanStatus, messagesController.getMessageById);

module.exports = router;
