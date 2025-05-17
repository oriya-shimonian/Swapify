// 📁 services/crossRequestMatcher.js
const db = require("../config/db");

// פונקציה שמקבלת בקשה אחת ובודקת התאמות צולבות
async function findAndInsertCrossMatchesForRequest(requestId) {
  const client = await db.connect();

  try {
    // שליפת פרטי הבקשה (מי הגיש, איזה מוצר מבוקש ומה ההצעות)
    const { rows: requestRows } = await client.query(`
      SELECT user_id, product_id FROM Exchange_Requests
      WHERE request_id = $1 AND status = 'Pending'
    `, [requestId]);

    if (!requestRows.length) return;

    const { user_id: userA, product_id: requestedProductA } = requestRows[0];

    // שליפת ההצעות שהמשתמש הציע בבקשה זו
    const { rows: offeredRows } = await client.query(`
      SELECT offered_product_id FROM Exchange_Proposal_Options
      WHERE request_id = $1
    `, [requestId]);

    const offeredProductIds = offeredRows.map(row => row.offered_product_id);

    if (offeredProductIds.length === 0) return;

    // חיפוש בקשות הפוכות שמגישים בקשה על אחד מהמוצרים שאני הצעתי, ומציעים את המוצר שאני ביקשתי
    const { rows: matches } = await client.query(`
      SELECT r2.request_id AS matching_request_id
      FROM Exchange_Requests r2
      JOIN Exchange_Proposal_Options op2 ON r2.request_id = op2.request_id
      WHERE r2.product_id = ANY($1::int[])
        AND op2.offered_product_id = $2
        AND r2.user_id != $3
        AND r2.status = 'Pending'
    `, [offeredProductIds, requestedProductA, userA]);

    for (const match of matches) {
      const requestBId = match.matching_request_id;

      // הכנס לזוג – לפי סדר ID כדי למנוע כפילויות
      const [a, b] = requestId < requestBId ? [requestId, requestBId] : [requestBId, requestId];

      // הכנסה לטבלה – אם לא קיים כבר
      await client.query(`
        INSERT INTO Cross_Exchange_Matches (request_a_id, request_b_id)
        VALUES ($1, $2)
        ON CONFLICT (request_a_id, request_b_id) DO NOTHING
      `, [a, b]);

      await client.query(`
        INSERT INTO Notifications (user_id, message, status)
        SELECT user_id, $2, 'Unread'
        FROM Exchange_Requests
        WHERE request_id = ANY($1::int[])
      `, [[a, b], 'נמצאה התאמה הדדית לבקשת ההחלפה שלך!']);
    }

  } catch (err) {
    console.error("שגיאה בזיהוי התאמות צולבות:", err);
  } finally {
    client.release();
  }
}

module.exports = { findAndInsertCrossMatchesForRequest };
