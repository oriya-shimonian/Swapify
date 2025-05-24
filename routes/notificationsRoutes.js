const express = require('express');
const router = express.Router();
const notificationsController = require('../controllers/notificationsController');
const { authenticateUser } = require('../middlewares/authMiddleware');
const checkBanStatus = require('../middlewares/checkBanStatus');

router.post("/", authenticateUser, checkBanStatus, notificationsController.createNotification);

router.get("/unread-count", authenticateUser, checkBanStatus, notificationsController.getUnreadCount);

router.get("/enriched", authenticateUser, checkBanStatus, notificationsController.getUserNotificationsEnriched);

router.put("/:id/read", authenticateUser, checkBanStatus, notificationsController.markNotificationAsRead);

router.put("/mark-all", authenticateUser, checkBanStatus, notificationsController.markAllAsRead);


module.exports = router;
