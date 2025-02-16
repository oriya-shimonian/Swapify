const db = require('../config/db');

// יצירת בקשת החלפה חדשה
exports.createExchangeRequest = async (req, res) => {
    const { userId, productId, exchangeProductId, status } = req.body;
    try {
        const result = await db.query(
            `INSERT INTO Exchange_Requests (user_id, product_id, exchange_product_id, status) 
            VALUES ($1, $2, $3, $4) RETURNING *`,
            [userId, productId, exchangeProductId, status]
        );
        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to create exchange request' });
    }
};

// קבלת כל בקשות ההחלפה
exports.getAllExchangeRequests = async (req, res) => {
    try {
        const result = await db.query('SELECT * FROM Exchange_Requests');
        res.status(200).json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch exchange requests' });
    }
};

// קבלת בקשת החלפה של משתמש לפי ID
exports.getAllUserExchangeRequests = async (req, res) => {
    const { userId } = req.params;
    try {
        const result = await db.query('SELECT * FROM Exchange_Requests WHERE user_id = $1', [userId]);
        res.status(200).json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch user\'s exchange requests' });
    }
};

// קבלת בקשת החלפה לפי ID
exports.getExchangeRequestById = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await db.query('SELECT * FROM Exchange_Requests WHERE request_id = $1', [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Exchange request not found' });
        }
        res.status(200).json(result.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch exchange request' });
    }
};

// עדכון סטטוס בקשת החלפה
exports.updateExchangeRequest = async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    try {
        const result = await db.query(
            `UPDATE Exchange_Requests 
            SET status = $1, updated_at = CURRENT_TIMESTAMP 
            WHERE request_id = $2 RETURNING *`,
            [status, id]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Exchange request not found' });
        }
        res.status(200).json(result.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to update exchange request' });
    }
};

// // מחיקת בקשת החלפה
// exports.deleteExchangeRequest = async (req, res) => {
//     const { id } = req.params;
//     try {
//         const result = await db.query('DELETE FROM Exchange_Requests WHERE request_id = $1 RETURNING *', [id]);
//         if (result.rows.length === 0) {
//             return res.status(404).json({ error: 'Exchange request not found' });
//         }
//         res.status(200).json({ message: 'Exchange request deleted successfully', request: result.rows[0] });
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ error: 'Failed to delete exchange request' });
//     }
// };
