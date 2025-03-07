// // // const express = require('express');
// // // const dotenv = require('dotenv');
// // // const { Pool } = require('pg');

// // // dotenv.config();

// // // const app = express();
// // // const PORT = process.env.PORT || 3000;

// // // // יצירת Pool עבור החיבור ל-PostgreSQL
// // // const pool = new Pool({
// // //   host: process.env.DB_HOST,
// // //   port: process.env.DB_PORT,
// // //   database: process.env.DB_NAME,
// // //   user: process.env.DB_USER,
// // //   password: process.env.DB_PASSWORD,
// // // });

// // // // פונקציה לבדוק את החיבור למסד הנתונים
// // // const connectDB = async () => {
// // //   try {
// // //     await pool.connect();
// // //     console.log('Connected to PostgreSQL');
// // //   } catch (err) {
// // //     console.error('Failed to connect to PostgreSQL', err);
// // //     process.exit(1); // סיום התהליך במקרה של כישלון
// // //   }
// // // };

// // // app.use(express.json());

// // // app.get('/', (req, res) => {
// // //   res.send('Welcome to Swapify!');
// // // });

// // // // התחברות למסד הנתונים
// // // connectDB();

// // // app.listen(PORT, () => {
// // //   console.log(`Server running on port http://localhost:${PORT}`);
// // // });

// // // module.exports = pool; // יצוא pool למקרה שתצטרכי להשתמש בו בקבצים אחרים


// // const express = require('express');
// // const dotenv = require('dotenv');
// // const { Pool } = require('pg');

// // dotenv.config();

// // const app = express();
// // const PORT = process.env.PORT || 3000;

// // // יצירת Pool עבור החיבור ל-PostgreSQL
// // const pool = new Pool({
// //   host: process.env.DB_HOST,
// //   port: process.env.DB_PORT,
// //   database: process.env.DB_NAME,
// //   user: process.env.DB_USER,
// //   password: process.env.DB_PASSWORD,
// // });

// // // פונקציה לבדוק את החיבור למסד הנתונים
// // const connectDB = async () => {
// //   try {
// //     await pool.connect();
// //     console.log('✅ Connected to PostgreSQL');
// //   } catch (err) {
// //     console.error('❌ Failed to connect to PostgreSQL', err);
// //     process.exit(1); // סיום התהליך במקרה של כישלון
// //   }
// // };

// // // Middlewares
// // app.use(express.json());

// // // ייבוא הנתיבים
// // const usersRoutes = require('./routes/usersRoutes');
// // const productsRoutes = require('./routes/productsRoutes');
// // const boardGamesRoutes = require('./routes/boardGamesRoutes');
// // const booksRoutes = require('./routes/booksRoutes');
// // const puzzlesRoutes = require('./routes/puzzlesRoutes');
// // const exchangeRequestsRoutes = require('./routes/exchangeRequestsRoutes');
// // const notificationsRoutes = require('./routes/notificationsRoutes');
// // const rolesRoutes = require('./routes/rolesRoutes');
// // const { notFoundHandler } = require('./middlewares/notFoundMiddleware');

// // // חיבור הנתיבים ל-API
// // app.use('/api/users', usersRoutes);
// // app.use('/api/products', productsRoutes);
// // app.use('/api/board-games', boardGamesRoutes);
// // app.use('/api/books', booksRoutes);
// // app.use('/api/puzzles', puzzlesRoutes);
// // app.use('/api/exchange-requests', exchangeRequestsRoutes);
// // app.use('/api/notifications', notificationsRoutes);
// // app.use('/api/roles', rolesRoutes);

// // // דף ראשי
// // app.get('/', (req, res) => {
// //   res.send('Welcome to Swapify API!');
// // });

// // // Middleware לטיפול בנתיבים שלא קיימים (404)
// // app.use(notFoundHandler);

// // // התחברות למסד הנתונים
// // connectDB();

// // // הפעלת השרת
// // app.listen(PORT, () => {
// //   console.log(`🚀 Server running on http://localhost:${PORT}`);
// // });

// // module.exports = pool; // ייצוא ה-pool למודולים אחרים


// // // Import the functions you need from the SDKs you need
// // import { initializeApp } from "firebase/app";
// // // TODO: Add SDKs for Firebase products that you want to use
// // // https://firebase.google.com/docs/web/setup#available-libraries

// // // Your web app's Firebase configuration
// // const firebaseConfig = {
// //   apiKey: "AIzaSyCE1xCvFMUtbiibEjenvhdQ1IQRAvGELMo",
// //   authDomain: "swapify-6f271.firebaseapp.com",
// //   projectId: "swapify-6f271",
// //   storageBucket: "swapify-6f271.firebasestorage.app",
// //   messagingSenderId: "998065569507",
// //   appId: "1:998065569507:web:d268384305ca0e03c54fd6"
// // };

// // // Initialize Firebase
// // const app1 = initializeApp(firebaseConfig);


// const express = require('express');
// const dotenv = require('dotenv');
// const pool = require('./config/db');
// dotenv.config();

