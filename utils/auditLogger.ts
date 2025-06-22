// utils/auditLogger.ts
const db = require("../config/db"); // Adjust the path as necessary

export const logAudit = async (
  action: string,
  userId: number,
  userName: string,
  details: string
) => {
  await db.query(
    `INSERT INTO Audit_Logs (action, user_id, user_name, details)
       VALUES ($1, $2, $3, $4)`,
    [action, userId, userName, details]
  );
};
