const db = require("../config/db");

// יצירת מוצר חדש
exports.createProduct = async (req, res) => {
  const {
    userId,
    title,
    description,
    category,
    subcategory,
    condition,
    location,
    imageUrl,
  } = req.body;
  try {
    const result = await db.query(
      `INSERT INTO Products (user_id, title, description, category, subcategory, condition, location, image_url) 
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
      [
        userId,
        title,
        description,
        category,
        subcategory,
        condition,
        location,
        imageUrl,
      ]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to create product" });
  }
};

// // קבלת כל המוצרים
// exports.getAllProducts = async (req, res) => {
//     try {
//         const result = await db.query('SELECT * FROM Products');
//         res.status(200).json(result.rows);
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ error: 'Failed to fetch products' });
//     }
// };

//  קבלת כל המוצרים הזמינים להחלפה (לא משנה למי הם שייכים)
// exports.getAllProducts = async (req, res) => {

//     try {
//         const result = await db.query(`
//             SELECT
//                 Products.*,
//                 Users.name
//             FROM Products
//             JOIN Users ON Products.user_id = Users.user_id
//             WHERE availability IN ('Available', 'Interested')
//             ORDER BY Products.created_at DESC
//         `);
//         res.status(200).json(result.rows);
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ error: 'Failed to fetch products' });
//     }
// };

// קבלת כל המוצרים הזמינים להחלפה (עם עימוד)
exports.getAllProducts = async (req, res) => {
  console.log("Request query:", req.query); // הוספת לוג כדי לבדוק את ה- query
  const limit = parseInt(req.query.limit) || 12;
  const offset = parseInt(req.query.offset) || 0;
  try {
    const result = await db.query(
      `
      SELECT 
        Products.*, 
        Users.name 
      FROM Products
      JOIN Users ON Products.user_id = Users.user_id
      WHERE availability IN ('Available', 'Interested')
      ORDER BY Products.created_at DESC
      LIMIT $1 OFFSET $2
      `,
      [limit, offset]
    );

    res.status(200).json(result.rows);
  } catch (error) {
    console.error("❌ שגיאה בשרת:", error);
    res.status(500).json({ error: "Failed to fetch products" });
  }
};

// // קבלת כל המוצרים של משתמש מסוים
// exports.getProductsByUser = async (req, res) => {
//   console.log("Request query:", req.params, req.query); // הוספת לוג כדי לבדוק את ה- query
//   const { userId } = req.params;
//   const limit = parseInt(req.query.limit) || 12;
//   const offset = parseInt(req.query.offset) || 0;
//   try {
//     const result = await db.query(
//       "SELECT * FROM Products WHERE user_id = $1 ORDER BY created_at DESC LIMIT $2 OFFSET $3",
//       [userId, limit, offset]
//     );
//     // console.log(req.params, `Products for user ${userId}:`, result.rows); // הוספת לוג כדי לבדוק את המוצרים
//     res.status(200).json(result.rows);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: "Failed to fetch user products" });
//   }
// };

exports.getProductsByUser = async (req, res) => {
  const { userId } = req.params;
  const {
    limit = 12,
    offset = 0,
    category,
    subcategory,
    condition,
    availability,
    search,
    from,
    to,
  } = req.query;

  const conditions = ["user_id = $1"];
  const values = [userId];
  let paramIndex = 2;

  if (category) {
    conditions.push(`category = $${paramIndex++}`);
    values.push(category);
  }

  if (subcategory) {
    conditions.push(`subcategory = $${paramIndex++}`);
    values.push(subcategory);
  }

  if (condition) {
    conditions.push(`condition = $${paramIndex++}`);
    values.push(condition);
  }

  if (availability) {
    conditions.push(`availability = $${paramIndex++}`);
    values.push(availability);
  }

  if (search) {
    conditions.push(`(LOWER(title) LIKE $${paramIndex} OR LOWER(description) LIKE $${paramIndex})`);
    values.push(`%${search.toLowerCase()}%`);
    paramIndex++;
  }

  if (from) {
    conditions.push(`created_at >= $${paramIndex++}`);
    values.push(from);
  }

  if (to) {
    conditions.push(`created_at <= $${paramIndex++}`);
    values.push(to);
  }

  const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";

  const query = `
    SELECT * FROM Products
    ${whereClause}
    ORDER BY created_at DESC
    LIMIT $${paramIndex++}
    OFFSET $${paramIndex}
  `;

  values.push(parseInt(limit), parseInt(offset));

  try {
    const result = await db.query(query, values);
    res.status(200).json(result.rows);
  } catch (error) {
    console.error("Error in getProductsByUser:", error);
    res.status(500).json({ error: "Failed to fetch user products" });
  }
};


// קבלת מוצרים שניתן להציע (שייכים למשתמש ועדיין לא הוחלפו)
exports.getAllUsersOfferableProducts = async (req, res) => {
  const { userId } = req.params;
  //   console.log(`User ID: ${userId}, res ${res.body}, req ${req.body}`); // הוספת לוג כדי לבדוק את ה- userId

  try {
    const result = await db.query(
      `SELECT * FROM Products
         WHERE user_id = $1
         AND availability IN ('Available', 'Interested')
         ORDER BY created_at DESC`,
      [userId]
    );

    res.status(200).json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch offerable products" });
  }
};

// קבלת מוצר לפי ID
exports.getProductById = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await db.query(
      `
            SELECT 
                Products.*, 
                Users.name 
            FROM Products
            JOIN Users ON Products.user_id = Users.user_id
            WHERE Products.product_id = $1
        `,
      [id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Product not found" });
    }
    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch product" });
  }
};

// עדכון מוצר
exports.updateProduct = async (req, res) => {
  const { id } = req.params;
  const {
    title,
    description,
    category,
    subcategory,
    condition,
    location,
    imageUrl,
  } = req.body;
  try {
    const result = await db.query(
      `UPDATE Products 
            SET title = $1, description = $2, category = $3, subcategory = $4, condition = $5, location = $6, image_url = $7, updated_at = CURRENT_TIMESTAMP 
            WHERE product_id = $8 RETURNING *`,
      [
        title,
        description,
        category,
        subcategory,
        condition,
        location,
        imageUrl,
        id,
      ]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Product not found" });
    }
    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to update product" });
  }
};

// מחיקת מוצר
exports.deleteProduct = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await db.query(
      "DELETE FROM Products WHERE product_id = $1 RETURNING *",
      [id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Product not found" });
    }
    res
      .status(200)
      .json({
        message: "Product deleted successfully",
        product: result.rows[0],
      });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to delete product" });
  }
};
