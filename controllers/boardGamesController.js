const db = require("../config/db"); // חיבור ל-PostgreSQL
const { getProductById } = require("./productsController");

// Create Board Game
exports.createBoardGame = async (req, res) => {
  const {
    userId,
    title,
    description,
    condition,
    locations,
    imageUrl,
    min_players,
    max_players,
    duration,
    subcategory,
  } = req.body;

  try {
    // 1️⃣ קודם כל מוסיפים את המוצר ל-`Products`
    const productResult = await db.query(
      `INSERT INTO Products (user_id, title, description, category, subcategory, condition, location, image_url) 
             VALUES ($1, $2, $3, 'Board Game', $4, $5, $6, $7) RETURNING product_id`,
      [userId, title, description, subcategory, condition, locations, imageUrl]
    );

    const productId = productResult.rows[0].product_id;

    // 2️⃣ עכשיו נוסיף את הפרטים הייחודיים לטבלת `Board_Games`
    const boardGameResult = await db.query(
      `INSERT INTO Board_Games (product_id, min_players, max_players, duration, image_url, subcategory) 
             VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [productId, min_players, max_players, duration, imageUrl, subcategory]
    );

    res.status(201).json(boardGameResult.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to create board game" });
  }
};

// Get All Board Games
exports.getAllBoardGames = async (req, res) => {
  try {
    const result = await db.query("SELECT * FROM Board_Games");
    res.status(200).json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch board games" });
  }
};

// Get All user's Board Games
exports.getAllUserBoardGames = async (req, res) => {
  const { userId } = req.params;
  try {
    const result = await db.query(
      "SELECT * FROM Board_Games WHERE user_id = $1",
      [userId]
    );
    res.status(200).json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch user's board games" });
  }
};

// Get Board Game by ID
exports.getBoardGameById = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await db.query(
      "SELECT * FROM Board_Games WHERE product_id = $1",
      [id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Board game not found" });
    }
    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch board game" });
  }
};

// Update Board Game
exports.updateBoardGame = async (req, res) => {
  console.log(req.params);

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
    min_players,
    max_players,
    duration,
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
      `UPDATE Board_Games SET
        min_players = $1, max_players = $2, duration = $3
      WHERE product_id = $4`,
      [min_players, max_players, duration, id]
    );

    await db.query("COMMIT");

    const updatedProduct = await getProductById(
      { params: { id } },
      { status: () => ({ json: (x) => x }) }
    );
    res.status(200).json(updatedProduct);
  } catch (err) {
    await db.query("ROLLBACK");
    console.error("Failed to update board game", err);
    res.status(500).json({ error: "Failed to update board game" });
  }
};

// Delete Board Game
exports.deleteBoardGame = async (req, res) => {
  const { id } = req.params;

  try {
    // 1️⃣ מחיקת המשחק מטבלת `Board_Games`
    const boardGameResult = await db.query(
      "DELETE FROM Board_Games WHERE product_id = $1 RETURNING *",
      [id]
    );

    if (boardGameResult.rows.length === 0) {
      return res.status(404).json({ error: "Board game not found" });
    }

    // 2️⃣ מחיקת המוצר מטבלת `Products`
    await db.query("DELETE FROM Products WHERE product_id = $1", [id]);

    res.status(200).json({ message: "Board game deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to delete board game" });
  }
};
