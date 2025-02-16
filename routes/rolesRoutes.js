const express = require('express');
const router = express.Router();
const rolesController = require('../controllers/rolesController');
const { authenticateUser, isAdmin } = require('../middlewares/authMiddleware');

// קבלת כל התפקידים (רק משתמשים מחוברים)
router.get('/', authenticateUser, isAdmin, rolesController.getAllRoles);

// קבלת תפקיד של משתמש לפי ID
router.get('/:userId', authenticateUser, isAdmin, rolesController.getUserRole);

// יצירת תפקיד חדש (Admin בלבד)
router.post('/', authenticateUser, isAdmin, rolesController.createRole);

module.exports = router;
