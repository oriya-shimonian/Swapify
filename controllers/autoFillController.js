const axios = require("axios");

exports.autoFillProduct = async (req, res) => {
  const { productName } = req.body;

  if (!productName) {
    return res.status(400).json({ error: "חסר שם מוצר" });
  }

  try {
    // 1️⃣ חיפוש בגוגל דרך SerpAPI
    const serpResponse = await axios.get("https://serpapi.com/search", {
      params: {
        q: `${productName} משחק קופסה או ספר או פאזל`,
        hl: "he", // תוצאות בעברית
        gl: "il",
        api_key: process.env.SERPAPI_KEY,
      },
    });

    const results = serpResponse.data?.organic_results;

    if (!results || results.length === 0) {
      return res.status(404).json({ error: "לא נמצאו תוצאות בגוגל" });
    }

    // 2️⃣ ניקח את התיאור הראשון שנראה סביר (בד"כ השורה שמתחת לכותרת)
    const snippet = results[0].snippet || results[0].title;

    if (!snippet) {
      return res.status(500).json({ error: "לא התקבל תיאור מגוגל" });
    }

    // 3️⃣ שליחה ל־GPT ליצירת JSON חכם
    const gptResponse = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: `
            אתה עוזר במערכת בשם Swapify שממלאת טופס על מוצרים.

            תקבל תיאור קצר של מוצר כלשהו (ספר, משחק קופסה או פאזל), ותחזיר JSON בפורמט הבא בלבד:

            {
              "title": "string",
              "description": "string", // פסקה קצרה בעברית שמסבירה מהו המוצר או איך משחקים בו
              "category": "Book" | "Board Game" | "Puzzle",
              "subcategory": "string",
              "extraFields": { ... }
            }

            ⚠️ אל תוסיף הסברים – רק JSON חוקי.

            עבור השדה subcategory:
            השתמש **אך ורק באחת מהאפשרויות הבאות לפי הקטגוריה**:

            - ספרים: "Romance", "Thriller", "Fantasy", "Sci-Fi", "Children", "Non-fiction", "Biography", "Textbook"
            - משחקי קופסה: "Strategy", "Kids", "Party", "Puzzle", "Two-player", "Group", "Family"
            - פאזלים: "Nature", "Art", "Kids", "3 D"

            עבור השדה description:
            - נסח משפט קצר שמסביר למשתמש מהו המוצר או איך משתמשים בו.
            - אל תתאר את התמונה או את היצרן – אלא את התוכן, החוויה או הוראות המשחק/עלילה.

            עבור extraFields:
            - החזר אך ורק את השדות הרלוונטיים לקטגוריה, במבנה הבא:

            • אם זה משחק קופסה:
            "min_players": number, "max_players": number, "duration": number

            • אם זה ספר:
            "author": string, "page_count": number, "publisher": string, "publish_year": number

            • אם זה פאזל:
            "manufacturer": string, "piecesCount": number
          `},

          {
            role: "user",
            content: snippet,
          },
        ],
        temperature: 0.3,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        },
      }
    );

    const rawText = gptResponse.data.choices[0].message.content;
    const jsonMatch = rawText.match(/{[\s\S]*}/);
    const parsed = jsonMatch ? JSON.parse(jsonMatch[0]) : null;
    console.log("Raw GPT response:", rawText);
    console.log("Parsed JSON:", parsed);
    if (!parsed) {
      return res.status(500).json({ error: "שגיאה בפירוש תגובת GPT" });
    }

    return res.status(200).json({ autofill: parsed });
  } catch (err) {
    console.error("Auto-fill error:", err.response?.data || err.message);
    return res.status(500).json({ error: "שגיאה בתהליך השלמה אוטומטית" });
  }
};

// // the prompt with an open subcategory field
//           {
//             role: "system",
//             content: `
//             אתה עוזר במערכת בשם Swapify שממלאת טופס על מוצרים.
//             קבל תיאור קצר על מוצר (משחק קופסה / ספר / פאזל), והחזר אובייקט JSON בפורמט הבא בלבד:

//             {
//               "title": "string",
//               "description": "string", // בעברית, תקציר או הוראות – לא תיאור תמונה
//               "category": "Book" | "Board Game" | "Puzzle",
//               "subcategory": "string",
//               "extraFields": {
//                 // בהתאם לקטגוריה בלבד:

//                 // אם זה ספר:
//                 "author": "string",
//                 "page_count": number,
//                 "publisher": "string",
//                 "publish_year": number

//                 // אם זה משחק קופסה:
//                 "min_players": number,
//                 "max_players": number,
//                 "duration": number

//                 // אם זה פאזל:
//                 "manufacturer": "string",
//                 "piecesCount": number
//               }
//             }

//             🔴 אל תוסיף שדות אחרים (כמו awards, manufacturer במשחקים וכו’).
//             🔴 החזר אך ורק JSON חוקי – בלי הסברים, בלי טקסט מסביב.
//             `},
