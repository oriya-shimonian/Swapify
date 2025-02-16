const multer = require('multer');
const bucket = require('../config/firebaseConfig');
const { v4: uuidv4 } = require('uuid');

// קביעת מגבלות קובץ (לדוגמה, מקסימום 5MB)
const storage = multer.memoryStorage();
const upload = multer({ storage: storage, limits: { fileSize: 5 * 1024 * 1024 } });

// פונקציה להעלאת תמונה ל-Firebase Storage
exports.uploadImage = async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
    }

    const file = req.file;
    const fileName = `uploads/${uuidv4()}_${file.originalname}`; // יוצרים שם ייחודי לקובץ

    const fileUpload = bucket.file(fileName);
    const stream = fileUpload.createWriteStream({
        metadata: {
            contentType: file.mimetype
        }
    });

    stream.on('error', (err) => {
        console.error(err);
        res.status(500).json({ error: 'Failed to upload image' });
    });

    stream.on('finish', async () => {
        // יוצרים קישור ציבורי לתמונה
        await fileUpload.makePublic();
        const fileUrl = `https://storage.googleapis.com/${bucket.name}/${fileName}`;

        res.status(200).json({ imageUrl: fileUrl });
    });

    stream.end(file.buffer);
};

// Middleware להעלאת קבצים
exports.upload = upload.single('image');
