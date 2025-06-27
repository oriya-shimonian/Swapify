const db = require("../config/db");
const { getProductById } = require("./productsController");

// יצירת ספר חדש
exports.createBook = async (req, res) => {
  const {
    userId,
    title,
    description,
    condition,
    locations,
    imageUrl,
    author,
    publish_year,
    publisher,
    page_count,
    subcategory,
  } = req.body;

  try {
    // 1️⃣ קודם כל מוסיפים את הספר ל-`Products`
    const productResult = await db.query(
      `INSERT INTO Products (user_id, title, description, category, subcategory, condition, location, image_url) 
             VALUES ($1, $2, $3, 'Book', $4, $5, $6, $7) RETURNING product_id`,
      [userId, title, description, subcategory, condition, locations, imageUrl]
    );

    const productId = productResult.rows[0].product_id;

    // 2️⃣ הוספת הספר לטבלת `Books`
    const bookResult = await db.query(
      `INSERT INTO Books (product_id, author, publish_year, publisher, page_count, image_url, subcategory) 
            VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
      [
        productId,
        author,
        publish_year,
        publisher,
        page_count,
        imageUrl,
        subcategory,
      ]
    );

    res.status(201).json(bookResult.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to create book" });
  }
};

// קבלת כל הספרים
exports.getAllBooks = async (req, res) => {
  try {
    const result = await db.query("SELECT * FROM Books");
    res.status(200).json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch books" });
  }
};

// קבלת כל הספרים של המשתמש
exports.getAllUserBooks = async (req, res) => {
  const { userId } = req.params;
  try {
    const result = await db.query("SELECT * FROM Books WHERE user_id = $1", [
      userId,
    ]);
    res.status(200).json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch user's books" });
  }
};

// קבלת ספר לפי ID
exports.getBookById = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await db.query("SELECT * FROM Books WHERE product_id = $1", [
      id,
    ]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Book not found" });
    }
    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch book" });
  }
};

// עדכון ספר
exports.updateBook = async (req, res) => {
  const { id } = req.params;
  const {
    title,
    description,
    condition,
    category,
    subcategory,
    location,
    image_url,
    availability,
    author,
    publisher,
    publish_year,
    page_count,
  } = req.body;

  try {
    await db.query("BEGIN");

    await db.query(
      `UPDATE Products SET
        title = $1, description = $2, condition = $3, category = $4,
        subcategory = $5, location = $6, image_url = $7, availability = $8,
        updated_at = CURRENT_TIMESTAMP
      WHERE product_id = $9`,
      [
        title,
        description,
        condition,
        category,
        subcategory,
        location,
        image_url,
        availability,
        id,
      ]
    );

    await db.query(
      `UPDATE Books SET
        author = $1, publisher = $2, publish_year = $3, page_count = $4
      WHERE product_id = $5`,
      [author, publisher, publish_year, page_count, id]
    );

    await db.query("COMMIT");

    const updatedProduct = await getProductById(
      { params: { id } },
      { status: () => ({ json: (x) => x }) }
    );
    res.status(200).json(updatedProduct);
  } catch (err) {
    await db.query("ROLLBACK");
    console.error("Failed to update book", err);
    res.status(500).json({ error: "Failed to update book" });
  }
};

// מחיקת ספר
exports.deleteBook = async (req, res) => {
  const { id } = req.params;

  try {
    // 1️⃣ מחיקת הספר מטבלת `Books`
    const bookResult = await db.query(
      "DELETE FROM Books WHERE product_id = $1 RETURNING *",
      [id]
    );

    if (bookResult.rows.length === 0) {
      return res.status(404).json({ error: "Book not found" });
    }

    // 2️⃣ מחיקת המוצר מטבלת `Products`
    await db.query("DELETE FROM Products WHERE product_id = $1", [id]);

    res.status(200).json({ message: "Book deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to delete book" });
  }
};
