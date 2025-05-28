const db = require("../config/db");

// יצירת התראה חדשה
exports.createNotification = async (req, res) => {
  const { userId, type, message, contextId } = req.body;

  try {
    const result = await db.query(
      `INSERT INTO Notifications (user_id, type, message, context_id, status)
             VALUES ($1, $2, $3, $4, 'Unread') RETURNING *`,
      [userId, type, message, contextId]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Error creating notification:", error);
    res.status(500).json({ error: "Failed to create notification" });
  }
};

// קבלת מספר ההתראות הלא נקראות של המשתמש הנוכחי
exports.getUnreadCount = async (req, res) => {
  const userId = req.user.id;

  try {
    const { rows } = await db.query(
      `SELECT COUNT(*) FROM Notifications WHERE user_id = $1 AND status = 'Unread'`,
      [userId]
    );
    res.status(200).json({ count: Number(rows[0].count) });
  } catch (error) {
    console.error("Error counting unread notifications:", error);
    res.status(500).json({ error: "Failed to count unread notifications" });
  }
};

// סימון התראה בודדת כנקראה
exports.markNotificationAsRead = async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;
  try {
    const { rows } = await db.query(
      `UPDATE Notifications SET status = 'Read'
       WHERE notification_id = $1 AND user_id = $2 RETURNING *`,
      [id, userId]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: "Notification not found" });
    }

    res.status(200).json(rows[0]);
  } catch (error) {
    console.error("Error marking notification as read:", error);
    res.status(500).json({ error: "Failed to update notification" });
  }
};

// סימון כל ההתראות של המשתמש הנוכחי כנקראות
exports.markAllAsRead = async (req, res) => {
  const userId = req.user.id;
  try {
    await db.query(
      `UPDATE Notifications SET status = 'Read'
       WHERE user_id = $1 AND status = 'Unread'`,
      [userId]
    );
    res.status(200).json({ message: "All notifications marked as read" });
  } catch (error) {
    console.error("Error marking all notifications as read:", error);
    res.status(500).json({ error: "Failed to mark all as read" });
  }
};

// Get latest notifications enriched (limit optional)
exports.getUserNotificationsEnriched = async (req, res) => {
  const userId = req.user.id;
  const limit = parseInt(req.query.limit) || 30;
  const offset = parseInt(req.query.offset) || 0;
  try {
    const { rows: notifications } = await db.query(
      `SELECT * FROM Notifications WHERE user_id = $1 ORDER BY created_at DESC LIMIT $2 OFFSET $3`,
      [userId, limit, offset]
    );

    const enriched = [];

    for (const notification of notifications) {
      const { type, context_id, message, ...rest } = notification;
      let extra = {};

      if (type === "new_request") {
        const { rows } = await db.query(
          `SELECT p.title AS product_title, u.name AS proposer_name,
                  ARRAY_AGG(op.title) FILTER (WHERE op.title IS NOT NULL) AS offered_titles
           FROM Exchange_Requests r
           JOIN Products p ON r.product_id = p.product_id
           JOIN Users u ON r.user_id = u.user_id
           LEFT JOIN Exchange_Proposal_Options epo ON r.request_id = epo.request_id
           LEFT JOIN Products op ON epo.offered_product_id = op.product_id
           WHERE r.request_id = $1
           GROUP BY p.title, u.name`,
          [context_id]
        );
        extra = rows[0] || {};
      } else if (type === "approved") {
        const { rows } = await db.query(
          `SELECT 
             cp.title AS chosen_title,
             tp.title AS target_title,
             tu.name AS target_user_name
           FROM Exchange_Requests r
           JOIN Products cp ON r.chosen_product_id = cp.product_id
           JOIN Products tp ON r.product_id = tp.product_id
           JOIN Users tu ON tp.user_id = tu.user_id
           WHERE r.request_id = $1`,
          [context_id]
        );
        extra = rows[0] || {};
      } else if (type === "auto_rejected") {
        const { rows } = await db.query(
          `SELECT p.title AS proposed_title, t.title AS target_title, tu.name AS target_user_name
           FROM Exchange_Proposal_Options epo
           JOIN Products p ON epo.offered_product_id = p.product_id
           JOIN Exchange_Requests r ON epo.request_id = r.request_id
           JOIN Products t ON r.product_id = t.product_id
           JOIN Users tu ON t.user_id = tu.user_id
           WHERE r.request_id = $1 AND p.user_id = $2`,
          [context_id, userId]
        );
        extra = rows[0] || {};
      } else if (type === "completed") {
        const { rows } = await db.query(
          `SELECT ep.title AS my_product_title, rp.title AS received_product_title
           FROM Exchange_Requests r
           JOIN Products ep ON r.chosen_product_id = ep.product_id
           JOIN Products rp ON r.product_id = rp.product_id
           WHERE r.request_id = $1`,
          [context_id]
        );
        extra = rows[0] || {};
      } else if (type === "cancelled") {
        const { rows } = await db.query(
          `SELECT p.title AS cancelled_product_title
           FROM Exchange_Requests r
           JOIN Products p ON r.product_id = p.product_id
           WHERE r.request_id = $1`,
          [context_id]
        );
        extra = rows[0] || {};
      }

      enriched.push({
        ...rest,
        type,
        context_id,
        message,
        ...extra,
        link:
          type === "new_request"
            ? `/dashboard/requests/received#request-${context_id}`
            : type === "approved"
            ? `/dashboard/requests/sent#request-${context_id}`
            : `/exchange-requests/${context_id}`, // ברירת מחדל
      });
    }

    res.status(200).json(enriched);
  } catch (error) {
    console.error("שגיאה בקבלת התראות מועשרות:", error);
    res.status(500).json({ error: "שגיאה בקבלת התראות" });
  }
};

