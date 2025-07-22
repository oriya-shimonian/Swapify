const express = require('express');
const router = express.Router();
const productsController = require('../controllers/productsController');
const exchangeRequestsController = require('../controllers/exchangeRequestsController');
const booksController = require('../controllers/booksController');  // ✅ הוספת ספרים
const boardGamesController = require('../controllers/boardGamesController');  // ✅ הוספת משחקי קופסה
const puzzlesController = require('../controllers/puzzlesController');  // ✅ הוספת פאזלים
const { authenticateUser } = require('../middlewares/authMiddleware');
const checkBanStatus = require('../middlewares/checkBanStatus'); // ✅ הוספת בדיקת משתמש חסום

// יצירת מוצר חדש
router.post('/products', authenticateUser, checkBanStatus, productsController.createProduct);

// יצירת בקשת החלפה
router.post('/exchange-requests', authenticateUser, checkBanStatus, exchangeRequestsController.createExchangeRequest);

// יצירת ספר חדש
router.post('/books', authenticateUser, checkBanStatus, booksController.createBook);

// יצירת משחק קופסה חדש
router.post('/board-games', authenticateUser, checkBanStatus, boardGamesController.createBoardGame);

// יצירת פאזל חדש
router.post('/puzzles', authenticateUser, checkBanStatus, puzzlesController.createPuzzle);

module.exports = router;
