## תיעוד והדרכה לבקאנד

### מבוא לפיתוח צד שרת עם Node.js

Node.js הוא סביבה שמאפשרת להריץ קוד JavaScript בצד השרת. הוא נמצא בשימוש רחב לבניית יישומים אינטרנטיים סקיילביליים ויעילים. מדריך זה נועד לספק סקירה מפורטת על פיתוח צד שרת עם Node.js, מותאם למתחילים.

### מושגי יסוד בפיתוח צד שרת

- **שרת**: תוכנה שמאזינה ומעבדת בקשות מלקוחות (למשל, דפדפנים).
    
- **API** (ממשק תכנות יישומים): סט חוקים שמאפשר תקשורת בין רכיבי תוכנה.
    
- **בסיס נתונים**: אוסף נתונים מובנה. פתרון פופולרי לשימוש בפרויקט זה הוא PostgreSQL.
    
- **ניתוב**: מיפוי בקשות נכנסות לפונקציות ספציפיות בקוד.
    
- **Middleware**: פונקציות שרצות לפני או אחרי הטיפול בבקשה, למשל לאימות או ניתוח נתונים.
    

### כלים וספריות

- **Node.js**: פלטפורמה להרצת JavaScript בצד השרת.
    
- **Express.js**: פריימוורק מינימלי לבניית אפליקציות אינטרנט.
    
- **Sequelize**: ORM (Object Relational Mapping) לניהול מסדי נתונים ב-PostgreSQL.
    
- **dotenv**: ספרייה לניהול משתני סביבה.
    

### הגדרת סביבת עבודה

#### שלב 1: התקנת Node.js

הורד והתקן את Node.js מהאתר הרשמי: [Node.js Official Website](https://nodejs.org/).

#### שלב 2: יצירת פרויקט חדש

1. פתח טרמינל והרץ את הפקודות הבאות ליצירת תיקיית פרויקט ולהגדרת סביבת עבודה בסיסית:
    

```
mkdir swapify-backend
cd swapify-backend
npm init -y
```

פעולה זו תיצור קובץ `package.json` לניהול תלויות הפרויקט.

#### שלב 3: התקנת ספריות

התקן את הספריות הנדרשות לפרויקט:

```
npm install express sequelize pg pg-hstore dotenv sharp redis @tensorflow/tfjs @tensorflow-models/mobilenet
```

### בניית שרת בסיסי עם Express

#### מבנה הפרויקט

ארגן את הקבצים והתיקיות כך:

```
swapify-backend/
|-- server.js
|-- .env
|-- models/
|-- routes/
```

#### יצירת קובץ `server.js`

```
const express = require('express');
const dotenv = require('dotenv');
const { connectDB } = require('./models/db');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.get('/', (req, res) => {
    res.send('ברוכים הבאים ל-Swapify!');
});

connectDB();

app.listen(PORT, () => {
    console.log(`השרת פועל בכתובת http://localhost:${PORT}`);
});
```

#### הפעלת השרת

הפעל את השרת באמצעות הפקודה:

```
node server.js
```

בדוק את הכתובת [http://localhost:3000](http://localhost:3000) בדפדפן.

### חיבור ל-PostgreSQL עם Sequelize

#### יצירת בסיס נתונים

צור בסיס נתונים חדש בשם `swapify` באמצעות pgAdmin או בשורת הפקודה:

```
CREATE DATABASE swapify;
```

#### קובץ חיבור למסד הנתונים

צור קובץ חדש `models/db.js` שיטפל בחיבור למסד הנתונים:

```
const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: 'postgres',
    protocol: 'postgres',
    logging: false,
});

const connectDB = async () => {
    try {
        await sequelize.authenticate();
        console.log('חיבור ל-PostgreSQL הצליח');
    } catch (error) {
        console.error('חיבור ל-PostgreSQL נכשל:', error.message);
        process.exit(1);
    }
};

module.exports = { sequelize, connectDB };
```

#### עדכון `server.js` לחיבור

```
const { connectDB } = require('./models/db');

connectDB();
```

#### הגדרת משתני סביבה

הוסף קובץ `.env` עם פרטי החיבור:

```
DATABASE_URL=postgres://username:password@localhost:5432/swapify
```

### יצירת מודלים עם Sequelize

#### מודל משתמשים (`Users`)

```
// models/User.js
const { DataTypes } = require('sequelize');
const { sequelize } = require('./db');

