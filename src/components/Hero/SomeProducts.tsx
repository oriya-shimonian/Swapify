import React from "react";
import ImageInfinityCaruselStrip from "./ImageInfinityCaruselStrip";



// הקומפוננטה הראשית שמציגה את שלושת הקרוסלות
const SomeProducts: React.FC = () => {
  return (
    <main className="h-screen flex flex-col items-center bg-white dark:bg-gray-900 dark:text-gray-300 text-center pb-8">
      {/* <ImageInfinityCaruselStrip direction="left"/> */}
      {/* <ImageInfinityCaruselStrip direction="right"/>
      <ImageInfinityCaruselStrip direction="left"/> */}

      <h1 className="text-black dark:text-white text-4xl font-bold mb-8">
        SomeProducts
      </h1>
      <h3>To Be Continue...</h3>
      
    </main>
  );
};

export default SomeProducts;
