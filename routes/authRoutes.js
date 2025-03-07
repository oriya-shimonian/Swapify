const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { authenticateUser } = require("../middlewares/authMiddleware");

// נתיב להתחברות (Login)
router.post('/login', authController.loginUser);

// check if the user is already logged in
router.get("/check-auth", authenticateUser, (req, res) => {
  res.json({ user: req.user }); // מחזיר את פרטי המשתמש המאומת
});

module.exports = router;