// // קבלת כל ההתראות של המשתמש הנוכחי
// exports.getAllNotifications = async (req, res) => {
//     const userId = req.user.user_id;

//     try {
//         const result = await db.query(
//             'SELECT * FROM Notifications WHERE user_id = $1 ORDER BY created_at DESC',
//             [userId]
//         );
//         res.status(200).json(result.rows);
//     } catch (error) {
//         console.error('Error fetching notifications:', error);
//         res.status(500).json({ error: 'Failed to fetch notifications' });
//     }
// };
// exports.getUserNotificationsEnriched = async (req, res) => {
//   const { userId } = req.params;
//   try {
//     const { rows: notifications } = await db.query(
//       `SELECT * FROM Notifications WHERE user_id = $1 ORDER BY created_at DESC`,
//       [userId]
//     );

//     const enriched = [];

//     for (const notification of notifications) {
//       const { type, context_id, message, ...rest } = notification;
//       let extra = {};

//       if (type === "new_request") {
//         const { rows } = await db.query(
//           `SELECT p.title AS product_title, u.name AS proposer_name,
//                   ARRAY_AGG(op.title) FILTER (WHERE op.title IS NOT NULL) AS offered_titles
//            FROM Exchange_Requests r
//            JOIN Products p ON r.product_id = p.product_id
//            JOIN Users u ON r.user_id = u.user_id
//            LEFT JOIN Exchange_Proposal_Options epo ON r.request_id = epo.request_id
//            LEFT JOIN Products op ON epo.offered_product_id = op.product_id
//            WHERE r.request_id = $1
//            GROUP BY p.title, u.name`,
//           [context_id]
//         );
//         extra = rows[0] || {};
//       }

//       else if (type === "approved") {
//         const { rows } = await db.query(
//           `SELECT
//              cp.title AS chosen_title,
//              tp.title AS target_title,
//              tu.name AS target_user_name
//            FROM Exchange_Requests r
//            JOIN Products cp ON r.chosen_product_id = cp.product_id
//            JOIN Products tp ON r.product_id = tp.product_id
//            JOIN Users tu ON tp.user_id = tu.user_id
//            WHERE r.request_id = $1`,
//           [context_id]
//         );
//         extra = rows[0] || {};
//       }

//       else if (type === "auto_rejected") {
//         const { rows } = await db.query(
//           `SELECT p.title AS proposed_title, t.title AS target_title, tu.name AS target_user_name
//            FROM Exchange_Proposal_Options epo
//            JOIN Products p ON epo.offered_product_id = p.product_id
//            JOIN Exchange_Requests r ON epo.request_id = r.request_id
//            JOIN Products t ON r.product_id = t.product_id
//            JOIN Users tu ON t.user_id = tu.user_id
//            WHERE r.request_id = $1 AND p.user_id = $2`,
//           [context_id, userId]
//         );
//         extra = rows[0] || {};
//       }

//       else if (type === "completed") {
//         const { rows } = await db.query(
//           `SELECT ep.title AS my_product_title, rp.title AS received_product_title
//            FROM Exchange_Requests r
//            JOIN Products ep ON r.chosen_product_id = ep.product_id
//            JOIN Products rp ON r.product_id = rp.product_id
//            WHERE r.request_id = $1`,
//           [context_id]
//         );
//         extra = rows[0] || {};
//       }

//       else if (type === "cancelled") {
//         const { rows } = await db.query(
//           `SELECT p.title AS cancelled_product_title
//            FROM Exchange_Requests r
//            JOIN Products p ON r.product_id = p.product_id
//            WHERE r.request_id = $1`,
//           [context_id]
//         );
//         extra = rows[0] || {};
//       }

//       enriched.push({
//         ...rest,
//         type,
//         context_id,
//         message,
//         ...extra,
//         link: `/exchange-requests/${context_id}`
//       });
//     }

//     res.status(200).json(enriched);
//   } catch (error) {
//     console.error("שגיאה בקבלת התראות מועשרות:", error);
//     res.status(500).json({ error: "שגיאה בקבלת התראות" });
//   }
// };
