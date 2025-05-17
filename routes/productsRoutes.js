const express = require('express');
const router = express.Router();
const productsController = require('../controllers/productsController');
const { authenticateUser } = require('../middlewares/authMiddleware');
const { canManageItem } = require('../middlewares/canManageItem');
const checkBanStatus = require('../middlewares/checkBanStatus');

// קבלת כל המוצרים
router.get('/', productsController.getAllProducts);

// קבלת מוצר לפי ID
router.get('/:id', productsController.getProductById);

// קבלת כל המוצרים של משתמש
router.get('/user/:userId', authenticateUser, productsController.getProductsByUser);

// קבלת מוצרים שניתן להציע לבקשת החלפה
router.get('/offerable/:userId', authenticateUser, productsController.getAllUsersOfferableProducts);

// יצירת מוצר חדש
router.post('/', authenticateUser, checkBanStatus, productsController.createProduct);

// עדכון מוצר
router.put('/:id', authenticateUser, checkBanStatus, canManageItem('Products', 'product_id'), productsController.updateProduct);

// מחיקת מוצר
router.delete('/:id', authenticateUser, checkBanStatus, canManageItem('Products', 'product_id'), productsController.deleteProduct);

module.exports = router;
