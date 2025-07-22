// // const db = require('../config/db');

// // exports.getStatistics = async (req, res) => {
// //     try {
// //         const { fromDate, toDate, category, location } = req.query;

// //         const filters = [];
// //         const values = [];

// //         if (fromDate && toDate) {
// //             filters.push(`created_at BETWEEN $${values.length + 1} AND $${values.length + 2}`);
// //             values.push(fromDate, toDate);
// //         }

// //         if (category) {
// //             filters.push(`category = $${values.length + 1}`);
// //             values.push(category);
// //         }

// //         if (location) {
// //             filters.push(`location = $${values.length + 1}`);
// //             values.push(location);
// //         }

// //         const whereClause = filters.length ? `WHERE ${filters.join(" AND ")}` : "";

// //         const [
// //             usersRes,
// //             activeUsersRes,
// //             productsRes,
// //             availableRes,
// //             requestsRes,
// //             approvedRes,
// //             exchangesRes,
// //             chatsRes
// //         ] = await Promise.all([
// //             db.query(`SELECT COUNT(*) FROM Users`),
// //             db.query(`SELECT COUNT(*) FROM Users WHERE is_banned = false`),
// //             db.query(`SELECT COUNT(*) FROM Products ${whereClause}`, values),
// //             db.query(
// //                 `SELECT COUNT(*) FROM Products WHERE availability = 'Available' ${whereClause ? 'AND ' + filters.join(' AND ') : ''}`,
// //                 values
// //             ),
// //             db.query(`SELECT COUNT(*) FROM Exchange_Requests ${whereClause}`, values),
// //             db.query(
// //                 `SELECT COUNT(*) FROM Exchange_Requests WHERE status = 'Approved' ${whereClause ? 'AND ' + filters.join(' AND ') : ''}`,
// //                 values
// //             ),
// //             db.query(`SELECT COUNT(*) FROM Exchange_History ${whereClause}`, values),
// //             db.query(`SELECT COUNT(*) FROM Chats ${whereClause}`, values)
// //         ]);

// //         res.status(200).json({
// //             general: {
// //                 total_users: Number(usersRes.rows[0].count),
// //                 active_users: Number(activeUsersRes.rows[0].count),
// //                 total_products: Number(productsRes.rows[0].count),
// //                 available_products: Number(availableRes.rows[0].count),
// //                 total_requests: Number(requestsRes.rows[0].count),
// //                 approved_requests: Number(approvedRes.rows[0].count),
// //                 total_exchanges: Number(exchangesRes.rows[0].count),
// //                 total_chats: Number(chatsRes.rows[0].count)
// //             }
// //         });
// //     } catch (error) {
// //         console.error("Error fetching statistics:", error);
// //         res.status(500).json({ error: "Failed to fetch statistics" });
// //     }
// // };
// const db = require("../config/db");

// exports.getStatistics = async (req, res) => {
//   try {
//     const {
//       fromDate,
//       toDate,
//       category,
//       subcategory,
//       location
//     } = req.query;

//     const filters = [];
//     const values = [];

//     if (fromDate && toDate) {
//       filters.push(`created_at BETWEEN $${values.length + 1} AND $${values.length + 2}`);
//       values.push(fromDate, toDate);
//     }

//     if (category) {
//       filters.push(`category = $${values.length + 1}`);
//       values.push(category);
//     }

//     if (subcategory) {
//       filters.push(`subcategory = $${values.length + 1}`);
//       values.push(subcategory);
//     }

//     if (location) {
//       filters.push(`location = $${values.length + 1}`);
//       values.push(location);
//     }

//     const whereClause = filters.length ? `WHERE ${filters.join(" AND ")}` : "";

//     const availableWhere = whereClause
//       ? `${whereClause} AND availability = 'Available'`
//       : `WHERE availability = 'Available'`;

//     const unavailableWhere = whereClause
//       ? `${whereClause} AND availability IN ('Pending', 'Exchanged', 'Interested')`
//       : `WHERE availability IN ('Pending', 'Exchanged', 'Interested')`;

//     // 🟢 מוצרים
//     const availableRes = await db.query(
//       `SELECT COUNT(*) FROM Products ${availableWhere}`,
//       values
//     );

