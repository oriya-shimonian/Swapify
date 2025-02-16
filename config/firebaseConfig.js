const admin = require('firebase-admin');
const path = require('path');

// התחברות ל-Firebase עם המפתח הפרטי
const serviceAccount = require(path.join(__dirname, 'serviceAccountKey.json'));

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET // הכתובת של ה-Bucket מהסביבה
});

const bucket = admin.storage().bucket();

module.exports = bucket;
