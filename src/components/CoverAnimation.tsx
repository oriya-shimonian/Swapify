// // // // import React, { useEffect, useState } from "react";

// // // // const RECT_COUNT = 6;
// // // // const ANIMATION_DURATION = 700; // משך ירידת מלבן במילישניות
// // // // const DELAY_BETWEEN_RECTS = 150; // עיכוב בין מלבנים במילישניות

// // // // export default function CoverAnimation({
// // // //   children,
// // // // }: {
// // // //   children?: React.ReactNode;
// // // // }) {
// // // //   const [phase, setPhase] = useState("enter");

// // // //   useEffect(() => {
// // // //     const enterTime = DELAY_BETWEEN_RECTS * (RECT_COUNT - 1);
// // // //     const exitTime = ANIMATION_DURATION + enterTime + 1000;

// // // //     const timeout1 = setTimeout(() => setPhase("exit"), enterTime);
// // // //     const timeout2 = setTimeout(() => setPhase("done"), exitTime);

// // // //     return () => {
// // // //       clearTimeout(timeout1);
// // // //       clearTimeout(timeout2);
// // // //     };
// // // //   }, []);

// // // //   return (
// // // //     <>
// // // //       {/* מלבנים */}
// // // //       {phase !== "done" && (
// // // //         <div className="fixed inset-0 z-50 flex">
// // // //           {Array.from({ length: RECT_COUNT }).map((_, i) => {
// // // //             const delay = i * DELAY_BETWEEN_RECTS;
// // // //             const translate =
// // // //               phase === "enter"
// // // //                 ? "translate-y-0"
// // // //                 : phase === "exit"
// // // //                 ? "-translate-y-full"
// // // //                 : "";
// // // //             return (
// // // //               <div
// // // //                 key={i}
// // // //                 className={`
// // // //                   flex-1 h-full bg-white
// // // //                   transform
// // // //                   transition-transform
// // // //                   duration-[${ANIMATION_DURATION}ms]
// // // //                   ${translate}
// // // //                 `}
// // // //                 style={{ transitionDelay: `${delay}ms` }}
// // // //               >
// // // //                 <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 min-h-[30vh] text-gray-500 dark:text-gray-300 mt-8">
// // // //                   <img
// // // //                     src="/logo-without bg.png"
// // // //                     className="h-52 sm:h-28 animate-bounce mb-3 mt-40"
// // // //                     alt="טוען..."
// // // //                   />
// // // //                 </div>
// // // //               </div>
// // // //             );
// // // //           })}
// // // //         </div>
// // // //       )}

// // // //       {/* תוכן האתר */}
// // // //       <div
// // // //         className={`relative z-0 transition-opacity duration-700 ${
// // // //           phase === "enter" ? "opacity-0" : "opacity-100"
// // // //         }`}
// // // //       >
// // // //         {children}
// // // //       </div>
// // // //     </>
// // // //   );
// // // // }

// // import React, { useEffect, useState } from "react";

// // const RECT_COUNT = 6;
// // const ANIMATION_DURATION = 700;
// // const DELAY_BETWEEN_RECTS = 150;

// // export default function CoverAnimation({
// //   children,
// // }: {
// //   children?: React.ReactNode;
// // }) {
// //   const [phase, setPhase] = useState("enter");

// //   useEffect(() => {
// //     const enterTime =
// //       ANIMATION_DURATION + DELAY_BETWEEN_RECTS * (RECT_COUNT - 1);
// //     const exitTime = enterTime + 1000;

// //     const timeout1 = setTimeout(() => setPhase("exit"), enterTime);
// //     const timeout2 = setTimeout(() => setPhase("done"), exitTime);

// //     return () => {
// //       clearTimeout(timeout1);
// //       clearTimeout(timeout2);
// //     };
// //   }, []);

