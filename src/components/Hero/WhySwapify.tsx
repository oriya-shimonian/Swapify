// import { FaRecycle, FaUsers, FaBrain, FaShieldAlt } from "react-icons/fa";
// import { useNavigate } from "react-router-dom";
// import AppButton from "../Buttons/AppButton";
// import GlassCard from "../GlassCard";

// const features = [
//   {
//     icon: <FaRecycle className="lg:text-6xl md:text-2xl text-green-500" />,
//     title: "קיימות, תקציב וסדר",
//     description:
//       "SWAPIFY מאפשרת לך להחליף פריטים ולשמור על הסביבה תוך ניהול חכם של התקציב שלך.",
//   },
//   {
//     icon: <FaUsers className="lg:text-6xl md:text-2xl text-blue-500" />,
//     title: "קהילה אמינה ותומכת",
//     description:
//       "הצטרף לקהילה איכותית של מחליפים, עם דירוגי משתמשים, פידבקים ומערכת שקיפות מלאה.",
//   },
//   {
//     icon: <FaBrain className="lg:text-6xl md:text-2xl text-purple-500" />,
//     title: "AI למילוי חכם",
//     description:
//       "אין צורך להקליד ידנית! המערכת מזהה וממלאת עבורך את הפרטים הרלוונטיים על סמך תמונה.",
//   },
//   {
//     icon: <FaShieldAlt className="lg:text-6xl md:text-2xl text-red-500" />,
//     title: "אבטחה וגישה נוחה",
//     description:
//       "התחבר עם חשבון Google או Facebook או הרשמה ישירה, תוך הקפדה על מדיניות קהילה בטוחה",
//   },
// ];

// const WhySwapify = () => {
//   const navigate = useNavigate();
//   return (
//     <section
//       dir="rtl"
//       className="h-screen md:min-h-screen flex flex-col justify-center items-center bg-white dark:bg-gray-900 dark:text-gray-300 text-center px-8"
//     >
//       {/* כותרת ראשית */}
//       <div className="max-w-4xl mx-auto lg:mb-12 md:mb-3">
//         <h3 className="lg:text-5xl mb:text-lg font-extrabold text-gray-900 dark:text-white leading-snug">
//           הדרך החכמה למקסם את הערך של הפריטים שלך
//         </h3>
//         <p className="text-base text-gray-600 dark:text-gray-400 mt-4 mb-1">
//           במקום שהפריטים שלך יישארו ללא שימוש,
//           <span className="font-bold" style={{ unicodeBidi: "plaintext" }}>
//             {" "}
//             SWAPIFY{" "}
//           </span>
//           מעניקה להם חיים חדשים! עם טכנולוגיית AI מתקדמת לזיהוי ותיוג מוצרים,
//           קהילה איכותית ומערכת סינון חכמה – תוכל למצוא בקלות את הפריטים המתאימים
//           ביותר עבורך.
//         </p>
//       </div>

//       {/* 4 יתרונות - פריסה מלאה */}
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 max-w-6xl mx-auto mb-12">
//         {features.map((feature, index) => (
//           <GlassCard key={index} {...feature} />
//         ))}
//       </div>

//       {/* CTA - כפתור מרכזי */}
//       <div className="lg:mt-6 md:mt-3">
//         <AppButton onClick={() => navigate("/login")} className="lg:py-4 md:py-2">
//           הצטרפו עכשיו
//         </AppButton>
//       </div>
//     </section>
//   );
// };

// export default WhySwapify;

import { FaRecycle, FaUsers, FaBrain, FaShieldAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import AppButton from "../Buttons/AppButton";
import GlassCard from "../GlassCard";

const features = [
  {
    icon: <FaRecycle className="text-4xl md:text-5xl lg:text-6xl text-green-500" />,
    title: "קיימות, תקציב וסדר",
    description:
      "SWAPIFY מאפשרת לך להחליף פריטים ולשמור על הסביבה תוך ניהול חכם של התקציב שלך.",
  },
  {
    icon: <FaUsers className="text-4xl md:text-5xl lg:text-6xl text-blue-500" />,
    title: "קהילה אמינה ותומכת",
    description:
      "הצטרף לקהילה איכותית של מחליפים, עם דירוגי משתמשים, פידבקים ומערכת שקיפות מלאה.",
  },
  {
    icon: <FaBrain className="text-4xl md:text-5xl lg:text-6xl text-purple-500" />,
    title: "AI למילוי חכם",
    description:
      "אין צורך להקליד ידנית! המערכת מזהה וממלאת עבורך את הפרטים הרלוונטיים על סמך תמונה.",
  },
  {
    icon: <FaShieldAlt className="text-4xl md:text-5xl lg:text-6xl text-red-500" />,
    title: "אבטחה וגישה נוחה",
    description:
      "התחבר עם חשבון Google או Facebook או הרשמה ישירה, תוך הקפדה על מדיניות קהילה בטוחה",
  },
];

const WhySwapify = () => {
  const navigate = useNavigate();
  return (
    <section
      dir="rtl"
      className="h-auto min-h-screen flex flex-col justify-center items-center bg-white dark:bg-gray-900 dark:text-gray-300 text-center px-4 sm:px-8 py-10"
    >
      {/* כותרת ראשית */}
      <div className="max-w-4xl mx-auto lg:mb-12 md:mb-3">
        <h3 className="lg:text-5xl text-3xl font-extrabold text-gray-900 dark:text-white leading-snug">
          הדרך החכמה למקסם את הערך של הפריטים שלך
        </h3>
        <p className="text-base text-gray-600 dark:text-gray-400 mt-4 mb-1">
          במקום שהפריטים שלך יישארו ללא שימוש,
          <span className="font-bold" style={{ unicodeBidi: "plaintext" }}>
            {" "}
            SWAPIFY{" "}
          </span>
          מעניקה להם חיים חדשים! עם טכנולוגיית AI מתקדמת לזיהוי ותיוג מוצרים,
          קהילה איכותית ומערכת סינון חכמה – תוכל למצוא בקלות את הפריטים המתאימים ביותר עבורך.
        </p>
      </div>

      {/* 4 יתרונות */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-10 lg:gap-12 max-w-6xl mx-auto mb-12 mt-10">
        {features.map((feature, index) => (
          <GlassCard key={index} {...feature} />
        ))}
      </div>

      {/* CTA */}
      <div className="lg:mt-6 md:mt-3">
        <AppButton onClick={() => navigate("/login")} className="lg:py-4 md:py-2">
          הצטרפו עכשיו
        </AppButton>
      </div>
    </section>
  );
};

export default WhySwapify;
