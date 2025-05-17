const db = require("../config/db");
const { findAndInsertCrossMatchesForRequest } = require("../services/crossRequestMatcher");

async function findMatchesForAllPendingRequests() {
  try {
    const { rows: requests } = await db.query(`
      SELECT request_id FROM Exchange_Requests
      WHERE status = 'Pending'
    `);

    for (const row of requests) {
      await findAndInsertCrossMatchesForRequest(row.request_id);
    }

    console.log("🔁 סריקת התאמות הושלמה.");
  } catch (error) {
    console.error("❌ שגיאה בסריקת בקשות צולבות:", error);
  }
}

function startCrossRequestScheduler() {
  console.log("🚀 מנוע התאמות צולבות הופעל");

  findMatchesForAllPendingRequests(); // הרצה ראשונית
  setInterval(findMatchesForAllPendingRequests, 5 * 60 * 1000); // כל 5 דקות
}

module.exports = { startCrossRequestScheduler };

// אם הקובץ רץ ישירות - הפעלה עצמאית
if (require.main === module) {
  startCrossRequestScheduler();
}
