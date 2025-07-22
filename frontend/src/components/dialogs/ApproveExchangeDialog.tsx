import { useState } from "react";
import AppDialog from "@/components/AppDialog";
import { IExchangeRequest, IOfferedProductPreview } from "@/types/exchangeRequest";

type Props = {
  open: boolean;
  onClose: () => void;
  onApprove: (chosenProductId: number) => void;
  request: IExchangeRequest;
};

export default function ApproveExchangeDialog({
  open,
  onClose,
  onApprove,
  request,
}: Props) {
  const [selectedId, setSelectedId] = useState<number | null>(null);

  const handleSelect = (id: number) => {
    setSelectedId(id);
  };

  const handleConfirm = () => {
    if (selectedId) {
      onApprove(selectedId);
      handleClose();
    }
  };

  const handleClose = () => {
    setSelectedId(null);
    onClose();
  };

  return (
    <AppDialog
      open={open}
      onCancel={handleClose}
      onConfirm={handleConfirm}
      confirmText="אשר החלפה"
      cancelText="ביטול"
      confirmVariant="default"
      cancelVariant="ghost"
      title="בחר מוצר להחלפה"
      loading={false}
    >
      <div className="text-sm text-gray-600 dark:text-gray-300 mb-3">
        יש לבחור <strong>מוצר אחד</strong> מבין המוצעים:
      </div>

      <div className="space-y-2 max-h-64 overflow-y-auto">
        {request.offered_products.map((p: IOfferedProductPreview) => {
          const isSelected = selectedId === p.product_id;

          return (
            <div
              key={p.product_id}
              className={`flex items-center justify-between border rounded p-2 cursor-pointer transition ${
                isSelected
                  ? "border-green-500 bg-green-50 dark:bg-green-900"
                  : "hover:bg-gray-100 dark:hover:bg-gray-700"
              }`}
              onClick={() => handleSelect(p.product_id)}
            >
              <div>
                <strong>{p.title}</strong> – {p.category} / {p.subcategory}
              </div>
              {isSelected && <span className="text-green-600 font-bold">✓</span>}
            </div>
          );
        })}

        {request.offered_products.length === 0 && (
          <p className="text-sm text-gray-500">לא הוצעו מוצרים להחלפה</p>
        )}
      </div>
    </AppDialog>
  );
}
