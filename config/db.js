// // // // // const { Pool } = require('pg');
// // // // // require('dotenv').config();

// // // // // const pool = new Pool({
// // // // //     user: process.env.DB_USER,
// // // // //     host: process.env.DB_HOST || 'db',
// // // // //     database: process.env.DB_NAME || 5432,
// // // // //     password: process.env.DB_PASSWORD,
// // // // //     port: process.env.DB_PORT
// // // // // });

// // // // // // const pool = new Pool({
// // // // // //   connectionString: process.env.DATABASE_URL,
// // // // // //   ssl: {
// // // // // //     rejectUnauthorized: false, // Render דורש SSL אבל לא תעודה
// // // // // //   },
// // // // // // });

// // // // // module.exports = pool;

// // // // const { Pool } = require('pg');
// // // // require('dotenv').config();

// // // // const pool = new Pool({
// // // //   user: process.env.DB_USER || 'postgres',
// // // //   host: process.env.DB_HOST || (process.env.NODE_ENV === 'production' ? 'db' : 'localhost'),
// // // //   database: process.env.DB_NAME || 'swapify',
// // // //   password: process.env.DB_PASSWORD || 'postgres',
// // // //   port: Number(process.env.DB_PORT) || 5432,
// // // // });

// // // // module.exports = pool;

// // // const { Pool } = require('pg');
// // // require('dotenv').config();

// // // const connectionString = process.env.DATABASE_URL;

// // // const pool = connectionString
// // //   ? new Pool({ connectionString })
// // //   : new Pool({
// // //       user: process.env.DB_USER || 'postgres',
// // //       host: process.env.DB_HOST || (process.env.NODE_ENV === 'production' ? 'db' : 'localhost'),
// // //       database: process.env.DB_NAME || 'swapify',
// // //       password: process.env.DB_PASSWORD || 'postgres',
// // //       port: Number(process.env.DB_PORT) || 5432,
// // //     });

// // // module.exports = pool;


// // const { Pool } = require('pg');
// // require('dotenv').config();

// // let pool;

// // if (process.env.DATABASE_URL) {
// //   // ✅ מצב Production או Neon
// //   pool = new Pool({
// //     connectionString: process.env.DATABASE_URL,
// //     ssl: {
// //       rejectUnauthorized: false, // נדרש ב-Neon וב-Render
// //     },
// //   });
// //   console.log('🔗 Connected to remote PostgreSQL (Neon / Production)');
// // } else {
// //   // ✅ מצב Local Development
// //   pool = new Pool({
// //     user: process.env.DB_USER || 'postgres',
// //     host:
// //       process.env.DB_HOST ||
// //       (process.env.NODE_ENV === 'production' ? 'db' : 'localhost'),
// //     database: process.env.DB_NAME || 'swapify',
// //     password: process.env.DB_PASSWORD || 'postgres',
// //     port: Number(process.env.DB_PORT) || 5432,
// //   });
// //   console.log(`🧩 Connected to local PostgreSQL (${process.env.DB_NAME})`);
// // }

// // module.exports = pool;


// // db.js
// const { Pool } = require('pg');
// require('dotenv').config();

// const connectionString = process.env.DATABASE_URL;

// const pool = connectionString
//   ? new Pool({
//       connectionString,
//       ssl: connectionString.includes('neon.tech')
//         ? { rejectUnauthorized: false }
//         : false,
//     })
//   : new Pool({
//       user: process.env.DB_USER || 'postgres',
//       host:
//         process.env.DB_HOST ||
//         (process.env.NODE_ENV === 'production' ? 'db' : 'localhost'),
//       database: process.env.DB_NAME || 'swapify',
//       password: process.env.DB_PASSWORD || 'postgres',
//       port: Number(process.env.DB_PORT) || 5432,
//     });

// // נבדוק חיבור חד-פעמי אבל לא נסגור את ה-pool
// pool
//   .query('SELECT NOW()')
//   .then(res => console.log('✅ Connected to PostgreSQL at:', res.rows[0].now))
//   .catch(err => console.error('❌ Failed to connect to PostgreSQL\n', err.message));

//   console.log('🔍 Using DB config:', {
//   host: process.env.DB_HOST,
//   database: process.env.DB_NAME,
//   user: process.env.DB_USER,
//   port: process.env.DB_PORT,
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



// // src/db.js
// 'use strict';
// require('dotenv').config();
// const { Pool } = require('pg');

// const {
//   DATABASE_URL,
//   DB_USER,
//   DB_HOST,
//   DB_NAME,
//   DB_PASSWORD,
//   DB_PORT,
//   NODE_ENV,
// } = process.env;

// // helper להחלטה האם צריך ssl (Neon / Render וכו')
// const needsSsl = (url = '') =>
//   url.includes('neon.tech') || url.includes('render.com') || url.includes('heroku.com');

// let pool;

// if (DATABASE_URL) {
//   console.log('ℹ️ Using DATABASE_URL for connection');
//   pool = new Pool({
//     connectionString: DATABASE_URL,
//     ssl: needsSsl(DATABASE_URL) ? { rejectUnauthorized: false } : false,
//   });
// } else {
//   // וידוא ערכים ופרסינג פורט
//   const port = DB_PORT ? Number(DB_PORT) : 5432;

//   pool = new Pool({
//     user: DB_USER || 'postgres',
//     host: DB_HOST || (NODE_ENV === 'production' ? 'db' : 'localhost'),
//     database: DB_NAME || 'postgres',
//     password: DB_PASSWORD || '',
//     port,
//     // אופציונלי: application_name מזהה את ה־client ב־pg_stat_activity
//     application_name: 'swapify-local',
//   });
// }

// pool.on('error', (err) => {
//   console.error('❌ Unexpected idle client error', err);
// });

// // בדיקת חיבור קצרה בזמן אתחול (לא סוגר את ה-pool)
// (async () => {
//   try {
//     const res = await pool.query('SELECT current_database() as db, current_user as user, now() as now');
//     console.log('✅ Postgres connection OK —', res.rows[0]);
//     // נוודא שה־search_path כולל public כדי שלא ניתקל ב"relation does not exist" כאשר הטבלה ב-public
//     const sp = await pool.query("SHOW search_path");
//     console.log('🔍 search_path =', sp.rows[0].search_path || sp.rows[0].Search_path);
//   } catch (err) {
//     console.error('❌ Failed to connect to Postgres:', err.message || err);
//   }
// })();

// module.exports = pool;
