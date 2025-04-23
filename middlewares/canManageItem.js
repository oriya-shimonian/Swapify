const db = require('../config/db');

exports.canManageItem = (tableName, idColumn) => async (req, res, next) => {
    const userId = req.user.id; // המשתמש המחובר
    const userRole = req.user.role_id; // הרול של המשתמש (1=Admin)
    const { id } = req.params; // ID של הפריט שמנסים לשנות

    try {
        // שולפים את הפריט ומי היוצר שלו
        const result = await db.query(
            `SELECT user_id FROM ${tableName} WHERE ${idColumn} = $1`,
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Item not found' });
        }

        const itemOwner = result.rows[0].user_id;

        // רק בעל הפריט או Admin יכולים לעדכן/למחוק
        if (userId !== itemOwner && userRole !== 1) {
            return res.status(403).json({ error: 'אין לך השראה לבצע פעולה זו' });
        }

        next();
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Authorization check failed' });
    }
};
