const db = require('../config/db');

// קבלת כל התפקידים
exports.getAllRoles = async (req, res) => {
    try {
        const result = await db.query('SELECT * FROM Roles');
        res.status(200).json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch roles' });
    }
};

// הוספת תפקיד חדש
exports.createRole = async (req, res) => {
    const { roleName } = req.body;
    try {
        const result = await db.query(
            `INSERT INTO Roles (role_name) VALUES ($1) RETURNING *`,
            [roleName]
        );
        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to create role' });
    }
};

// בדיקת רול של משתמש לפי user_id
exports.getUserRole = async (req, res) => {
    const { userId } = req.params;

    try {
        const result = await db.query(
            `SELECT r.role_name FROM Users u 
             JOIN Roles r ON u.role_id = r.role_id 
             WHERE u.user_id = $1`,
            [userId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'User not found or role not assigned' });
        }

        res.status(200).json({ role: result.rows[0].role_name });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch user role' });
    }
};
