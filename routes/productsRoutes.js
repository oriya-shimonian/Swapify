const express = require('express');
const router = express.Router();
const productsController = require('../controllers/productsController');
const { authenticateUser } = require('../middlewares/authMiddleware');
const { canManageItem } = require('../middlewares/canManageItem');
const checkBanStatus = require('../middlewares/checkBanStatus'); // ✅ הוספת בדיקת משתמש חסום

// קבלת כל המוצרים
router.get('/', productsController.getAllProducts);
router.get('/:id', productsController.getProductById);

// יצירת מוצר חדש
router.post('/', authenticateUser, checkBanStatus, productsController.createProduct);

// עדכון מוצר
router.put('/:id', authenticateUser, checkBanStatus, canManageItem('Products', 'product_id'), productsController.updateProduct);

// מחיקת מוצר
router.delete('/:id', authenticateUser, checkBanStatus, canManageItem('Products', 'product_id'), productsController.deleteProduct);

module.exports = router;
