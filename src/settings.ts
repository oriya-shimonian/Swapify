const baseBackendAddress = "http://localhost:3000/api";

// Authentication
const authRoutes = {
  login: `${baseBackendAddress}/auth/login`,
  register: `${baseBackendAddress}/auth/register`,
  logout: `${baseBackendAddress}/auth/logout`,
  checkAuth: `${baseBackendAddress}/auth/check-auth`, // לבדוק אם המשתמש מחובר
};

// Users
const userRoutes = {
  getAllUsers: `${baseBackendAddress}/users`, // Admin בלבד
  getUserById: (id: number) => `${baseBackendAddress}/users/${id}`, // רק המשתמש עצמו או Admin
  createUser: `${baseBackendAddress}/users`, // יצירת משתמש חדש
  updateUser: (id: number) => `${baseBackendAddress}/users/${id}`, // עדכון משתמש
  banUser: (id: number) => `${baseBackendAddress}/users/${id}/ban`, // חסימת משתמש (Admin)
  deleteUser: (id: number) => `${baseBackendAddress}/users/${id}`, // מחיקת משתמש (Admin)
};

// Products
const productRoutes = {
  getAllProducts: `${baseBackendAddress}/products`,
  getProductById: (id: number) => `${baseBackendAddress}/products/${id}`,
  createProduct: `${baseBackendAddress}/products`,
  updateProduct: (id: number) => `${baseBackendAddress}/products/${id}`,
  deleteProduct: (id: number) => `${baseBackendAddress}/products/${id}`,
};

// Board Games
const boardGameRoutes = {
  getAllBoardGames: `${baseBackendAddress}/board-games`,
  getBoardGameById: (id: number) => `${baseBackendAddress}/board-games/${id}`,
  getAllUserBoardGames: (userId: number) => `${baseBackendAddress}/board-games/user/${userId}`,
  createBoardGame: `${baseBackendAddress}/board-games`,
  updateBoardGame: (id: number) => `${baseBackendAddress}/board-games/${id}`,
  deleteBoardGame: (id: number) => `${baseBackendAddress}/board-games/${id}`,
};

// Books
const bookRoutes = {
  getAllBooks: `${baseBackendAddress}/books`,
  getBookById: (id: number) => `${baseBackendAddress}/books/${id}`,
  getAllUserBooks: (userId: number) => `${baseBackendAddress}/books/user/${userId}`,
  createBook: `${baseBackendAddress}/books`,
  updateBook: (id: number) => `${baseBackendAddress}/books/${id}`,
  deleteBook: (id: number) => `${baseBackendAddress}/books/${id}`,
};

// Puzzles
const puzzleRoutes = {
  getAllPuzzles: `${baseBackendAddress}/puzzles`,
  getPuzzleById: (id: number) => `${baseBackendAddress}/puzzles/${id}`,
  getAllUserPuzzles: (userId: number) => `${baseBackendAddress}/puzzles/user/${userId}`,
  createPuzzle: `${baseBackendAddress}/puzzles`,
  updatePuzzle: (id: number) => `${baseBackendAddress}/puzzles/${id}`,
  deletePuzzle: (id: number) => `${baseBackendAddress}/puzzles/${id}`,
};

// Exchange Requests
const exchangeRequestRoutes = {
  getAllExchangeRequests: `${baseBackendAddress}/exchange-requests`,
  getExchangeRequestById: (id: number) => `${baseBackendAddress}/exchange-requests/${id}`,
  getAllUserExchangeRequests: (userId: number) => `${baseBackendAddress}/exchange-requests/user/${userId}`,
  createExchangeRequest: `${baseBackendAddress}/exchange-requests`,
  updateExchangeRequest: (id: number) => `${baseBackendAddress}/exchange-requests/${id}`,
};

// Notifications
const notificationRoutes = {
  getAllNotifications: `${baseBackendAddress}/notifications`,
  createNotification: `${baseBackendAddress}/notifications`,
  markNotificationAsRead: (id: number) => `${baseBackendAddress}/notifications/${id}/read`,
};

// Roles
const roleRoutes = {
  getAllRoles: `${baseBackendAddress}/roles`,
  getUserRole: (userId: number) => `${baseBackendAddress}/roles/${userId}`,
  createRole: `${baseBackendAddress}/roles`,
};

// Uploads
const uploadRoutes = {
  uploadImage: `${baseBackendAddress}/uploads/upload`,
};

// About
const aboutRoutes = {
  getAllSections: `${baseBackendAddress}/about`,
  createSection: `${baseBackendAddress}/about`,
  updateSection: (id: number) => `${baseBackendAddress}/about/${id}`,
  deleteSection: (id: number) => `${baseBackendAddress}/about/${id}`,
};

// Audit Logs
const auditLogRoutes = {
  getAuditLogs: `${baseBackendAddress}/audit-logs`,
};

export {
  authRoutes,
  userRoutes,
  productRoutes,
  boardGameRoutes,
  bookRoutes,
  puzzleRoutes,
  exchangeRequestRoutes,
  notificationRoutes,
  roleRoutes,
  uploadRoutes,
  aboutRoutes,
  auditLogRoutes,
};
