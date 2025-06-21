const db = require('../config/db'); // חיבור ל-PostgreSQL
const bcrypt = require('bcryptjs');
const admin = require("firebase-admin");
const { emitForceLogout } = require('../services/socketEmitter');

exports.createUser = async (req, res) => {
    try {
        const { username, email, password, roleId = 2, isBanned = false, notificationEnabled, locations } = req.body;
        if (!username || !email || !password || !locations || locations.length === 0) {
            return res.status(400).json({ error: ' שרת!!!! יש למלא את כל השדות' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const result = await db.query(
            `INSERT INTO Users (name, email, password_hash, role_id, is_banned, notification_enabled, location)
            VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING user_id`,
            [username, email, hashedPassword, roleId, isBanned, notificationEnabled, locations.join(', ')]
        );

        const userId = result.rows[0].user_id;

        // שליפת המשתמש החדש עם שם התפקיד (Role_name)
        const userQuery = `
            SELECT u.user_id, u.name, u.email, u.is_banned, u.notification_enabled, u.location, 
                   r.Role_name AS role_name
            FROM Users u
            JOIN Roles r ON u.Role_id = r.Role_id
            WHERE u.user_id = $1
        `;
        const userResult = await db.query(userQuery, [userId]);

        if (userResult.rows.length === 0) {
            return res.status(500).json({ error: 'Failed to retrieve user data' });
        }

        const newUser = userResult.rows[0];

        res.status(201).json(newUser);
    } catch (error) {
        console.error('Error creating user:', error);
        res.status(500).json({ error: `Failed to create user ${error.detail}` });
    }
};


// Get All Users
exports.getAllUsers = async (req, res) => {
  try {
    const result = await db.query(`
      SELECT 
        u.user_id,
        u.name,
        u.email,
        u.profile_picture,
        u.location,
        u.auth_provider,
        u.is_banned,
        u.notification_enabled,
        u.created_at,
        u.updated_at,
        r.role_name
      FROM Users u
      JOIN Roles r ON u.role_id = r.role_id
    `);

    res.status(200).json(result.rows);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
};


// Get User by ID
exports.getUserById = async (req, res) => {
    const { id } = req.params;  // ה-ID שמבקש המשתמש
    const userId = req.user.id; // ה-ID של המשתמש המחובר
    const userRole = req.user.role_id; // הרול של המשתמש המחובר

    try {
        // Admin יכול לגשת לכל משתמש, משתמש רגיל רק לעצמו
        if (userId !== parseInt(id) && userRole !== 1) { 
            return res.status(403).json({ error: 'Access denied' });
        }

        const result = await db.query('SELECT * FROM Users WHERE user_id = $1', [id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.status(200).json(result.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch user' });
    }
};

// Update User
exports.updateUser = async (req, res) => {
    const { id } = req.params;
    const { name, email, location } = req.body;
    try {
        const result = await db.query(
            `UPDATE Users 
            SET name = $1, email = $2, location = $3, updated_at = CURRENT_TIMESTAMP 
            WHERE user_id = $4 RETURNING *`,
            [name, email, location, id]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.status(200).json(result.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to update user' });
    }
};

// Delete User
// exports.deleteUser = async (req, res) => {
//     const { id } = req.params;
//     try {
//         const result = await db.query('DELETE FROM Users WHERE user_id = $1 RETURNING *', [id]);
//         if (result.rows.length === 0) {
//             return res.status(404).json({ error: 'User not found' });
//         }
//         res.status(200).json({ message: 'User deleted successfully', user: result.rows[0] });
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ error: 'Failed to delete user' });
//     }
// };
exports.deleteUser = async (req, res) => {
  const userId = Number(req.params.id);

  try {
    // שליפת המשתמש מה־DB
    const result = await db.query("SELECT * FROM Users WHERE user_id = $1", [userId]);
    const user = result.rows[0];

    if (!user) {
      return res.status(404).json({ error: "המשתמש לא נמצא" });
    }

    // אם המשתמש לא REGULAR – מחיקה גם מ־Firebase
    if (user.auth_provider !== "Regular") {
      try {
        const firebaseUser = await admin.auth().getUserByEmail(user.email);
        await admin.auth().deleteUser(firebaseUser.uid);
      } catch (firebaseError) {
        console.error("שגיאה במחיקת המשתמש מ-Firebase:", firebaseError.message);
        // ממשיכים למחוק גם אם זה נכשל
      }
    }

    // מחיקת המשתמש מה־DB
    await db.query("DELETE FROM Users WHERE user_id = $1", [userId]);

    return res.status(200).json({ message: "המשתמש נמחק בהצלחה" });
  } catch (err) {
    console.error("שגיאה במחיקת המשתמש:", err.message);
    return res.status(500).json({ error: "שגיאה בשרת" });
  }
};

// Ban or Unban User
exports.banUser = async (req, res) => {
  const { id } = req.params;
  const adminId = req.user.id;

  try {
    const adminCheck = await db.query('SELECT role_id FROM Users WHERE user_id = $1', [adminId]);
    if (adminCheck.rows.length === 0 || adminCheck.rows[0].role_id !== 3) {
      return res.status(403).json({ error: 'Unauthorized: Only Admins can ban users' });
    }

    const userResult = await db.query('SELECT is_banned FROM Users WHERE user_id = $1', [id]);
    if (userResult.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    const currentStatus = userResult.rows[0].is_banned;
    const newStatus = !currentStatus;

    const result = await db.query(
      'UPDATE Users SET is_banned = $1, updated_at = CURRENT_TIMESTAMP WHERE user_id = $2 RETURNING *',
      [newStatus, id]
    );

    if (newStatus) {
      emitForceLogout(Number(id));
    }

    res.status(200).json({
      message: `User has been ${newStatus ? 'banned' : 'unbanned'}`,
      user: result.rows[0],
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to update user status' });
  }
};