//     const unavailableRes = await db.query(
//       `SELECT COUNT(*) FROM Products ${unavailableWhere}`,
//       values
//     );

//     const byCategoryRes = await db.query(
//       `SELECT category, COUNT(*) FROM Products ${whereClause} GROUP BY category`,
//       values
//     );

//     const bySubcategoryRes = await db.query(
//       `SELECT subcategory, COUNT(*) FROM Products ${whereClause} GROUP BY subcategory`,
//       values
//     );

//     // 🔄 בקשות החלפה
//     const totalRequestsRes = await db.query(
//       `SELECT COUNT(*) FROM Exchange_Requests ${whereClause}`,
//       values
//     );

//     const byRequestStatusRes = await db.query(
//       `SELECT status, COUNT(*) FROM Exchange_Requests ${whereClause} GROUP BY status`,
//       values
//     );

//     // 🟣 החלפות בפועל
//     const totalExchangesRes = await db.query(
//       `SELECT COUNT(*) FROM Exchange_History ${whereClause}`,
//       values
//     );

//     const exchangesPerMonthRes = await db.query(
//       `SELECT TO_CHAR(exchange_date, 'YYYY-MM') AS month, COUNT(*) 
//        FROM Exchange_History ${whereClause}
//        GROUP BY month ORDER BY month`,
//       values
//     );

//     // 🔔 התראות
//     const totalNotificationsRes = await db.query(
//       `SELECT COUNT(*) FROM Notifications ${whereClause}`,
//       values
//     );

//     const byNotificationTypeRes = await db.query(
//       `SELECT type, COUNT(*) FROM Notifications ${whereClause} GROUP BY type`,
//       values
//     );

//     // 💬 צ'אטים
//     const totalChatsRes = await db.query(
//       `SELECT COUNT(*) FROM Chats ${whereClause}`,
//       values
//     );

//     // הרכבת התשובה
//     res.json({
//       productsCount: {
//         available: parseInt(availableRes.rows[0].count),
//         unavailable: parseInt(unavailableRes.rows[0].count),
//         byCategory: byCategoryRes.rows,
//         bySubcategory: bySubcategoryRes.rows,
//       },
//       exchangeRequests: {
//         total: parseInt(totalRequestsRes.rows[0].count),
//         byStatus: byRequestStatusRes.rows,
//       },
//       exchanges: {
//         total: parseInt(totalExchangesRes.rows[0].count),
//         perMonth: exchangesPerMonthRes.rows,
//       },
//       notifications: {
//         total: parseInt(totalNotificationsRes.rows[0].count),
//         byType: byNotificationTypeRes.rows,
//       },
//       chatsCount: parseInt(totalChatsRes.rows[0].count),
//     });

//   } catch (err) {
//     console.error("Error in getStatistics:", err);
//     res.status(500).json({ error: "Internal server error" });
//   }
// };


const db = require("../config/db");

