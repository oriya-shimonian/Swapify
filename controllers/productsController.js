const db = require("../config/db");
const { buildProductFilters } = require("../services/productFilters");
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

exports.getAllProducts = async (req, res) => {
  const { limit = 12, offset = 0, excludeMyProducts } = req.query;
    const { whereClause, values } = buildProductFilters(req.query, {
    includeSearch: true,
    includeAvailabilityDefault: true,
    excludeUserId:
      excludeMyProducts === "true" && req.user?.id ? req.user.id : null,
  });

  values.push(parseInt(limit));
  values.push(parseInt(offset));

  const limitIndex = values.length - 1;
  const offsetIndex = values.length;

  try {
    const result = await db.query(
      `
      SELECT Products.*, Users.name,
             b.author, b.publisher, b.publish_year,
             pz.manufacturer, pz.pieces_count,
             bg.min_players, bg.max_players, bg.duration
      FROM Products
      JOIN Users ON Products.user_id = Users.user_id
      LEFT JOIN Books b ON Products.product_id = b.product_id
      LEFT JOIN Puzzles pz ON Products.product_id = pz.product_id
      LEFT JOIN Board_Games bg ON Products.product_id = bg.product_id
      ${whereClause}
      ORDER BY Products.created_at DESC
      LIMIT $${limitIndex} OFFSET $${offsetIndex}
      `,
      values
    );

    res.status(200).json(result.rows);
  } catch (error) {
    console.error("❌ שגיאה ב-getAllProducts:", error);
    res.status(500).json({ error: "Failed to fetch products" });
  }
};

exports.getProductsByUser = async (req, res) => {
  const { userId } = req.params;
  const { limit = 12, offset = 0 } = req.query;

  const query = {
    ...req.query,
    userId, // נוסיף אותו לשאילתה כדי שתוכל להיכנס לתנאי
  };

  const { whereClause, values } = buildProductFilters(query, {
    includeSearch: true,
    includeAvailabilityDefault: false, // משתמש רשאי לראות גם מוצרים שהוחלפו או בתהליך
  });

  // נוסיף את תנאי user_id ידנית, כי הוא שדה חובה כאן
  values.unshift(userId); // נהיה $1
  const userCondition = "Products.user_id = $1";
  const finalWhere = whereClause
    ? `WHERE ${userCondition} AND ${whereClause.slice(6)}`
    : `WHERE ${userCondition}`;

  values.push(parseInt(limit), parseInt(offset));
  const limitIndex = values.length - 1;
  const offsetIndex = values.length;

  try {
    const result = await db.query(
      `
      SELECT Products.*, Users.name,
             b.author, b.publisher, b.publish_year,
             pz.manufacturer, pz.pieces_count,
             bg.min_players, bg.max_players, bg.duration
      FROM Products
      JOIN Users ON Products.user_id = Users.user_id
      LEFT JOIN Books b ON Products.product_id = b.product_id
      LEFT JOIN Puzzles pz ON Products.product_id = pz.product_id
      LEFT JOIN Board_Games bg ON Products.product_id = bg.product_id
      ${finalWhere}
      ORDER BY Products.created_at DESC
      LIMIT $${limitIndex} OFFSET $${offsetIndex}
      `,
      values
    );

    res.status(200).json(result.rows);
  } catch (error) {
    console.error("❌ שגיאה ב-getProductsByUser:", error);
    res.status(500).json({ error: "Failed to fetch user products" });
  }
};

// קבלת מוצרים שניתן להציע (שייכים למשתמש ועדיין לא הוחלפו)
exports.getAllUsersOfferableProducts = async (req, res) => {
  const { userId } = req.params;

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

exports.getAllProductsImages = async (req, res) => {
  try {
    const result = await db.query(
      `SELECT image_url FROM Products WHERE image_url IS NOT NULL`
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "No products with images found" });
    }

    res.status(200).json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch product images" });
  }
}

// קבלת מוצר לפי ID
exports.getProductById = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await db.query(
      `
      SELECT 
        Products.*, 
        Users.name,
        Books.author,
        Books.publisher,
        Books.publish_year,
        Books.page_count,
        Puzzles.manufacturer,
        Puzzles.pieces_count AS "piecesCount",
        Board_Games.min_players,
        Board_Games.max_players,
        Board_Games.duration
      FROM Products
      JOIN Users ON Products.user_id = Users.user_id
      LEFT JOIN Books ON Products.product_id = Books.product_id
      LEFT JOIN Puzzles ON Products.product_id = Puzzles.product_id
      LEFT JOIN Board_Games ON Products.product_id = Board_Games.product_id
      WHERE Products.product_id = $1
      `,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Product not found" });
    }

    res.status(200).json(result.rows[0]);
    return result.rows[0];
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch product" });
  }
};

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
    res.status(200).json({
      message: "Product deleted successfully",
      product: result.rows[0],
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to delete product" });
  }
};
