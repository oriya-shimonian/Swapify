const db = require('../config/db');

// יצירת מוצר חדש
exports.createProduct = async (req, res) => {
    const { userId, title, description, category, subcategory, condition, location, imageUrl } = req.body;
    try {
        const result = await db.query(
            `INSERT INTO Products (user_id, title, description, category, subcategory, condition, location, image_url) 
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
            [userId, title, description, category, subcategory, condition, location, imageUrl]
        );
        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to create product' });
    }
};

// קבלת כל המוצרים
exports.getAllProducts = async (req, res) => {
    try {
        const result = await db.query('SELECT * FROM Products');
        res.status(200).json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch products' });
    }
};

// קבלת כל המוצרים של משתמש מסוים
exports.getProductsByUser = async (req, res) => {
    const { userId } = req.params;
    try {
        const result = await db.query(
            'SELECT * FROM Products WHERE user_id = $1 ORDER BY created_at DESC',
            [userId]
        );
        res.status(200).json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch user products' });
    }
};


// קבלת מוצרים שניתן להציע (שייכים למשתמש ועדיין לא הוחלפו)
exports.getAllUsersOfferableProducts = async (req, res) => {
    const { userId } = req.params;
  console.log(`User ID: ${userId}, res ${res.body}, req ${req.body}`); // הוספת לוג כדי לבדוק את ה- userId
  
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
      res.status(500).json({ error: 'Failed to fetch offerable products' });
    }
  };
  

// קבלת מוצר לפי ID
exports.getProductById = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await db.query('SELECT * FROM Products WHERE product_id = $1', [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Product not found' });
        }
        res.status(200).json(result.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch product' });
    }
};

// עדכון מוצר
exports.updateProduct = async (req, res) => {
    const { id } = req.params;
    const { title, description, category, subcategory, condition, location, imageUrl } = req.body;
    try {
        const result = await db.query(
            `UPDATE Products 
            SET title = $1, description = $2, category = $3, subcategory = $4, condition = $5, location = $6, image_url = $7, updated_at = CURRENT_TIMESTAMP 
            WHERE product_id = $8 RETURNING *`,
            [title, description, category, subcategory, condition, location, imageUrl, id]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Product not found' });
        }
        res.status(200).json(result.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to update product' });
    }
};

// מחיקת מוצר
exports.deleteProduct = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await db.query('DELETE FROM Products WHERE product_id = $1 RETURNING *', [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Product not found' });
        }
        res.status(200).json({ message: 'Product deleted successfully', product: result.rows[0] });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to delete product' });
    }
};