// //   return (
// //     <>
// //       {/* Loader שלב ENTER בלבד */}
// //       {phase === "enter" && (
// //         <div className="fixed inset-0 z-50 flex items-center justify-center bg-white">
// //           <div className="absolute left-1/2 top-1/3 transform -translate-x-1/2 -translate-y-1/2 min-h-[30vh] text-gray-500 dark:text-gray-300 mt-8">
// //             <img
// //               src="/logo-without bg.png"
// //               className="h-52 sm:h-28 animate-bounce mb-3 mt-40"
// //               alt="טוען..."
// //             />
// //           </div>
// //         </div>
// //       )}

// //       {/* מלבנים הראשיים שלך (לא לגעת!) */}
// //       {phase !== "done" && (
// //         <div className="fixed inset-0 z-40 flex">
// //           {Array.from({ length: RECT_COUNT }).map((_, i) => {
// //             const delay = i * DELAY_BETWEEN_RECTS;
// //             const translate =
// //               phase === "enter"
// //                 ? "translate-y-0"
// //                 : phase === "exit"
// //                 ? "-translate-y-full"
// //                 : "";
// //             return (
// //               <div
// //                 key={i}
// //                 className={`
// //                    flex-1 h-full bg-white
// //                    transform
// //                    transition-transform
// //                    duration-[${ANIMATION_DURATION}ms]
// //                    ${translate}
// //                  `}
// //                 style={{ transitionDelay: `${delay}ms` }}
// //               />
// //             );
// //           })}
// //         </div>
// //       )}

// //       {/* תוכן האתר */}
// //       <div
// //         className={`relative z-0 transition-opacity duration-700 ${
// //           phase === "enter" ? "opacity-0" : "opacity-100"
// //         }`}
// //       >
// //         {children}
// //       </div>
// //     </>
// //   );
// // }
// // CoverAnimation.tsx
// import React, { useEffect, useState } from "react";

// const RECT_COUNT = 6;
// const ANIMATION_DURATION_MS = 700; // הגדרת משך האנימציה במילישניות
// const DELAY_BETWEEN_RECTS_MS = 150; // הגדרת הדיליי בין ריבועים במילישניות

// export default function CoverAnimation({
//   children,
// }: {
//   children?: React.ReactNode;
// }) {
//   const [phase, setPhase] = useState("enter");
//   const [animationDone, setAnimationDone] = useState(false);

//   useEffect(() => {
//     // זמן סיום אנימציית ה"כניסה" של הלוגו והריבועים
//     const enterPhaseEndTime =
//       ANIMATION_DURATION_MS + DELAY_BETWEEN_RECTS_MS * (RECT_COUNT - 1);

//     // זמן סיום אנימציית ה"יציאה" של הריבועים (הם יורדים למטה)
//     const exitPhaseEndTime = enterPhaseEndTime + ANIMATION_DURATION_MS;

//     // מעבר מ-"enter" ל-"exit"
//     const timeout1 = setTimeout(() => {
//       setPhase("exit");
//     }, enterPhaseEndTime);

//     // מעבר מ-"exit" ל-"done" (הסתרת הריבועים והצגת התוכן)
//     const timeout2 = setTimeout(() => {
//       setPhase("done");
//       setAnimationDone(true); // עכשיו התוכן יכול להיות גלוי
//     }, exitPhaseEndTime);

//     return () => {
//       clearTimeout(timeout1);
//       clearTimeout(timeout2);
//     };
//   }, []);

//   return (
//     <>
//       {/* Loader שלב ENTER בלבד */}
//       {phase === "enter" && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center bg-white overflow-hidden">
//           {/* הוספתי overflow-hidden למניעת גלילה אם הלוגו קופץ מחוץ לתחום */}
//           <div className="absolute left-1/2 top-1/3 transform -translate-x-1/2 -translate-y-1/2 min-h-[30vh] text-gray-500 dark:text-gray-300 mt-8">
//             <img
//               src="/logo-without bg.png"
//               className="h-52 sm:h-28 animate-bounce mb-3 mt-40"
//               alt="טוען..."
//             />
//           </div>
//         </div>
//       )}

