// // import { useRef, useState } from "react";
// // import { Camera } from "lucide-react"; // אייקון מצלמה

// // type Props = {
// //   onSelect: (imageData: string) => void;
// //   initialImage?: string;
// // };

// // export default function ImageUploader({ onSelect, initialImage }: Props) {
// //   const [preview, setPreview] = useState<string | null>(initialImage || null);
// //   const inputRef = useRef<HTMLInputElement>(null);

// //   const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
// //     const file = e.target.files?.[0];
// //     if (!file) return;

// //     const reader = new FileReader();
// //     reader.onloadend = () => {
// //       const base64 = reader.result as string;
// //       setPreview(base64);
// //       onSelect(base64);
// //     };
// //     reader.readAsDataURL(file);
// //   };

// //   const handleClick = () => {
// //     inputRef.current?.click();
// //   };

// //   return (
// //     <div className="relative w-56 h-56">
// //       <input
// //         type="file"
// //         accept="image/*"
// //         ref={inputRef}
// //         onChange={handleFileChange}
// //         className="hidden"
// //       />

// //       <div
// //         onClick={handleClick}
// //         className="w-full h-full cursor-pointer border border-dashed border-gray-400 rounded-md overflow-hidden relative hover:bg-gray-100 transition"
// //       >
// //         {preview ? (
// //           <img
// //             src={preview}
// //             alt="תצוגה מקדימה"
// //             className="w-64 h-64 object-fit"
// //           />
// //         ) : (
// //           <div className="w-full h-full flex items-center justify-center text-gray-500 flex-col">
// //             <Camera size={40} />
// //             <span className="text-sm mt-2">העלה תמונה</span>
// //           </div>
// //         )}
// //       </div>

// //       {/* כפתור עגול בפינה התחתונה-ימנית */}
// //       <button
// //         type="button"
// //         onClick={handleClick}
// //         className="absolute bottom-2 left-2 bg-white shadow-md border rounded-full p-2 hover:bg-gray-100 transition"
// //         aria-label="בחר תמונה"
// //       >
// //         <Camera size={20} />
// //       </button>
// //     </div>
// //   );
// // }

// import { useRef, useState, useEffect } from "react";
// import imageCompression from "browser-image-compression";
// import { Camera } from "lucide-react";
// import { toast } from "react-hot-toast";

// interface Props {
//   onSelect: (imageData: string) => void;
//   initialImage?: string;
// }

// export default function ImageUploader({ onSelect, initialImage }: Props) {
//   const [preview, setPreview] = useState<string | null>(initialImage || null);
//   const [isDragging, setIsDragging] = useState(false);
//   const inputRef = useRef<HTMLInputElement>(null);

//   useEffect(() => {
//     if (initialImage) setPreview(initialImage);
//   }, [initialImage]);

//   // הדבקת תמונות מה-clipboard
//   useEffect(() => {
//     const handlePaste = async (e: ClipboardEvent) => {
//       const items = e.clipboardData?.items;
//       if (!items) return;

//       for (const item of items) {
//         if (item.type.startsWith("image/")) {
//           const file = item.getAsFile();
//           if (file) return readAndSetImage(file);
//         }
//         if (item.type === "text/plain") {
//           const text = await new Promise<string>((resolve) =>
//             item.getAsString(resolve)
//           );
//           if (
//             text.startsWith("http") &&
//             /\.(jpg|jpeg|png|webp|gif)$/.test(text)
//           ) {
//             try {
//               const base64 = await convertImageUrlToBase64(text);
//               setPreview(base64);
//               onSelect(base64);
//               toast.success("התמונה הודבקה בהצלחה");
//             } catch {
//               toast.error("לא ניתן להדביק את התמונה");
//             }
//           }
//         }
//       }
//     };
//     window.addEventListener("paste", handlePaste);
//     return () => window.removeEventListener("paste", handlePaste);
//   }, []);

//   const readAndSetImage = async (file: File) => {
//     try {
//       const options = {
//         maxSizeMB: 0.95, // כמעט 1MB אבל לא עובר אותו
//         maxWidthOrHeight: 1200, // שומר על פרופורציה
//         useWebWorker: true,
//       };

//       const compressedFile = await imageCompression(file, options);
//       const base64 = await imageCompression.getDataUrlFromFile(compressedFile);

//       setPreview(base64);
//       onSelect(base64);
//     } catch (error) {
//       console.error("שגיאה בהמרת תמונה:", error);
//       toast.error("שגיאה בהעלאת התמונה");
//     }
//   };

//   const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (file) readAndSetImage(file);
//   };

//   const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
//     e.preventDefault();
//     setIsDragging(false);
//     const file = e.dataTransfer.files[0];
//     if (file && file.type.startsWith("image/")) {
//       readAndSetImage(file);
//     }
//   };

//   const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
//     e.preventDefault();
//   };

//   const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
//     e.preventDefault();
//     setIsDragging(true);
//   };

//   const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
//     e.preventDefault();
//     setIsDragging(false);
//   };

//   const handleClick = () => {
//     inputRef.current?.click();
//   };

//   const convertImageUrlToBase64 = async (url: string): Promise<string> => {
//     const response = await fetch(url);
//     const blob = await response.blob();

