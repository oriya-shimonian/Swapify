const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { authenticateUser } = require("../middlewares/authMiddleware");
const { getFullUserById } = require("../services/userService");

// נתיב להתחברות (Login)
router.post('/login', authController.loginUser);

// check if the user is already logged in
router.get("/check-auth", authenticateUser, async (req, res) => {
  try {
    const user = await getFullUserById(req.user.id);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json({ user });
  } catch (error) {
    console.error("check-auth error:", error);
    res.status(500).json({ error: "Server error during authentication check" });
  }
});

module.exports = router;
