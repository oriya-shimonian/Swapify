import useProducts from "@/hooks/useProducts";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AppButton from "../Buttons/AppButton";

const PinterestGallery: React.FC = () => {
  const { fetchAllProductImages } = useProducts();
  const [images, setImages] = useState<{ image_url: string }[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const load = async () => {
      try {
        const result = await fetchAllProductImages();
        setImages(result.slice(0, 30)); // יותר גמיש כאן
      } catch (err) {
        console.error("❌ Error loading images:", err);
      }
    };

    load();
  }, []);

  return (
    // <div className="relative px-6 py-10 bg-gray-950 text-white">
    //   <h2 className="text-2xl sm:text-3xl font-bold text-center mb-6">
    //     הצצה לכמה מהמוצרים שלנו
    //   </h2>

    //   {/* masonry עם columns
    //   <div className="columns-2 sm:columns-3 md:columns-4 gap-4 max-w-screen-xl mx-auto space-y-4">
    //     {images.map((img, i) => (
    //       <img
    //         key={i}
    //         src={img.image_url}
    //         alt={`item-${i}`}
    //         className="w-full mb-4 rounded-xl object-contain break-inside-avoid transition-transform duration-300 hover:scale-[1.03]"
    //       />
    //     ))}
    //   </div> */}

    //   <div className="relative max-w-screen-xl mx-auto">
    //     <div className="columns-2 sm:columns-3 md:columns-4 gap-4 space-y-4">
    //       {images.slice(0, 28).map((img, i) => (
    //         <img
    //           key={i}
    //           src={img.image_url}
    //           alt={`item-${i}`}
    //           className="w-full max-h-[300px] object-contain rounded-xl break-inside-avoid transition-transform duration-300 hover:scale-[1.03]"
    //         />
    //       ))}
    //     </div>

    //     {/* כיסוי תחתון כדי לסיים את ה"גל" */}
    //     <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-gray-950 to-transparent pointer-events-none z-10" />
    //   </div>

    //   {/* Blur לקצה התחתון */}
    //   <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-gray-950 to-transparent pointer-events-none" />

    //   <div className="flex justify-center mt-8">
    //     <AppButton
    //       onClick={() => navigate("/all-products")}
    //     >
    //       לצפייה בכל המוצרים
    //     </AppButton>
    //   </div>
    // </div>
    <div className="relative px-6 py-10 bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
      <h2 className="text-2xl sm:text-3xl font-bold text-center mb-6">
        הצצה לכמה מהמוצרים שלנו
      </h2>

      <div className="relative max-w-screen-xl mx-auto">
        <div className="columns-2 sm:columns-3 md:columns-4 gap-4 space-y-4">
          {images.slice(0, 28).map((img, i) => (
            <img
              key={i}
              src={img.image_url}
              alt={`item-${i}`}
              className="w-full max-h-[300px] object-contain rounded-xl break-inside-avoid transition-transform duration-300 hover:scale-[1.03]"
            />
          ))}
        </div>

        {/* BLUR תחתון */}
        <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-white dark:from-gray-900 to-transparent pointer-events-none z-10" />
      </div>

      <div className="flex justify-center mt-8">
        <AppButton onClick={() => navigate("/all-products")}>
          לצפייה בכל המוצרים
        </AppButton>
      </div>
    </div>
  );
};

export default PinterestGallery;
