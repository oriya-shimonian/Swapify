const db = require('../config/db');
const logAudit = require('../utils/auditLogger');
exports.getAllSections = async (req, res) => {
  const result = await db.query(`
    SELECT section_id, title, content, updated_by
    FROM About_Sections
    ORDER BY section_id
  `);
  res.status(200).json(result.rows);
};

exports.createSection = async (req, res) => {
  const { title, content, userName, userId } = req.body;

  if (!title && !content) {
    return res.status(400).json({ error: 'Must provide title or content' });
  }

  const insert = await db.query(
    `INSERT INTO About_Sections (title, content, updated_by)
     VALUES ($1, $2, $3)
     RETURNING *`,
    [title, content, userName]
  );

  // await db.query(
  //   `INSERT INTO Audit_Logs (action, user_id, user_name, details)
  //    VALUES ($1, $2, $3, $4)`,
  //   ['הוספת חלק חדש בעמוד קצת עלינו', userId, userName, `כותרת: ${title || '[empty]'} תוכן: ${content || '[empty]'}`]
  // );

  await logAudit(
    'הוספת חלק חדש בעמוד קצת עלינו',
    userId,
    userName,
    `כותרת: ${title || '[empty]'}, תוכן: ${content || '[empty]'}`
  );

  res.status(201).json(insert.rows[0]);
};

exports.updateSection = async (req, res) => {
  const { id } = req.params;
  const { title, content, userName, userId } = req.body;

  const update = await db.query(
    `UPDATE About_Sections
     SET title = $1, content = $2, updated_by = $3
     WHERE section_id = $4
     RETURNING *`,
    [title, content, userName, id]
  );

  // await db.query(
  //   `INSERT INTO Audit_Logs (action, user_id, user_name, details)
  //    VALUES ($1, $2, $3, $4)`,
  //   ['עדכון חלק בעמוד קצת עלינו', userId, userName, `מזהה החלק: ${id}, כותרת: ${title || '[empty]'}, תוכן: ${content || '[empty]'}`]
  // );

  await logAudit(
    'עדכון חלק בעמוד קצת עלינו',
    userId,
    userName,
    `מזהה החלק: ${id}, כותרת: ${title || '[empty]'}, תוכן: ${content || '[empty]'}`
  );

  res.status(204).json(update.rows[0]);
};

exports.deleteSection = async (req, res) => {
  const { id } = req.params;
  const { userName, userId } = req.body;

  await db.query(
    `DELETE FROM About_Sections WHERE section_id = $1`,
    [id]
  );

  // await db.query(
  //   `INSERT INTO Audit_Logs (action, user_id, user_name, details)
  //    VALUES ($1, $2, $3, $4)`,
  //   ['מחיקת חלק בעמוד קצת עלינו', userId, userName, `נמחק על ידי: ${userName} `]
  // );

  await logAudit(
    'מחיקת חלק בעמוד קצת עלינו',
    userId,
    userName,
    `נמחק על ידי: ${userName}`
  );

  res.status(204).end();
};
