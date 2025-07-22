// // const { Pool } = require('pg');
// // require('dotenv').config();

// // const pool = new Pool({
// //     user: process.env.DB_USER,
// //     host: process.env.DB_HOST || 'db',
// //     database: process.env.DB_NAME || 5432,
// //     password: process.env.DB_PASSWORD,
// //     port: process.env.DB_PORT
// // });

// // // const pool = new Pool({
// // //   connectionString: process.env.DATABASE_URL,
// // //   ssl: {
// // //     rejectUnauthorized: false, // Render דורש SSL אבל לא תעודה
// // //   },
// // // });

// // module.exports = pool;

// const { Pool } = require('pg');
// require('dotenv').config();

// const pool = new Pool({
//   user: process.env.DB_USER || 'postgres',
//   host: process.env.DB_HOST || (process.env.NODE_ENV === 'production' ? 'db' : 'localhost'),
//   database: process.env.DB_NAME || 'swapify',
//   password: process.env.DB_PASSWORD || 'postgres',
//   port: Number(process.env.DB_PORT) || 5432,
// });

// module.exports = pool;

const { Pool } = require('pg');
require('dotenv').config();

const connectionString = process.env.DATABASE_URL;

const pool = connectionString
  ? new Pool({ connectionString })
  : new Pool({
      user: process.env.DB_USER || 'postgres',
      host: process.env.DB_HOST || (process.env.NODE_ENV === 'production' ? 'db' : 'localhost'),
      database: process.env.DB_NAME || 'swapify',
      password: process.env.DB_PASSWORD || 'postgres',
      port: Number(process.env.DB_PORT) || 5432,
    });

module.exports = pool;