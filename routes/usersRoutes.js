const express = require('express');
const router = express.Router();
const usersController = require('../controllers/usersController');
const { authenticateUser, isAdmin } = require('../middlewares/authMiddleware');
const checkBanStatus = require('../middlewares/checkBanStatus'); // ✅ הוספת בדיקת משתמש חסום

// קבלת כל המשתמשים (Admin בלבד)
router.get('/', authenticateUser, isAdmin, usersController.getAllUsers);

router.get("/location-stats", authenticateUser, isAdmin, usersController.getLocationStats);

// חסימת משתמשים (Admin בלבד)
router.put('/ban-many', authenticateUser, isAdmin, usersController.banUsers);

// מחיקת משתמשים(Admin בלבד)
router.delete('/many', authenticateUser, isAdmin, usersController.deleteUsers);

// קבלת משתמש לפי ID (רק המשתמש עצמו או Admin יכול לראות את הפרופיל)
router.get('/:id', authenticateUser, usersController.getUserById);

// יצירת משתמש חדש (לא דורש התחברות)
router.post('/', usersController.createUser);

// עדכון משתמש (משתמש יכול לעדכן את עצמו, אבל לא אחרים)
router.put('/:id', authenticateUser, checkBanStatus, usersController.updateUser);

// חסימת משתמש (Admin בלבד)
router.put('/:id/ban', authenticateUser, isAdmin, usersController.banUser);

// מחיקת משתמש (Admin בלבד)
router.delete('/:id', authenticateUser, isAdmin, usersController.deleteUser);

// שינוי רול של משתמש בודד
router.put('/:id/role', authenticateUser, isAdmin, usersController.updateUserRole);

module.exports = router;