//     return await new Promise((resolve, reject) => {
//       const reader = new FileReader();
//       reader.onloadend = () => resolve(reader.result as string);
//       reader.onerror = reject;
//       reader.readAsDataURL(blob);
//     });
//   };

//   return (
//     <div className="flex flex-col gap-3">
//       <div className="relative w-56 h-56">
//         <input
//           type="file"
//           accept="image/*"
//           ref={inputRef}
//           onChange={handleFileChange}
//           className="hidden"
//         />

//         <div
//           onClick={handleClick}
//           onDrop={handleDrop}
//           onDragOver={handleDragOver}
//           onDragEnter={handleDragEnter}
//           onDragLeave={handleDragLeave}
//           className={`w-full h-full cursor-pointer border rounded-md overflow-hidden relative flex items-center justify-center transition
//             ${
//               isDragging
//                 ? "border-blue-500 bg-blue-50 border-2"
//                 : "border-dashed border-gray-400 hover:bg-gray-100"
//             }`}
//         >
//           {preview ? (
//             <img
//               src={preview}
//               alt="תצוגה מקדימה"
//               className="w-full h-full object-fit"
//             />
//           ) : (
//             <div className="text-gray-500 flex flex-col items-center text-center">
//               <Camera size={40} />
//               <span className="text-sm mt-2">
//                 גרור/י, הדבק/י או לחץ/י לבחירת תמונה
//               </span>
//             </div>
//           )}
//         </div>

//         <button
//           type="button"
//           onClick={handleClick}
//           className="absolute bottom-2 left-2 bg-white shadow-md border rounded-full p-2 hover:bg-gray-100 transition"
//           aria-label="בחר תמונה"
//         >
//           <Camera size={20} />
//         </button>
//       </div>
//     </div>
//   );
// }


import { useRef, useState, useEffect } from "react";
import imageCompression from "browser-image-compression";
import { Camera } from "lucide-react";
import { toast } from "react-hot-toast";
import { Button } from "./ui/button";

interface Props {
  onSelect: (imageData: string) => void;
  initialImage?: string;
  design?: string; 
}

export default function ImageUploader({ onSelect, initialImage, design }: Props) {
  const [preview, setPreview] = useState<string | null>(initialImage || null);
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (initialImage) setPreview(initialImage);
  }, [initialImage]);

  // ✅ הדבקת תמונה מה־clipboard
  useEffect(() => {
    const handlePaste = async (e: ClipboardEvent) => {
      const items = e.clipboardData?.items;
      if (!items) return;

      for (const item of items) {
        if (item.type.startsWith("image/")) {
          const file = item.getAsFile();
          if (file) {
            await readAndSetImage(file); // ← חשוב
            // toast.success("תמונה הודבקה מהקליפבורד");
            return;
          }
        }
      }
    };

    window.addEventListener("paste", handlePaste);
    return () => window.removeEventListener("paste", handlePaste);
  }, []);

  // ✅ הקטנה חכמה לגודל <1MB
  const compressImage = async (file: File): Promise<string> => {
    const tryCompress = async (maxSizeMB: number): Promise<string> => {
      const options = {
        maxSizeMB,
        maxWidthOrHeight: 1200,
        useWebWorker: true,
      };
      const compressed = await imageCompression(file, options);
      return await imageCompression.getDataUrlFromFile(compressed);
    };

    let base64 = await tryCompress(0.95);
    const sizeKB = Math.ceil((base64.length * 3) / 4 / 1024);

    if (sizeKB > 1000) {
      base64 = await tryCompress(0.6);
    }

    return base64;
  };

  const readAndSetImage = async (file: File) => {
    try {
      const base64 = await compressImage(file);
      setPreview(base64);
      onSelect(base64);
    } catch (error) {
      console.error("❌ שגיאה בהמרת תמונה:", error);
      toast.error("שגיאה בהעלאת התמונה");
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) readAndSetImage(file);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) {
      readAndSetImage(file);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => e.preventDefault();
  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };
  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };
  const handleClick = () => inputRef.current?.click();

  return (
    <div className="flex flex-col gap-3">
      <div className={`relative w-56 h-56 ${design}`}>
        <input
          type="file"
          accept="image/*"
          ref={inputRef}
          onChange={handleFileChange}
          className="hidden"
        />

        <div
          onClick={handleClick}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          className={`w-full h-full cursor-pointer border rounded-md overflow-hidden relative flex items-center justify-center transition
            ${isDragging ? "border-blue-500 bg-blue-50 border-2" : "border-dashed border-gray-400 hover:bg-gray-100"}`}
        >
          {preview ? (
            <img
              src={preview}
              alt="תצוגה מקדימה"
              className="w-full h-full object-fit"
            />
          ) : (
            <div className="text-gray-500 flex flex-col items-center text-center">
              <Camera size={40} />
              <span className="text-sm mt-2">
                גרור/י, הדבק/י או לחץ/י לבחירת תמונה
              </span>
            </div>
          )}
        </div>

        <button
          type="button"
          onClick={handleClick}
          className="absolute bottom-2 left-2 bg-white shadow-md border rounded-full p-2 hover:bg-gray-100 transition"
          aria-label="בחר תמונה"
        >
          <Camera size={20} />
        </button>
      </div>
    </div>
  );
}
