const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const db = require('../config/db');
require('dotenv').config();

// התחברות משתמש (Login)
exports.loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        // חיפוש המשתמש במסד הנתונים
        const user = await db.query('SELECT * FROM Users WHERE email = $1', [email]);

        if (user.rows.length === 0) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        console.log(user.rows[0], "users rows", password, "password", user.rows[0].password_hash, "password_hash", email, "email");
        // בדיקת הסיסמה (השוואת סיסמאות עם bcrypt)
        const isMatch = await bcrypt.compare(password, user.rows[0].password_hash);
        if (!isMatch) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        // יצירת טוקן JWT עם נתוני המשתמש
        const token = jwt.sign(
            { id: user.rows[0].user_id, role: user.rows[0].role_id },
            process.env.JWT_SECRET,  // ה-SECRET מתוך `.env`
            { expiresIn: '7d' }      // תוקף הטוקן: שבוע
        );

        res.status(200).json({ token });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to log in' });
    }
};
