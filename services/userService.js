const db = require('../config/db');

async function getFullUserById(userId) {
  const query = `
    SELECT u.user_id, u.name, u.email, u.profile_picture, u.location, 
           u.auth_provider, u.notification_enabled, u.is_banned,
           u.created_at, u.updated_at, r.role_name
    FROM Users u
    JOIN Roles r ON u.role_id = r.role_id
    WHERE u.user_id = $1
  `;

  const result = await db.query(query, [userId]);

  return result.rows[0] || null;
}

module.exports = {
  getFullUserById,
};
