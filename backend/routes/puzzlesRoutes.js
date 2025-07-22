const express = require('express');
const router = express.Router();
const puzzlesController = require('../controllers/puzzlesController');
const { authenticateUser } = require('../middlewares/authMiddleware');
const { canManageItem } = require('../middlewares/canManageItem');
const checkBanStatus = require('../middlewares/checkBanStatus'); // ✅ הוספת בדיקת משתמש חסום

router.get('/', puzzlesController.getAllPuzzles);
router.get('/:id', puzzlesController.getPuzzleById);
router.get('/user/:userId', authenticateUser, puzzlesController.getAllUserPuzzles);
router.post('/', authenticateUser, checkBanStatus, puzzlesController.createPuzzle);
router.put('/:id', authenticateUser, checkBanStatus, canManageItem('Puzzles', 'product_id'), puzzlesController.updatePuzzle);
router.delete('/:id', authenticateUser, checkBanStatus, canManageItem('Puzzles', 'product_id'), puzzlesController.deletePuzzle);

module.exports = router;