const User = sequelize.define('User', {
    name: { type: DataTypes.STRING, allowNull: false },
    email: { type: DataTypes.STRING, allowNull: false, unique: true },
    password_hash: { type: DataTypes.STRING, allowNull: false },
    profile_picture: { type: DataTypes.STRING },
    location: { type: DataTypes.STRING },
    auth_provider: { type: DataTypes.STRING },
    role_id: { type: DataTypes.INTEGER, allowNull: false },
    notification_enabled: { type: DataTypes.BOOLEAN, defaultValue: true },
    is_banned: { type: DataTypes.BOOLEAN, defaultValue: false },
}, {
    timestamps: true,
});

module.exports = User;
```

#### מודל מוצרים (`Products`)

```
// models/Product.js
const { DataTypes } = require('sequelize');
const { sequelize } = require('./db');

const Product = sequelize.define('Product', {
    title: { type: DataTypes.STRING, allowNull: false },
    description: { type: DataTypes.TEXT, allowNull: false },
    category: { type: DataTypes.STRING, allowNull: false },
    subcategory: { type: DataTypes.STRING },
    condition: { type: DataTypes.STRING, allowNull: false },
    location: { type: DataTypes.STRING },
    image_url: { type: DataTypes.STRING },
}, {
    timestamps: true,
});

module.exports = Product;
```

#### מודל פאזלים (`Puzzles`)

```
// models/Puzzle.js
const { DataTypes } = require('sequelize');
const { sequelize } = require('./db');
const Product = require('./Product');

const Puzzle = sequelize.define('Puzzle', {
    manufacturer: { type: DataTypes.STRING },
    pieces_count: { type: DataTypes.INTEGER },
    subcategory: { type: DataTypes.STRING },
}, {
    timestamps: false,
});

Puzzle.belongsTo(Product, { foreignKey: 'product_id' });

module.exports = Puzzle;
```

### עיבוד תמונות ושמירת גרסאות

#### שימוש ב-Sharp ליצירת גרסאות תמונה

```
const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

async function processAndSaveImage(fileBuffer, filename) {
    const outputDir = path.join(__dirname, 'uploads');
    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir);
    }

    // שמירת תמונה באיכות גבוהה
    await sharp(fileBuffer)
        .toFormat('jpeg')
        .toFile(path.join(outputDir, `high_quality_${filename}.jpeg`));

    // יצירת גרסה בינונית
    await sharp(fileBuffer)
        .resize(800)
        .toFormat('jpeg')
        .toFile(path.join(outputDir, `medium_${filename}.jpeg`));

    // יצירת גרסה קטנה
    await sharp(fileBuffer)
        .resize(200)
        .toFormat('jpeg')
        .toFile(path.join(outputDir, `small_${filename}.jpeg`));

    console.log('Images processed and saved successfully.');
}
```

#### סיווג תמונות עם TensorFlow.js

```
const tf = require('@tensorflow/tfjs-node');
const mobilenet = require('@tensorflow-models/mobilenet');
const sharp = require('sharp');

async function classifyImage(imagePath) {
    const imageBuffer = await sharp(imagePath).resize(224, 224).toBuffer();
    const model = await mobilenet.load();
    const imageTensor = tf.node.decodeImage(imageBuffer, 3).expandDims();
    const predictions = await model.classify(imageTensor);

    console.log('Predictions:', predictions);
    return predictions.map(pred => pred.className); // מחזיר את התגיות
}
```

### שילוב Redis לקאשינג

```
const redis = require('redis');
const client = redis.createClient();

