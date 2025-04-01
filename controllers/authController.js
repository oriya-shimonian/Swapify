const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const db = require('../config/db');
require('dotenv').config();

// התחברות משתמש (Login)
// exports.loginUser = async (req, res) => {
//     const { email, password } = req.body;

//     // try {
//     //     // חיפוש המשתמש במסד הנתונים
//     //     const user = await db.query('SELECT * FROM Users WHERE email = $1', [email]);

//     //     if (user.rows.length === 0) {
//     //         return res.status(401).json({ error: 'Invalid email or password' });
//     //     }

//     //     // console.log(user.rows[0], "users rows", password, "password", user.rows[0].password_hash, "password_hash", email, "email");
//     //     // בדיקת הסיסמה (השוואת סיסמאות עם bcrypt)
//     //     const isMatch = await bcrypt.compare(password, user.rows[0].password_hash);
//     //     if (!isMatch) {
//     //         return res.status(401).json({ error: 'Invalid email or password' });
//     //     }

//     //     // יצירת טוקן JWT עם נתוני המשתמש
//     //     const token = jwt.sign(
//     //         { id: user.rows[0].user_id, role: user.rows[0].role_id },
//     //         process.env.JWT_SECRET,  // ה-SECRET מתוך `.env`
//     //         { expiresIn: '7d' }      // תוקף הטוקן: שבוע
//     //     );
        
//     //     res.status(200).json({ token, user: user.rows[0] });
//     try {
//         // חיפוש המשתמש במסד הנתונים כולל שם התפקיד
//         const userQuery = `
//             SELECT u.user_id, u.name, u.email, u.password_hash, u.profile_picture, u.location, 
//                    u.auth_provider, u.notification_enabled, u.is_banned, 
//                    u.created_at, u.updated_at, r.Role_name AS role_name
//             FROM Users u
//             JOIN Roles r ON u.Role_id = r.Role_id
//             WHERE u.email = $1
//         `;
//         const userResult = await db.query(userQuery, [email]);

//         if (userResult.rows.length === 0) {
//             return res.status(401).json({ error: 'Invalid email or password' });
//         }

//         const user = userResult.rows[0];

//         // בדיקת הסיסמה (השוואת סיסמאות עם bcrypt)
//         const isMatch = await bcrypt.compare(password, user.password_hash);
//         if (!isMatch) {
//             return res.status(401).json({ error: 'Invalid email or password' });
//         }

//         // יצירת טוקן JWT עם נתוני המשתמש (עכשיו כולל role_name במקום role_id)
//         const token = jwt.sign(
//             { id: user.user_id, role: user.role_name }, // מחליף role_id ב-role_name
//             process.env.JWT_SECRET, 
//             { expiresIn: '7d' }
//         );

//         // הסרת password_hash מהאובייקט שנחזיר
//         delete user.password_hash;

//         res.status(200).json({ token, user });
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ error: 'Failed to log in' });
//     }
// };

const { getFullUserById } = require("../services/userService");

exports.loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    // חיפוש לפי אימייל כולל סיסמה
    const query = `
      SELECT u.user_id, u.name, u.email, u.password_hash, u.profile_picture, u.location, 
             u.auth_provider, u.notification_enabled, u.is_banned,
             u.created_at, u.updated_at, r.role_name
      FROM Users u
      JOIN Roles r ON u.role_id = r.role_id
      WHERE u.email = $1
    `;
    const result = await db.query(query, [email]);

    if (result.rows.length === 0) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const userWithPassword = result.rows[0];

    const isMatch = await bcrypt.compare(password, userWithPassword.password_hash);
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    // אחרי אימות סיסמה – שולפים את המשתמש בלי הסיסמה
    const user = await getFullUserById(userWithPassword.user_id);
    const token = jwt.sign(
      { id: user.user_id, role: user.role_name },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.status(200).json({ token, user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to log in" });
  }
};



