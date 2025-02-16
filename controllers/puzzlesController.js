const db = require('../config/db');

// יצירת פאזל חדש
exports.createPuzzle = async (req, res) => {
    const { userId, title, description, condition, location, imageUrl, manufacturer, piecesCount, subcategory } = req.body;

    try {
        // 1️⃣ קודם כל נכניס את הפריט לטבלת Products
        const productResult = await db.query(
            `INSERT INTO Products (user_id, title, description, category, subcategory, condition, location, image_url) 
             VALUES ($1, $2, $3, 'Puzzle', $4, $5, $6, $7) RETURNING product_id`,
            [userId, title, description, subcategory, condition, location, imageUrl]
        );

        const productId = productResult.rows[0].product_id;

        // 2️⃣ עכשיו נוסיף את הפרטים הייחודיים לטבלת Puzzles
        const puzzleResult = await db.query(
            `INSERT INTO Puzzles (product_id, manufacturer, pieces_count, image_url, subcategory) 
             VALUES ($1, $2, $3, $4, $5) RETURNING *`,
            [productId, manufacturer, piecesCount, imageUrl, subcategory]
        );

        res.status(201).json(puzzleResult.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to create puzzle' });
    }
};

// קבלת כל הפאזלים
exports.getAllPuzzles = async (req, res) => {
    try {
        const result = await db.query('SELECT * FROM Puzzles');
        res.status(200).json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch puzzles' });
    }
};

// קבלת כל הפאזלים
exports.getAllPuzzles = async (req, res) => {
    try {
        const result = await db.query('SELECT * FROM Puzzles');
        res.status(200).json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch puzzles' });
    }
};

// קבלת כל הפאזלים של משתמש
exports.getAllUserPuzzles = async (req, res) => {
    const { userId } = req.params;
    try {
        const result = await db.query('SELECT * FROM Puzzles WHERE user_id = $1', [userId]);
        res.status(200).json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch user\'s puzzles' });
    }
};

// קבלת פאזל לפי ID
exports.getPuzzleById = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await db.query('SELECT * FROM Puzzles WHERE product_id = $1', [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Puzzle not found' });
        }
        res.status(200).json(result.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch puzzle' });
    }
};

// עדכון פאזל (גם Products וגם Puzzles)
exports.updatePuzzle = async (req, res) => {
    const { id } = req.params;
    const { title, description, condition, location, imageUrl, manufacturer, piecesCount, subcategory } = req.body;

    try {
        // 1️⃣ עדכון הנתונים בטבלה הראשית `Products`
        const productResult = await db.query(
            `UPDATE Products 
            SET title = $1, description = $2, condition = $3, location = $4, image_url = $5, updated_at = CURRENT_TIMESTAMP 
            WHERE product_id = $6 RETURNING *`,
            [title, description, condition, location, imageUrl, id]
        );

        if (productResult.rows.length === 0) {
            return res.status(404).json({ error: 'Puzzle not found in Products' });
        }

        // 2️⃣ עדכון הנתונים הייחודיים בטבלת `Puzzles`
        const puzzleResult = await db.query(
            `UPDATE Puzzles 
            SET manufacturer = $1, pieces_count = $2, subcategory = $3, updated_at = CURRENT_TIMESTAMP 
            WHERE product_id = $4 RETURNING *`,
            [manufacturer, piecesCount, subcategory, id]
        );

        if (puzzleResult.rows.length === 0) {
            return res.status(404).json({ error: 'Puzzle not found in Puzzles' });
        }

        res.status(200).json({
            message: 'Puzzle updated successfully',
            product: productResult.rows[0],
            puzzle: puzzleResult.rows[0]
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to update puzzle' });
    }
};

// מחיקת פאזל
exports.deletePuzzle = async (req, res) => {
    const { id } = req.params;

    try {
        // 1️⃣ קודם כל נמחק את הפאזל עצמו
        const puzzleResult = await db.query('DELETE FROM Puzzles WHERE product_id = $1 RETURNING *', [id]);

        if (puzzleResult.rows.length === 0) {
            return res.status(404).json({ error: 'Puzzle not found' });
        }

        // 2️⃣ עכשיו נמחק את הרשומה מהטבלה הראשית (Products)
        await db.query('DELETE FROM Products WHERE product_id = $1', [id]);

        res.status(200).json({ message: 'Puzzle deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to delete puzzle' });
    }
};

