const express = require('express');
const router = express.Router();
const boardGamesController = require('../controllers/boardGamesController');
const { authenticateUser } = require('../middlewares/authMiddleware');
const { canManageItem } = require('../middlewares/canManageItem');
const checkBanStatus = require('../middlewares/checkBanStatus');

router.get('/', boardGamesController.getAllBoardGames);
router.get('/:id', boardGamesController.getBoardGameById);
router.get('/user/:userId', authenticateUser, boardGamesController.getAllUserBoardGames);
router.post('/', authenticateUser, checkBanStatus, boardGamesController.createBoardGame);
router.put('/:id', authenticateUser, checkBanStatus, canManageItem('Board_Games', 'product_id'), boardGamesController.updateBoardGame);
router.delete('/:id', authenticateUser, checkBanStatus, canManageItem('Board_Games', 'product_id'), boardGamesController.deleteBoardGame);

module.exports = router;
