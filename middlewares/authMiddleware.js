const db = require('../config/db');

// Middleware לבדיקה אם משתמש הוא Admin
exports.isAdmin = async (req, res, next) => {
    console.log("Checking if user is admin...", req.user);
    
    const userId = req.user?.id;  // מניחים שהמשתמש מאומת ו-ID נמצא ב-token

    try {
        const result = await db.query(
            `SELECT role_id FROM Users WHERE user_id = $1`,
            [userId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }

        // נניח ש-Admin = role_id 3
        if (result.rows[0].role_id !== 3) {
            return res.status(403).json({ error: 'Access denied: Admins only' });
        }

        next();
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to check user role' });
    }
};

const jwt = require('jsonwebtoken');
require('dotenv').config();

// Middleware לוודא שהמשתמש מחובר
exports.authenticateUser = (req, res, next) => {
    const token = req.header('Authorization')?.split(" ")[1]; // להוציא רק את הטוקן עצמו
    // console.log(`Token: ${token}`); // הוספת לוג כדי לבדוק את הטוקן
    
    if (!token) {
        return res.status(401).json({ error: 'Access denied. No token provided.' });
    }

    try {
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        req.user = verified; // מוסיפים את המשתמש המחובר ל-request
        next();
    } catch (error) {
        res.status(403).json({ error: 'Invalid token' });
    }
};
