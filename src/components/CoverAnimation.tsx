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
    const enterTime = DELAY_BETWEEN_RECTS * (RECT_COUNT - 1);

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
                   
                  ${translate}
                `}
                style={{
                  transitionDuration: `${ANIMATION_DURATION}ms`,
                  transitionDelay: `${delay}ms`,
                }}
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




//                 // duration- הפרדה שזה יתקמפל בלי אזהרות כי זה כולה הערה שאנחנו כנראה נצטרך[${ANIMATION_DURATION}ms]