import { useRef, useState, useEffect } from "react";
import imageCompression from "browser-image-compression";
import { Camera } from "lucide-react";
import { toast } from "react-hot-toast";

interface Props {
  onSelect: (imageData: string) => void;
  initialImage?: string;
}

export default function ImageUploader({ onSelect, initialImage }: Props) {
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
      <div className="relative w-56 h-56">
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
