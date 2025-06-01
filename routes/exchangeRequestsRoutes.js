const express = require('express');
const router = express.Router();
const db = require('../config/db');


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

// קבלת כל הבקשות שנשלח משתמש מסוים (כולל המוצרים שהציע)
router.get('/user/:userId', authenticateUser, exchangeRequestsController.getAllUserExchangeRequests);

// קבלת כל הבקשות שהוגשו על מוצרים של המשתמש
router.get('/incoming/:userId', authenticateUser, exchangeRequestsController.getIncomingExchangeRequests);

// בדיקה אם קיימת כבר בקשת החלפה מהמשתמש הנוכחי למוצר
router.get('/existing', authenticateUser, exchangeRequestsController.getExistingExchangeRequest);

// קריאת בקשה בודדת לפי ID
router.get('/:id', authenticateUser, exchangeRequestsController.getExchangeRequestById);



// // עדכון סטטוס (למשל rejection)
// router.put('/:id', authenticateUser, checkBanStatus, canManageItem('Exchange_Requests', 'request_id'), exchangeRequestsController.updateExchangeRequestStatus);

const extraCheck = async ({ userId, itemId }) => {
    const result = await db.query(
      `SELECT p.user_id
       FROM Exchange_Requests er
       JOIN Products p ON er.product_id = p.product_id
       WHERE er.request_id = $1`,
      [itemId]
    );
    return result.rows[0]?.user_id === userId;
  };
  
router.put('/:id', authenticateUser, checkBanStatus, canManageItem('Exchange_Requests', 'request_id', extraCheck), exchangeRequestsController.updateExchangeRequestStatus);

router.put("/:id/options", authenticateUser, checkBanStatus, canManageItem('Exchange_Requests', 'request_id', extraCheck), exchangeRequestsController.updateExchangeRequestProposalOptions);
  
router.delete('/:id', authenticateUser, checkBanStatus, canManageItem('Exchange_Requests', 'request_id'), exchangeRequestsController.cancelExchangeRequest);

router.post("/:requestId/confirm-meeting", authenticateUser, checkBanStatus, exchangeRequestsController.confirmMeeting);
module.exports = router;
