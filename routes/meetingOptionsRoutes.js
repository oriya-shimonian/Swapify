const express = require("express");
const router = express.Router();
const meetingOptionsController = require("../controllers/meetingOptionsController");
const { authenticateUser, isAdmin } = require("../middlewares/authMiddleware");
const checkBanStatus = require("../middlewares/checkBanStatus");

// ✅ קריאה לכל המיקומים הפעילים (למשתמשים רגילים או כללי)
router.get("/active", authenticateUser, checkBanStatus, meetingOptionsController.getActiveMeetingOptions);

// ✅ כל המיקומים (כולל לא פעילים) – לממשק ניהול
router.get("/admin", authenticateUser, isAdmin,  meetingOptionsController.getAllMeetingOptions);

// ✅ קריאה לפי מזהה יחיד
router.get("/:id", authenticateUser, checkBanStatus, meetingOptionsController.getMeetingOptionById);


// ✅ כל המיקומים (כולל לא פעילים) — לממשק ניהול
router.get("/", authenticateUser, isAdmin, meetingOptionsController.getAllMeetingOptions);

// ✅ יצירה
router.post("/", authenticateUser, isAdmin, meetingOptionsController.createMeetingOption);

// ✅ עדכון
router.put("/:id", authenticateUser, isAdmin, meetingOptionsController.updateMeetingOption);

// ✅ מחיקה
router.delete("/:id", authenticateUser, isAdmin, meetingOptionsController.deleteMeetingOption);

module.exports = router;
