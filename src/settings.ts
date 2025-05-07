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
  getAllProducts: `${baseBackendAddress}/products`, // פומבי - כל המוצרים
  getProductById: (id: number) => `${baseBackendAddress}/products/${id}`, // דורש התחברות
  getProductsByUser: (userId: number) => `${baseBackendAddress}/products/user/${userId}`, // דורש התחברות
  getOfferableProducts: (userId: number) => `${baseBackendAddress}/products/offerable/${userId}`, // דורש התחברות
  createProduct: `${baseBackendAddress}/products`, // דורש התחברות + בדיקת חסימה
  updateProduct: (id: number) => `${baseBackendAddress}/products/${id}`, // דורש התחברות + הרשאה לעריכה
  deleteProduct: (id: number) => `${baseBackendAddress}/products/${id}`, // דורש התחברות + הרשאה למחיקה
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
  getAllUserExchangeRequests: (userId: number) => `${baseBackendAddress}/exchange-requests/user/${userId}`, // כל הבקשות שהמשתמש שלח (דורש התחברות)
  getIncomingExchangeRequests: (userId: number) => `${baseBackendAddress}/exchange-requests/incoming/${userId}`, // כל הבקשות על מוצרים של המשתמש (דורש התחברות)
  getExchangeRequestById: (id: number) => `${baseBackendAddress}/exchange-requests/${id}`, // בקשה בודדת לפי ID (דורש התחברות)
  createExchangeRequest: `${baseBackendAddress}/exchange-requests`, // יצירה (דורש התחברות + בדיקת חסימה)
  approveExchangeRequest: (id: number) => `${baseBackendAddress}/exchange-requests/${id}/approve`, // אישור בקשה (דורש התחברות + בדיקת חסימה)
  completeExchangeRequest: (id: number) => `${baseBackendAddress}/exchange-requests/${id}/complete`, // השלמה (דורש התחברות + הרשאה)
  updateExchangeRequestStatus: (id: number) => `${baseBackendAddress}/exchange-requests/${id}`, // עדכון סטטוס (למשל דחייה) (דורש הרשאה)
  updateExchangeRequestProposalOptions: (id: number) => `${baseBackendAddress}/exchange-requests/${id}/options`, // עדכון סטטוס (למשל דחייה) (דורש הרשאה)
  cancelExchangeRequest: (id: number) => `${baseBackendAddress}/exchange-requests/${id}`, // מחיקה/ביטול בקשה (דורש הרשאה)
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
