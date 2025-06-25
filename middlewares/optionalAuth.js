// middleware/optionalAuth.js
const jwt = require('jsonwebtoken');
require('dotenv').config();

exports.optionalAuth = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return next(); // לא נשלח טוקן בכלל
  }

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // ודאי שיש לך את זה ב־.env
    req.user = decoded; // מכניס את המשתמש ל־req.user ✅
  } catch (err) {
    console.warn("⚠️ טוקן לא תקף (לא קריטי):", err.message);
    // ממשיכים בלי req.user
  }

  next();
};
