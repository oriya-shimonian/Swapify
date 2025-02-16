const express = require('express');
const router = express.Router();
const exchangeRequestsController = require('../controllers/exchangeRequestsController');
const { authenticateUser } = require('../middlewares/authMiddleware');
const { canManageItem } = require('../middlewares/canManageItem');
const checkBanStatus = require('../middlewares/checkBanStatus');

router.get('/', authenticateUser, exchangeRequestsController.getAllExchangeRequests);
router.get('/:id', authenticateUser, exchangeRequestsController.getExchangeRequestById);
router.get('/user/:userId', authenticateUser, exchangeRequestsController.getAllUserExchangeRequests);
router.post('/', authenticateUser, checkBanStatus, exchangeRequestsController.createExchangeRequest);
router.put('/:id', authenticateUser, checkBanStatus, canManageItem('Exchange_Requests', 'request_id'), exchangeRequestsController.updateExchangeRequest);
// router.delete('/:id', authenticateUser, checkBanStatus, canManageItem('Exchange_Requests', 'request_id'), exchangeRequestsController.deleteExchangeRequest);

module.exports = router;
