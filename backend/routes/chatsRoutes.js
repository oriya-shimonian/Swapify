// 📁 chatsRoutes.js
const express = require("express");
const router = express.Router();

const chatsController = require("../controllers/chatsController");
const { authenticateUser } = require("../middlewares/authMiddleware");
const checkBanStatus = require("../middlewares/checkBanStatus");

// יצירת צ'אט חדש
router.post("/", authenticateUser, checkBanStatus, chatsController.createChat);

// שליפת צ'אט לפי מזהה בקשת החלפה
router.get("/by-request/:requestId",authenticateUser, checkBanStatus, chatsController.getChatByExchangeRequestId);

// שליפת צ'אט לפי מזהה צ'אט
router.get("/:chatId", authenticateUser, checkBanStatus, chatsController.getChatById);

// שליפת כל הצ'אטים של המשתמש
router.get("/my/all", authenticateUser, checkBanStatus, chatsController.getUserChats);

module.exports = router;
