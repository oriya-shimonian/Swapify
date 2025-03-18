const db = require('../config/db'); // חיבור ל-PostgreSQL
const bcrypt = require('bcryptjs');

// // Create User
// exports.createUser = async (req, res) => {
//     const { name, email, passwordHash, roleId } = req.body;
//     try {
//         const result = await db.query(
//             `INSERT INTO Users (name, email, password_hash, role_id) 
//             VALUES ($1, $2, $3, $4) RETURNING *`,
//             [name, email, passwordHash, roleId]
//         );
//         res.status(201).json(result.rows[0]);
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ error: 'Failed to create user' });
//     }
// };

exports.createUser = async (req, res) => {
    try {
        const { username, email, password, roleId = 2, isBanned = false, notificationEnabled, locations } = req.body;
        if (!username || !email || !password || !locations || locations.length === 0) {
            return res.status(400).json({ error: ' שרת!!!! יש למלא את כל השדות' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // const result = await db.query(
        //     `INSERT INTO Users (name, email, password_hash, role_id, is_banned, notification_enabled, location)
        //     VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
        //     [username, email, hashedPassword, roleId, isBanned, notificationEnabled, locations.join(', ')]
        // );

        // // שליפת המשתמש החדש עם role_name
        // const userQuery = `
        //     SELECT u.*, r.role_name AS role_name
        //     FROM Users u
        //     JOIN Roles r ON u.role_id = r.role_id
        //     WHERE u.user_id = $1
        // `;
        // const user = await db.query(userQuery, [result.rows[0].user_id]);

        // console.log('New user:', user);
        // const newUser = result.rows[0];
        // delete newUser.password_hash;
        // res.status(201).json(newUser);
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
        const result = await db.query('SELECT * FROM Users');
        res.status(200).json(result.rows);
    } catch (error) {
        console.error(error);
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
exports.deleteUser = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await db.query('DELETE FROM Users WHERE user_id = $1 RETURNING *', [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.status(200).json({ message: 'User deleted successfully', user: result.rows[0] });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to delete user' });
    }
};


exports.banUser = async (req, res) => {
    const { id } = req.params; // ה-ID של המשתמש שחוסמים
    const adminId = req.user.id; // ה-ID של המשתמש המבצע (נניח שהוא ב-token)
    
    try {
        // בדיקה אם המשתמש הוא ADMIN
        const adminCheck = await db.query('SELECT role_id FROM Users WHERE user_id = $1', [adminId]);
        if (adminCheck.rows.length === 0 || adminCheck.rows[0].role_id !== 1) { // נניח 1 = Admin
            return res.status(403).json({ error: 'Unauthorized: Only Admins can ban users' });
        }

        // חסימת המשתמש
        const result = await db.query(
            'UPDATE Users SET is_banned = TRUE WHERE user_id = $1 RETURNING *',
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.status(200).json({ message: 'User has been banned', user: result.rows[0] });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to ban user' });
    }
};