//       {/* מלבנים הראשיים שלך */}
//       {/* חשוב: הריבועים צריכים להיות קיימים ב-DOM גם בשלב "enter" וגם בשלב "exit" */}
//       {phase !== "done" && (
//         <div className="fixed inset-0 z-40 flex overflow-hidden">
//           {/* הוספתי overflow-hidden כאן כדי לוודא שהריבועים יכולים לצאת מהמסך בלי להיחתך */}
//           {Array.from({ length: RECT_COUNT }).map((_, i) => {
//             const delay = i * DELAY_BETWEEN_RECTS_MS;
//             const translateClass =
//               phase === "enter"
//                 ? "translate-y-0"
//                 : phase === "exit"
//                 ? "-translate-y-full" // זה מה שאמור להזיז אותם למעלה
//                 : ""; // בשלב "done" הם כבר לא מוצגים

//             return (
//               <div
//                 key={i}
//                 className={`
//                     flex-1 h-full bg-white
//                     transform
//                     transition-transform
//                     duration-[${ANIMATION_DURATION_MS}ms]
//                     ${translateClass}
//                   `}
//                 style={{ transitionDelay: `${delay}ms` }}
//               />
//             );
//           })}
//         </div>
//       )}

//       {/* תוכן האתר (מוצג רק כשהאנימציה הסתיימה) */}
//       {animationDone && (
//         <div className="relative z-0">
//           {/* אין צורך ב-transition-opacity כאן, כי אנחנו שולטים בזה ע"י הרינדור המותנה */}
//           {children}
//         </div>
//       )}
//     </>
//   );
// }

import React, { useEffect, useState } from "react";

const RECT_COUNT = 6;

const ANIMATION_DURATION = 700;

const DELAY_BETWEEN_RECTS = 150;

export default function CoverAnimation({
  children,
}: {
  children?: React.ReactNode;
}) {
  const [phase, setPhase] = useState("enter");

  useEffect(() => {
    const enterTime =
      DELAY_BETWEEN_RECTS * (RECT_COUNT - 1);

    const exitTime = ANIMATION_DURATION + enterTime + 1000;

    const timeout1 = setTimeout(() => setPhase("exit"), enterTime);

    const timeout2 = setTimeout(() => setPhase("done"), exitTime);

    return () => {
      clearTimeout(timeout1);

      clearTimeout(timeout2);
    };
  }, []);

  return (
    <>
      {/* Loader שלב ENTER בלבד */}
      {phase === "enter" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-white max-w-full">
          <div className="absolute left-1/2 top-1/3 transform -translate-x-1/2 -translate-y-1/2 min-h-[30vh] text-gray-500 dark:text-gray-300 mt-8">
            <img
              src="/logo-without bg.png"
              className="h-52 sm:h-28 animate-bounce mb-3 mt-40"
              alt="טוען..."
            />
          </div>
        </div>
      )}
      {/* מלבנים הראשיים שלך (לא לגעת!) */}
      {phase !== "done" && (
        <div className="fixed inset-0 z-40 flex max-w-full">
          {Array.from({ length: RECT_COUNT }).map((_, i) => {
            const delay = i * DELAY_BETWEEN_RECTS;

            const translate =
              phase === "enter"
                ? "translate-y-0"
                : phase === "exit"
                ? "-translate-y-full"
                : "";

            return (
              <div
                key={i}
                className={`
                  flex-1 h-full bg-white
                  transform
                  transition-transform
                  duration-[${ANIMATION_DURATION}ms]
                  ${translate}
                `}
                style={{ transitionDelay: `${delay}ms` }}
              />
            );
          })}{" "}
        </div>
      )}

      <div
        className={`relative z-0 transition-opacity duration-700 ${
          phase === "enter" ? "opacity-0" : "opacity-100"
        }`}
      >
        {children}
      </div>
    </>
  );
}
