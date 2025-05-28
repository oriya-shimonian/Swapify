// 📁 controllers/meetingOptionsController.js
const db = require("../config/db");

exports.getAllMeetingOptions = async (req, res) => {
  try {
    const result = await db.query(
      `SELECT * FROM MeetingOptions WHERE is_active = TRUE ORDER BY city, location_name, hour`
    );
    res.status(200).json(result.rows);
  } catch (error) {
    console.error("Failed to fetch meeting options:", error);
    res.status(500).json({ error: "Failed to fetch meeting options" });
  }
};

exports.createMeetingOption = async (req, res) => {
  const { city, location_name, hour } = req.body;
  const user = req.user;

  try {
    const result = await db.query(
      `INSERT INTO MeetingOptions (city, location_name, hour)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [city, location_name, hour]
    );

    await db.query(
      `INSERT INTO Audit_Logs (action, user_id, user_name, details)
       VALUES ('Create MeetingOption', $1, $2, $3)`,
      [user.user_id, user.name, `City: ${city}, Location: ${location_name}, Hour: ${hour}`]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Failed to create meeting option:", error);
    res.status(500).json({ error: "Failed to create meeting option" });
  }
};

exports.updateMeetingOption = async (req, res) => {
  const { id } = req.params;
  const { city, location_name, hour, is_active } = req.body;
  const user = req.user;

  try {
    const result = await db.query(
      `UPDATE MeetingOptions
       SET city = $1, location_name = $2, hour = $3, is_active = $4
       WHERE id = $5
       RETURNING *`,
      [city, location_name, hour, is_active, id]
    );

    await db.query(
      `INSERT INTO Audit_Logs (action, user_id, user_name, details)
       VALUES ('Update MeetingOption', $1, $2, $3)`,
      [user.user_id, user.name, `ID: ${id}, City: ${city}, Location: ${location_name}, Hour: ${hour}, Active: ${is_active}`]
    );

    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error("Failed to update meeting option:", error);
    res.status(500).json({ error: "Failed to update meeting option" });
  }
};

exports.deleteMeetingOption = async (req, res) => {
  const { id } = req.params;
  const user = req.user;

  try {
    const option = await db.query(`SELECT * FROM MeetingOptions WHERE id = $1`, [id]);

    await db.query(`DELETE FROM MeetingOptions WHERE id = $1`, [id]);

    await db.query(
      `INSERT INTO Audit_Logs (action, user_id, user_name, details)
       VALUES ('Delete MeetingOption', $1, $2, $3)`,
      [user.user_id, user.name, `Deleted ID: ${id}, City: ${option.rows[0].city}, Location: ${option.rows[0].location_name}`]
    );

    res.status(200).json({ message: "Meeting option deleted" });
  } catch (error) {
    console.error("Failed to delete meeting option:", error);
    res.status(500).json({ error: "Failed to delete meeting option" });
  }
};

exports.getMeetingOptionById = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await db.query(
      `SELECT * FROM MeetingOptions WHERE id = $1`,
      [id]
    );      
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Meeting option not found" });
    }
    res.status(200).json(result.rows[0]);
    }
    catch (error) {
    console.error("Failed to fetch meeting option:", error);
    res.status(500).json({ error: "Failed to fetch meeting option" });
    }
}

exports.getActiveMeetingOptions = async (req, res) => {
  const { city, location_name, hour } = req.query;
  const conditions = ['is_active = TRUE'];
  const values = [];

  if (city) {
    values.push(city);
    conditions.push(`city = $${values.length}`);
  }

  if (location_name) {
    values.push(location_name);
    conditions.push(`location_name = $${values.length}`);
  }

  if (hour) {
    values.push(hour);
    conditions.push(`hour = $${values.length}`);
  }

  const whereClause = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';

  try {
    const result = await db.query(
      `SELECT * FROM MeetingOptions ${whereClause} ORDER BY city, location_name, hour`,
      values
    );
    res.status(200).json(result.rows);
  } catch (error) {
    console.error("Failed to fetch active meeting options:", error);
    res.status(500).json({ error: "Failed to fetch active meeting options" });
  }
};