exports.getStatistics = async (req, res) => {
  try {
    const { fromDate, toDate, category, subcategory, location } = req.query;

    const productFilters = [];
    const productValues = [];
    const requestFilters = [];
    const requestValues = [];
    const exchangeFilters = [];
    const exchangeValues = [];
    const notificationFilters = [];
    const notificationValues = [];
    const chatFilters = [];
    const chatValues = [];

    if (fromDate && toDate) {
      productFilters.push(`created_at BETWEEN $${productValues.length + 1} AND $${productValues.length + 2}`);
      productValues.push(fromDate, toDate);

      requestFilters.push(`created_at BETWEEN $${requestValues.length + 1} AND $${requestValues.length + 2}`);
      requestValues.push(fromDate, toDate);

      exchangeFilters.push(`exchange_date BETWEEN $${exchangeValues.length + 1} AND $${exchangeValues.length + 2}`);
      exchangeValues.push(fromDate, toDate);

      notificationFilters.push(`created_at BETWEEN $${notificationValues.length + 1} AND $${notificationValues.length + 2}`);
      notificationValues.push(fromDate, toDate);

      chatFilters.push(`created_at BETWEEN $${chatValues.length + 1} AND $${chatValues.length + 2}`);
      chatValues.push(fromDate, toDate);
    }

    if (category) {
      productFilters.push(`category = $${productValues.length + 1}`);
      productValues.push(category);
    }

    if (subcategory) {
      productFilters.push(`subcategory = $${productValues.length + 1}`);
      productValues.push(subcategory);
    }

    if (location) {
      productFilters.push(`location = $${productValues.length + 1}`);
      productValues.push(location);
    }

    const productWhere = productFilters.length ? `WHERE ${productFilters.join(" AND ")}` : "";
    const requestWhere = requestFilters.length ? `WHERE ${requestFilters.join(" AND ")}` : "";
    const exchangeWhere = exchangeFilters.length ? `WHERE ${exchangeFilters.join(" AND ")}` : "";
    const notificationWhere = notificationFilters.length ? `WHERE ${notificationFilters.join(" AND ")}` : "";
    const chatWhere = chatFilters.length ? `WHERE ${chatFilters.join(" AND ")}` : "";

    // ✔️ תיקון פה - תנאי נוסף
    const availableRes = await db.query(
      `SELECT COUNT(*) FROM Products ${productWhere ? productWhere + " AND" : "WHERE"} availability = 'Available'`,
      productValues
    );

    const unavailableRes = await db.query(
      `SELECT COUNT(*) FROM Products ${productWhere ? productWhere + " AND" : "WHERE"} availability IN ('Pending', 'Exchanged', 'Interested')`,
      productValues
    );

    const byCategoryRes = await db.query(
      `SELECT category, COUNT(*) FROM Products ${productWhere} GROUP BY category`,
      productValues
    );

    const bySubcategoryRes = await db.query(
      `SELECT subcategory, COUNT(*) FROM Products ${productWhere} GROUP BY subcategory`,
      productValues
    );

    const breakdownRes = await db.query(
      `SELECT 
        category,
        subcategory,
        COUNT(*) AS total,
        COUNT(*) FILTER (WHERE availability = 'Available') AS available,
        COUNT(*) FILTER (WHERE availability IN ('Exchanged', 'Pending')) AS exchanged
      FROM Products
      ${productWhere}
      GROUP BY category, subcategory`,
      productValues
    );

    const totalRequestsRes = await db.query(
      `SELECT COUNT(*) FROM Exchange_Requests ${requestWhere}`,
      requestValues
    );

    const byRequestStatusRes = await db.query(
      `SELECT status, COUNT(*) FROM Exchange_Requests ${requestWhere} GROUP BY status`,
      requestValues
    );

    const totalExchangesRes = await db.query(
      `SELECT COUNT(*) FROM Exchange_History ${exchangeWhere}`,
      exchangeValues
    );

    const exchangesPerMonthRes = await db.query(
      `SELECT TO_CHAR(exchange_date, 'YYYY-MM') AS month, COUNT(*) 
       FROM Exchange_History ${exchangeWhere}
       GROUP BY month ORDER BY month`,
      exchangeValues
    );

    const totalNotificationsRes = await db.query(
      `SELECT COUNT(*) FROM Notifications ${notificationWhere}`,
      notificationValues
    );

    const byNotificationTypeRes = await db.query(
      `SELECT type, COUNT(*) FROM Notifications ${notificationWhere} GROUP BY type`,
      notificationValues
    );

    const totalChatsRes = await db.query(
      `SELECT COUNT(*) FROM Chats ${chatWhere}`,
      chatValues
    );

    res.json({
      productsCount: {
        available: parseInt(availableRes.rows[0].count),
        unavailable: parseInt(unavailableRes.rows[0].count),
        byCategory: byCategoryRes.rows,
        bySubcategory: bySubcategoryRes.rows,
      },
      exchangeRequests: {
        total: parseInt(totalRequestsRes.rows[0].count),
        byStatus: byRequestStatusRes.rows,
      },
      exchanges: {
        total: parseInt(totalExchangesRes.rows[0].count),
        perMonth: exchangesPerMonthRes.rows,
      },
      notifications: {
        total: parseInt(totalNotificationsRes.rows[0].count),
        byType: byNotificationTypeRes.rows,
      },
      chatsCount: parseInt(totalChatsRes.rows[0].count),
      productBreakdown: breakdownRes.rows,
    });

  } catch (err) {
    console.error("Error in getStatistics:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

