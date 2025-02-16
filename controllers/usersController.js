const db = require('../config/db'); // חיבור ל-PostgreSQL

// Create User
exports.createUser = async (req, res) => {
    const { name, email, passwordHash, roleId } = req.body;
    try {
        const result = await db.query(
            `INSERT INTO Users (name, email, password_hash, role_id) 
            VALUES ($1, $2, $3, $4) RETURNING *`,
            [name, email, passwordHash, roleId]
        );
        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to create user' });
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
