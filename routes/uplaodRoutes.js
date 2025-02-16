const express = require('express');
const router = express.Router();
const uploadController = require('../controllers/uploadController');
const { authenticateUser } = require('../middlewares/authMiddleware');
const checkBanStatus = require('../middlewares/checkBanStatus'); // ✅ הוספת בדיקת משתמש חסום

// נתיב להעלאת תמונה
router.post('/upload', authenticateUser, checkBanStatus, uploadController.upload, uploadController.uploadImage);

module.exports = router;
