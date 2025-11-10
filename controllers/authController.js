const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const db = require('../config/db');
const { admin } = require("../config/firebaseAdmin");
require('dotenv').config();


const { getFullUserById } = require("../services/userService");

exports.loginUser = async (req, res) => {
  const { email, password } = req.body;
  console.log(1111, email);
  
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
    console.log(222, email, password, result, "res");
    
    if (result.rows.length === 0) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const userWithPassword = result.rows[0];

    if (userWithPassword['is_banned']) {
      return res.status(403).json({ error: "User is banned" });
    }

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

exports.firebaseLogin = async (req, res) => {
  try {
    const { token } = req.body;
    if (!token) return res.status(400).json({ error: "Missing token" });

    const decoded = await admin.auth().verifyIdToken(token);
    const { email, name, picture, firebase: { sign_in_provider } } = decoded;

    const authProvider = sign_in_provider; // google.com / facebook.com
    const cleanProvider = authProvider.includes("google") ? "Google" : "Facebook";

    // בדיקה אם קיים
    const userQuery = await db.query(`SELECT * FROM Users WHERE email = $1`, [email]);
    let user = userQuery.rows[0];
    console.log(user, " - User found for firebase login attempt");
    
    if (user && user.is_banned) {
      return res.status(403).json({ error: "המשתמש חסום ואינו יכול להתחבר" });
    }

    if (!user) {
      const insert = await db.query(
        `INSERT INTO Users (name, email, profile_picture, auth_provider, role_id, is_banned, notification_enabled, location)
         VALUES ($1, $2, $3, $4, 2, false, true, '') RETURNING *`,
        [name, email, picture || null, cleanProvider]
      );
      user = insert.rows[0];
    } else if (user.auth_provider !== cleanProvider) {
      return res.status(400).json({
        error: `משתמש זה נרשם באמצעות ${user.auth_provider} – לא ניתן להתחבר עם ${cleanProvider}`,
      });
    }

    // JWT משלך
    const jwtToken = jwt.sign(
      { id: user.user_id, role: user.role_id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.status(200).json({ token: jwtToken, user });
  } catch (err) {
    console.error("firebaseLogin error:", err);
    res.status(401).json({ error: "Firebase authentication failed" });
  }
};