async function cacheImageTags(imagePath) {
    const tagsKey = `image_tags:${imagePath}`;
    const cachedTags = await client.get(tagsKey);

    if (cachedTags) {
        console.log('Tags from cache:', JSON.parse(cachedTags));
        return JSON.parse(cachedTags);
    }

    const tags = await classifyImage(imagePath);
    client.setex(tagsKey, 3600, JSON.stringify(tags)); // שמירה בקאש לשעה
    console.log('Tags from model:', tags);
    return tags;
}
```


התיעוד המעודכן מספק תשתית חזקה לפיתוח ה-Backend, אך כדי לוודא שהוא תומך בכל הפונקציונליות הדרושה (כפי שמפורט בדוח ההצעה ובמסמכי ה-DB), הנה פירוט נוסף של מה שכדאי לוודא או להוסיף:

---

### פונקציונליות חיונית וסטטוסים:

1. **תמיכה בהרשמה והתחברות (Login/Registration):**
    
    - **קיים**: התיעוד כולל יצירת משתמשים עם סיסמאות מגובבות, התחברות עם אימות סיסמה, ושימוש ב-JWT ליצירת טוקנים.
    - **נדרש לוודא**:
        - אימות ספקי OAuth (Google, Facebook) למי שלא רוצה להירשם ידנית.
        - הגנה על נתיבי התחברות עם rate limiting (למניעת התקפות כוח גס).
2. **דיווח על משתמשים:**
    
    - **קיים חלקית**: התיעוד כולל טבלאות לדיווחים, אך אין פונקציות API מפורטות.
    - **מה להוסיף**:
        - פונקציה `reportUser`:
            
            ```javascript
            async function reportUser(reportedUserId, reportingUserId, reason) {
                await UserReports.create({
                    reported_user_id: reportedUserId,
                    user_id: reportingUserId,
                    report_reason: reason,
                    status: 'Open',
                });
                return { message: 'Report submitted successfully.' };
            }
            ```
            
        - API לניהול סטטוס דיווחים (פתוח, נבדק, נסגר).
3. **התראות (Notifications):**
    
    - **קיים חלקית**: המודלים תומכים בהתראות, אך חסרות פונקציות לשליחה ושליפה.
    - **מה להוסיף**:
        - פונקציה `sendNotification`:
            
            ```javascript
            async function sendNotification(userId, message) {
                await Notifications.create({
                    user_id: userId,
                    message,
                    status: 'Unread',
                });
            }
            ```
            
        - פונקציה לשליפת התראות (`getNotifications`), כולל עדכון סטטוס ל-"נקראה".
4. **בקשות להחלפה (Exchange Requests):**
    
    - **קיים**: יש תמיכה ביצירת בקשות, עדכון סטטוסים, והיסטוריית החלפות.
    - **מה לוודא**:
        - הגבלת משתמשים לנהל מספר בקשות מוגבל בו-זמנית.
        - תהליך אישור/דחייה אוטומטי או ידני עם התראות.
5. **ניהול מוצרים:**
    
    - **קיים**: יש פונקציות להוספה, עדכון ומחיקת מוצרים.
    - **מה להוסיף**:
        - פיצ'ר למעקב אחרי פריטים פופולריים או שמורים.

---

### שיפורים בביצועים ואבטחה:

1. **שימוש בקאשינג (Redis):**
    
    - **כבר מתועד**: קאשינג לתגיות תמונה.
    - **הרחבה נדרשת**:
        - שמירת נתוני חיפוש נפוצים בקאש.
        - ניהול זמן מחיקה אוטומטית (TTL).
2. **שכבת אבטחה:**
    
    - שימוש ב-Helmet להגנה על HTTP headers.
    - אימות באמצעות JWT לכל נתיבי ה-API הרגישים.
    - תיעוד וניטור פעולות חשודות עם Audit Logs.

---

### בדיקות ובקרה:

1. **בדיקות יחידה ואינטגרציה (Unit & Integration Tests):**
    
    - כתיבת בדיקות לנתיבי ה-API המרכזיים (Login, Products, Notifications, Reports).
    - שימוש בספריות כמו Jest ו-Supertest.
2. **ניטור ובקרה:**
    
    - שימוש ב-Log Management (כמו Winston או Bunyan).
    - חיבור לכלי ניטור כמו New Relic או Datadog.

---

### סיכום:

המבנה הנוכחי מכסה בסיס רחב של פונקציונליות, אך כדאי להוסיף את הפונקציות והאימותים שהוזכרו כדי לוודא שכל המערכת תתפקד בצורה חלקה ותספק את כל מה שהפרויקט דורש.

אם תרצה, אני יכול להוסיף עוד פונקציות או קוד לדוגמה לתיעוד.
### סיכום

- **Frontend**: יצירת תצוגה מקדימה מהירה.
    
- **Backend**: שמירת גרסאות שונות של תמונות, סיווג באמצעות AI.
    
- **Redis**: לשיפור ביצועים באמצעות קאשינג.
    

זהו בסיס מצוין לפיתוח מערכת backend עבור Swapify. ניתן להמשיך להוסיף פיצ'רים ולשפר ביצועים בהתאם לצרכים.