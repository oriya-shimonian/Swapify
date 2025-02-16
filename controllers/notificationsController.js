const db = require('../config/db');

// יצירת התראה חדשה
exports.createNotification = async (req, res) => {
    const { userId, message, status } = req.body;
    try {
        const result = await db.query(
            `INSERT INTO Notifications (user_id, message, status) 
            VALUES ($1, $2, $3) RETURNING *`,
            [userId, message, status]
        );
        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to create notification' });
    }
};

//  קבלת כל ההתראות של המשתמש
exports.getAllNotifications = async (req, res) => {
    const { userId } = req.params;
    try {
        const result = await db.query('SELECT * FROM Notifications WHERE userId = $1', userId);
        res.status(200).json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch notifications' });
    }
};

// סימון התראה כנקראה
exports.markNotificationAsRead = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await db.query(
            `UPDATE Notifications 
            SET status = 'Read', updated_at = CURRENT_TIMESTAMP 
            WHERE notification_id = $1 RETURNING *`,
            [id]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Notification not found' });
        }
        res.status(200).json(result.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to mark notification as read' });
    }
};
