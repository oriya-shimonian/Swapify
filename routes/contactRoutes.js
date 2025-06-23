const express = require("express");
const router = express.Router();
const {
  createContactMessage,
  getContactMessages,
  getContactStats,
  getMyContactMessages,
  updateContactMessage
} = require("../controllers/contactController");
const { authenticateUser, isAdmin } = require('../middlewares/authMiddleware');



router.post("/", createContactMessage);

// משתמשים
router.get("/my", authenticateUser, getMyContactMessages);

// אדמין בלבד
router.get("/", authenticateUser, isAdmin, getContactMessages);

router.get("/stats", authenticateUser, isAdmin, getContactStats);

router.patch("/:id", requireAdmin, updateContactMessage);

module.exports = router;
