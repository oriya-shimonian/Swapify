// // for local version
// const admin = require("firebase-admin");
// const path = require("path");
// const serviceAccount = require("./serviceAccountKey.json");

// if (!admin.apps.length) {
//   admin.initializeApp({
//     credential: admin.credential.cert(serviceAccount),
//     storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
//   });
// }

// const bucket = admin.storage().bucket();

// module.exports = {
//   admin,
//   bucket, 
// };

// // // for hosting version
// // const admin = require("firebase-admin");

// // // במקום require על קובץ JSON חיצוני:
// // const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);

// // if (!admin.apps.length) {
// //   admin.initializeApp({
// //     credential: admin.credential.cert(serviceAccount),
// //     storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
// //   });
// // }

// // const bucket = admin.storage().bucket();

// // module.exports = {
// //   admin,
// //   bucket,
// // };
// config/firebaseAdmin.js
const admin = require('firebase-admin');

function loadServiceAccount() {
  if (process.env.FIREBASE_SERVICE_ACCOUNT) {
    try {
      // תומך גם במקרה שבו שמים ערך מקודד Base64 (אם תרצי בעתיד)
      const raw = process.env.FIREBASE_SERVICE_ACCOUNT;
      const jsonStr = raw.trim().startsWith('{') ? raw : Buffer.from(raw, 'base64').toString('utf8');
      return JSON.parse(jsonStr);
    } catch (e) {
      console.error('❌ FIREBASE_SERVICE_ACCOUNT is not valid JSON/Base64:', e.message);
      process.exit(1);
    }
  }
  // לוקאל בלבד – קובץ שלא נכנס ל-git
  try {
    // שימי את הקובץ כאן: backend/config/serviceAccountKey.json
    // (ודאי שהוא ב-.gitignore)
    // eslint-disable-next-line global-require, import/no-dynamic-require
    return require('./serviceAccountKey.json');
  } catch {
    console.error('❌ Missing Firebase Admin credentials. Set FIREBASE_SERVICE_ACCOUNT or add config/serviceAccountKey.json locally.');
    process.exit(1);
  }
}

if (!admin.apps.length) {
  const serviceAccount = loadServiceAccount();
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    // אם לא הוגדר ENV – ברירת מחדל חכמה לפי project_id
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET || `${serviceAccount.project_id}.appspot.com`,
  });
}

const bucket = admin.storage().bucket();

module.exports = { admin, bucket };
