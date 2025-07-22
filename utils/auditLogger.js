const db = require("../config/db");

const logAudit = async (action, userId, userName, details) => {
  await db.query(
    `INSERT INTO Audit_Logs (action, user_id, user_name, details)
     VALUES ($1, $2, $3, $4)`,
    [action, userId, userName, details]
  );
};

module.exports = logAudit;