// const app = express();
// const PORT = process.env.PORT || 3000;

// // התחברות למסד הנתונים
// const connectDB = async () => {
//     try {
//         await pool.connect();
//         console.log('✅ Connected to PostgreSQL');
//     } catch (err) {
//         console.error('❌ Failed to connect to PostgreSQL', err);
//         process.exit(1);
//     }
// };

// app.use(express.json());

// // ייבוא הנתיבים
// const usersRoutes = require('./routes/usersRoutes');
// const productsRoutes = require('./routes/productsRoutes');
// const boardGamesRoutes = require('./routes/boardGamesRoutes');
// const booksRoutes = require('./routes/booksRoutes');
// const puzzlesRoutes = require('./routes/puzzlesRoutes');
// const exchangeRequestsRoutes = require('./routes/exchangeRequestsRoutes');
// const notificationsRoutes = require('./routes/notificationsRoutes');
// const rolesRoutes = require('./routes/rolesRoutes');
// const uploadRoutes = require('./routes/uploadRoutes');
// const authRoutes = require('./routes/authRoutes');
// const cors = require('cors');

// const { notFoundHandler } = require('./middlewares/notFoundMiddleware');

// // חיבור הנתיבים ל-API
// // app.use(cors()); // לאפשר לכל מקור לגשת ל-API
// app.use(cors({
//   origin: function (origin, callback) {
//       if (!origin || allowedOrigins.includes(origin)) {
//           callback(null, true);
//       } else {
//           callback(new Error('Not allowed by CORS'));
//       }
//   },
//   credentials: true
// }));
// app.use('/api/auth', authRoutes);
// app.use('/api/users', usersRoutes);
// app.use('/api/products', productsRoutes);
// app.use('/api/board-games', boardGamesRoutes);
// app.use('/api/books', booksRoutes);
// app.use('/api/puzzles', puzzlesRoutes);
// app.use('/api/exchange-requests', exchangeRequestsRoutes);
// app.use('/api/notifications', notificationsRoutes);
// app.use('/api/roles', rolesRoutes);
// app.use('/api/uploads', uploadRoutes);

// // Middleware לטיפול בנתיבים שלא קיימים (404)
// app.use(notFoundHandler);

// app.use((err, req, res, next) => {
//   console.error(err.stack);
//   res.status(500).json({ error: 'Something went wrong!' });
// });

// // התחברות למסד הנתונים
// connectDB();

// // הפעלת השרת
// app.listen(PORT, () => {
//     console.log(`🚀 Server running on http://localhost:${PORT}`);
// });

// module.exports = pool;


const express = require('express');
const dotenv = require('dotenv');
const pool = require('./config/db');
const cors = require('cors');
const app = express();
dotenv.config();

const PORT = process.env.PORT || 3000;

// התחברות למסד הנתונים
const connectDB = async () => {
    try {
        await pool.connect();
        console.log('✅ Connected to PostgreSQL');
    } catch (err) {
        console.error('❌ Failed to connect to PostgreSQL', err);
        process.exit(1);
    }
};

app.use(express.json());

// ייבוא הנתיבים
const authRoutes = require('./routes/authRoutes');
const usersRoutes = require('./routes/usersRoutes');
const productsRoutes = require('./routes/productsRoutes');
const boardGamesRoutes = require('./routes/boardGamesRoutes');
const booksRoutes = require('./routes/booksRoutes');
const puzzlesRoutes = require('./routes/puzzlesRoutes');
const exchangeRequestsRoutes = require('./routes/exchangeRequestsRoutes');
const notificationsRoutes = require('./routes/notificationsRoutes');
const rolesRoutes = require('./routes/rolesRoutes');
const uploadRoutes = require('./routes/uplaodRoutes');

const { notFoundHandler } = require('./middlewares/404Midlleware');

// חיבור הנתיבים ל-API
// app.use(cors()); // לאפשר לכל מקור לגשת ל-API

// app.use(cors({
//   origin: function (origin, callback) {
//       if (!origin || allowedOrigins.includes(origin)) {
//           callback(null, true);
//       } else {
//           callback(new Error('Not allowed by CORS'));
//       }
//   },
//   credentials: true
// }));


const allowedOrigins = [
    'http://localhost:5173', // Vite
    'http://localhost:3000', // React ב-Dev
    'https://your-production-domain.com' // לשנות לדומיין שלך בפרודקשן
];

app.use(cors({
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use('/api/auth', authRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/products', productsRoutes);
app.use('/api/board-games', boardGamesRoutes);
app.use('/api/books', booksRoutes);
app.use('/api/puzzles', puzzlesRoutes);
app.use('/api/exchange-requests', exchangeRequestsRoutes);
app.use('/api/notifications', notificationsRoutes);
app.use('/api/roles', rolesRoutes);
app.use('/api/uploads', uploadRoutes);

// Middleware לטיפול בנתיבים שלא קיימים (404)
app.use(notFoundHandler);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// התחברות למסד הנתונים
connectDB();

// הפעלת השרת
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});

module.exports = pool;
