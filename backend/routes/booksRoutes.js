const express = require('express');
const router = express.Router();
const booksController = require('../controllers/booksController');
const { authenticateUser } = require('../middlewares/authMiddleware');
const { canManageItem } = require('../middlewares/canManageItem');
const checkBanStatus = require('../middlewares/checkBanStatus');

router.get('/', booksController.getAllBooks);
router.get('/:id', booksController.getBookById);
router.get('/user/:userId', authenticateUser, booksController.getAllUserBooks);
router.post('/', authenticateUser, checkBanStatus, booksController.createBook);
router.put('/:id', authenticateUser, checkBanStatus, canManageItem('Books', 'product_id'), booksController.updateBook);
router.delete('/:id', authenticateUser, checkBanStatus, canManageItem('Books', 'product_id'), booksController.deleteBook);

module.exports = router;
