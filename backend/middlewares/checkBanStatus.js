const db = require('../config/db');

const checkBanStatus = async (req, res, next) => {
    try {
        const userId = req.user.id; // ID מתוך ה-Token
        const result = await db.query('SELECT is_banned FROM Users WHERE user_id = $1', [userId]);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }

        if (result.rows[0].is_banned) {
            return res.status(403).json({ error: 'Your account is banned. You cannot perform this action.' });
        }

        next(); // אם המשתמש לא חסום, ממשיכים
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Authorization check failed' });
    }
};

module.exports = checkBanStatus;


// import { Request, Response, NextFunction } from 'express';
// import db from '../config/db';

// export const checkBanStatus = async (req: Request, res: Response, next: NextFunction) => {
//     try {
//         const userId = req.user?.id; // מניחים שה-ID מגיע מ-middleware של אימות
//         if (!userId) return res.status(401).json({ error: 'Unauthorized' });

//         const result = await db.query('SELECT is_banned FROM Users WHERE user_id = $1', [userId]);

//         if (result.rows.length === 0) return res.status(404).json({ error: 'User not found' });

//         if (result.rows[0].is_banned) {
//             return res.status(403).json({ error: 'Your account is banned' });
//         }

//         next();
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ error: 'Authorization check failed' });
//     }
// };
