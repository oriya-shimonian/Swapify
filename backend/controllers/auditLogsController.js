// 📁 controllers/auditLogsController.js
const db = require('../config/db');
exports.getAuditLogs = async (req, res) => {
    try {
      const { page = 1, limit = 10, action, user, from, to } = req.query;
      const offset = (page - 1) * limit;
  
      let conditions = [];
      let filterValues = [];
      let i = 1;
  
      if (action) {
        conditions.push(`action ILIKE $${i++}`);
        filterValues.push(`%${action}%`);
      }
      if (user) {
        conditions.push(`user_name ILIKE $${i++}`);
        filterValues.push(`%${user}%`);
      }
      if (from) {
        conditions.push(`timestamp >= $${i++}`);
        filterValues.push(from);
      }
      if (to) {
        conditions.push(`timestamp <= $${i++}`);
        filterValues.push(to);
      }
  
      const where = conditions.length ? 'WHERE ' + conditions.join(' AND ') : '';
  
      // שליפה של הלוגים
      const query = `
        SELECT * FROM Audit_Logs
        ${where}
        ORDER BY timestamp DESC
        LIMIT $${i} OFFSET $${i + 1}
      `;
      const result = await db.query(query, [...filterValues, limit, offset]);
  
      // שליפה של מספר כולל
      const countQuery = `
        SELECT COUNT(*) FROM Audit_Logs
        ${where}
      `;
      const countResult = await db.query(countQuery, filterValues);
      const total = parseInt(countResult.rows[0].count, 10);
  
      res.json({
        data: result.rows,
        page: Number(page),
        totalPages: Math.ceil(total / limit),
        totalItems: total,
      });
    } catch (err) {
      console.error('Error getting audit logs:', err);
      res.status(500).json({ message: 'Failed to retrieve audit logs', error: err.message });
    }
  };
  