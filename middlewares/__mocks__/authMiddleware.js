// מיפוי תפקידים לפי הטוקן
const tokenRoleMap = {
  FAKE_TOKEN_ROLE_1: { id: 1, role_id: 1 }, // Guest
  FAKE_TOKEN_ROLE_2: { id: 2, role_id: 2 }, // User
  FAKE_TOKEN_ROLE_3: { id: 3, role_id: 3 }, // Admin
  FAKE_TOKEN_BANNED: { id: 4, role_id: 2, is_banned: true },
};

exports.authenticateUser = (req, res, next) => {
  const token = req.header("Authorization")?.split(" ")[1];
  const user = tokenRoleMap[token];

  if (!user) return res.status(401).json({ error: "Unauthorized" });

  req.user = user;
  next();
};

exports.isAdmin = (req, res, next) => {
  if (req.user?.role_id === 3) {
    return next();
  }
  return res.status(403).json({ error: "Access denied: Admins only" });
};
