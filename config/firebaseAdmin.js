// for local version
const admin = require("firebase-admin");
const path = require("path");
const serviceAccount = require("./serviceAccountKey.json");

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  });
}

const bucket = admin.storage().bucket();

module.exports = {
  admin,
  bucket, 
};

// // for hosting version
// const admin = require("firebase-admin");

// // במקום require על קובץ JSON חיצוני:
// const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);

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
