const express = require('express');
const router = express.Router();
const notificationsController = require('../controllers/notificationsController');
const { authenticateUser } = require('../middlewares/authMiddleware');
const checkBanStatus = require('../middlewares/checkBanStatus');

router.get('/', authenticateUser, notificationsController.getAllNotifications);
router.post('/', authenticateUser, checkBanStatus, notificationsController.createNotification);
router.put('/:id/read', authenticateUser, checkBanStatus, notificationsController.markNotificationAsRead);

module.exports = router;
