const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// נתיב להתחברות (Login)
router.post('/login', authController.loginUser);

module.exports = router;
