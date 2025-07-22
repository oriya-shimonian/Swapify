import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
type AppDialogProps = {
  open: boolean;
  title: string;
  description?: string | React.ReactNode;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
  confirmVariant?: "default" | "destructive" | "outline";
  cancelVariant?: "ghost" | "outline" | "secondary";
  loading?: boolean;
  confirmDisabled?: boolean; // ✨ חדש
  children?: React.ReactNode;
};

export default function AppDialog({
  open,
  title,
  description,
  confirmText = "אישור",
  cancelText = "ביטול",
  onConfirm,
  onCancel,
  confirmVariant = "default",
  cancelVariant = "ghost",
  loading = false,
  confirmDisabled = false, // ✨ חדש
  children,
}: AppDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onCancel}>
      <DialogContent className="sm:max-w-md bg-white dark:bg-gray-800 dark:text-white">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          {description && <DialogDescription>{description}</DialogDescription>}
        </DialogHeader>

        {children && <div className="py-2">{children}</div>}

        <DialogFooter className="flex justify-end gap-2">
          <Button variant={cancelVariant} onClick={onCancel} disabled={loading}>
            {cancelText}
          </Button>
          <Button
            variant={confirmVariant}
            onClick={onConfirm}
            disabled={loading || confirmDisabled}
          >
            {loading ? "טוען..." : confirmText}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
