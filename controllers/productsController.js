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

// exports.getAllProducts = async (req, res) => {
//   const {
//     search,
//     category,
//     subcategory,
//     location,
//     from,
//     to
//   } = req.query;

//   const conditions = ["Products.availability IN ('Available', 'Interested')"];
//   const values = [];

//   if (search) {
//     values.push(`%${search}%`);
//     conditions.push(`Products.title ILIKE $${values.length}`);
//   }

//   if (category) {
//     values.push(category);
//     conditions.push(`Products.category = $${values.length}`);
//   }

//   if (subcategory) {
//     values.push(subcategory);
//     conditions.push(`Products.subcategory = $${values.length}`);
//   }

//   if (location) {
//     values.push(location);
//     conditions.push(`Products.location = $${values.length}`);
//   }

//   if (from) {
//     values.push(from);
//     conditions.push(`Products.created_at >= $${values.length}`);
//   }

//   if (to) {
//     values.push(to);
//     conditions.push(`Products.created_at < $${values.length}::date + INTERVAL '1 day'`);
//   }

//   const limit = parseInt(
//     Array.isArray(req.query.limit) ? req.query.limit[0] : req.query.limit
//   ) || 12;
//   const offset = parseInt(
//     Array.isArray(req.query.offset) ? req.query.offset[0] : req.query.offset
//   ) || 0;

//   values.push(limit);
//   values.push(offset);

//   const limitIndex = values.length - 1;
//   const offsetIndex = values.length;

//   const whereClause = `WHERE ${conditions.join(" AND ")}`;

//   try {
// //     console.log("📄 Final WHERE clause:", whereClause);
// // console.log("📦 Final values:", values);

//     const result = await db.query(
//       `
//       SELECT 
//         Products.*, 
//         Users.name 
//       FROM Products
//       JOIN Users ON Products.user_id = Users.user_id
//       ${whereClause}
//       ORDER BY Products.created_at DESC
//       LIMIT $${limitIndex} OFFSET $${offsetIndex}
//       `,
//       values
//     );
//     // console.log("📊 מוצרים שחזרו:");
// // result.rows.forEach(p => console.log("•", p.created_at));

//     res.status(200).json(result.rows);
//   } catch (error) {
//     console.error("❌ שגיאה בשרת:", error);
//     res.status(500).json({ error: "Failed to fetch products" });
//   }
// };

// קבלת מוצרים לפי משתמש

exports.getAllProducts = async (req, res) => {
  const {
    search,
    category,
    subcategory,
    location,
    from,
    to,
    excludeMyProducts 
  } = req.query;
 
  const conditions = ["Products.availability IN ('Available', 'Interested')"];
  const values = [];

  if (search) {
    values.push(`%${search}%`);
    conditions.push(`Products.title ILIKE $${values.length}`);
  }

  if (category) {
    values.push(category);
    conditions.push(`Products.category = $${values.length}`);
  }

  if (subcategory) {
    values.push(subcategory);
    conditions.push(`Products.subcategory = $${values.length}`);
  }

  if (location) {
    values.push(location);
    conditions.push(`Products.location = $${values.length}`);
  }

  if (from) {
    values.push(from);
    conditions.push(`Products.created_at >= $${values.length}`);
  }

  if (to) {
    values.push(to);
    conditions.push(`Products.created_at < $${values.length}::date + INTERVAL '1 day'`);
  }

  // סינון לפי משתמש – רק אם excludeMyProducts=true ויש משתמש מחובר
  if (excludeMyProducts === 'true' && req.user?.id) {
    values.push(req.user.id);
    conditions.push(`Products.user_id != $${values.length}`);
  }

  const limit = parseInt(
    Array.isArray(req.query.limit) ? req.query.limit[0] : req.query.limit
  ) || 12;

  const offset = parseInt(
    Array.isArray(req.query.offset) ? req.query.offset[0] : req.query.offset
  ) || 0;

  values.push(limit);
  values.push(offset);

  const limitIndex = values.length - 1;
  const offsetIndex = values.length;

  const whereClause = `WHERE ${conditions.join(" AND ")}`;

  try {
    const result = await db.query(
      `
      SELECT 
        Products.*, 
        Users.name 
      FROM Products
      JOIN Users ON Products.user_id = Users.user_id
      ${whereClause}
      ORDER BY Products.created_at DESC
      LIMIT $${limitIndex} OFFSET $${offsetIndex}
      `,
      values
    );

    res.status(200).json(result.rows);
  } catch (error) {
    console.error("❌ שגיאה בשרת:", error);
    res.status(500).json({ error: "Failed to fetch products" });
  }
};


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
