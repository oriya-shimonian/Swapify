const db = require('../config/db');

// יצירת ספר חדש
exports.createBook = async (req, res) => {
    const { userId, title, description, condition, locations, imageUrl, author, publish_year, publisher, page_count, subcategory } = req.body;

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
            [productId, author, publish_year, publisher, page_count, imageUrl, subcategory]
        );

        res.status(201).json(bookResult.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to create book' });
    }
};

// קבלת כל הספרים
exports.getAllBooks = async (req, res) => {
    try {
        const result = await db.query('SELECT * FROM Books');
        res.status(200).json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch books' });
    }
};

// קבלת כל הספרים של המשתמש
exports.getAllUserBooks = async (req, res) => {
    const { userId } = req.params;
    try {
        const result = await db.query('SELECT * FROM Books WHERE user_id = $1', [userId]);
        res.status(200).json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch user\'s books' });
    }
}

// קבלת ספר לפי ID
exports.getBookById = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await db.query('SELECT * FROM Books WHERE product_id = $1', [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Book not found' });
        }
        res.status(200).json(result.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch book' });
    }
};

// עדכון ספר
exports.updateBook = async (req, res) => {
    const { id } = req.params;
    const { title, description, condition, location, image_url, author, publishYear, publisher, pageCount, subcategory } = req.body;

    try {
        // 1️⃣ עדכון `Products`
        const productResult = await db.query(
            `UPDATE Products 
            SET title = $1, description = $2, condition = $3, location = $4, image_url = $5, updated_at = CURRENT_TIMESTAMP 
            WHERE product_id = $6 RETURNING *`,
            [title, description, condition, location, image_url, id]
        );

        if (productResult.rows.length === 0) {
            return res.status(404).json({ error: 'Book not found in Products' });
        }

        // 2️⃣ עדכון `Books`
        const bookResult =await db.query(
            `UPDATE Books 
            SET author = $1, publish_year = $2, publisher = $3, page_count = $4, subcategory = $5, image_url = $6
            WHERE product_id = $7 RETURNING *`,
            [author, publishYear, publisher, pageCount, subcategory, image_url, id]
        );

        if (bookResult.rows.length === 0) {
            return res.status(404).json({ error: 'Board game not found in Board_Games' });
        }

        res.status(200).json({ 
            message: 'Book updated successfully',
            product: productResult.rows[0],
            book: bookResult.rows[0]
         });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to update book' });
    }
};

// מחיקת ספר
exports.deleteBook = async (req, res) => {
    const { id } = req.params;

    try {
        // 1️⃣ מחיקת הספר מטבלת `Books`
        const bookResult = await db.query('DELETE FROM Books WHERE product_id = $1 RETURNING *', [id]);

        if (bookResult.rows.length === 0) {
            return res.status(404).json({ error: 'Book not found' });
        }

        // 2️⃣ מחיקת המוצר מטבלת `Products`
        await db.query('DELETE FROM Products WHERE product_id = $1', [id]);

        res.status(200).json({ message: 'Book deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to delete book' });
    }
};

