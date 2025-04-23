const express = require('express');
const router = express.Router();

const exchangeRequestsController = require('../controllers/exchangeRequestsController');
const { authenticateUser } = require('../middlewares/authMiddleware');
const { canManageItem } = require('../middlewares/canManageItem');
const checkBanStatus = require('../middlewares/checkBanStatus');

// יצירת בקשה חדשה
router.post('/', authenticateUser, checkBanStatus, exchangeRequestsController.createExchangeRequest);

// אישור בקשה
router.post('/:id/approve', authenticateUser, checkBanStatus, exchangeRequestsController.approveExchangeRequest);

// השלמת בקשה (למשל, אם הבקשה הושלמה בהצלחה)
router.post('/:id/complete', authenticateUser, checkBanStatus, canManageItem('Exchange_Requests', 'request_id'), exchangeRequestsController.completeExchangeRequest);

// קבלת כל הבקשות ששלח משתמש מסוים (כולל המוצרים שהציע)
router.get('/user/:userId', authenticateUser, exchangeRequestsController.getAllUserExchangeRequests);

// קבלת כל הבקשות שהוגשו על מוצרים של המשתמש
router.get('/incoming/:userId', authenticateUser, exchangeRequestsController.getIncomingExchangeRequests);

// קריאת בקשה בודדת לפי ID
router.get('/:id', authenticateUser, exchangeRequestsController.getExchangeRequestById);

// עדכון סטטוס (למשל rejection)
router.put('/:id', authenticateUser, checkBanStatus, canManageItem('Exchange_Requests', 'request_id'), exchangeRequestsController.updateExchangeRequest);

router.delete('/:id', authenticateUser, checkBanStatus, canManageItem('Exchange_Requests', 'request_id'), exchangeRequestsController.cancelExchangeRequest);

module.exports = router;
