import { Dialog, DialogContent, DialogClose } from "@/components/ui/dialog";
import { X } from "lucide-react";
import { motion } from "framer-motion";

interface ImageDialogProps {
  imageUrl: string;
  onClose: () => void;
}

export default function ImageDialog({ imageUrl, onClose }: ImageDialogProps) {
  return (
    <Dialog open={!!imageUrl} onOpenChange={onClose}>
      <DialogContent
        className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 
        bg-black/80 p-4 rounded-lg shadow-lg max-w-[90vw] max-h-[90vh] flex items-center justify-center"
      >
        {/* כפתור X */}
        <DialogClose asChild>
          <button className="absolute top-4 right-4 text-white hover:text-gray-300 transition">
            <X size={24} />
          </button>
        </DialogClose>

        {/* תמונה מונפשת */}
        <motion.img
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          transition={{ duration: 0.3 }}
          src={imageUrl}
          alt="תמונה מוגדלת"
          className="object-contain w-full h-full rounded-md"
        />
      </DialogContent>
    </Dialog>
  );
}
