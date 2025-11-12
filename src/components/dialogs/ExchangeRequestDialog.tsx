import { useEffect, useState } from "react";
import { BoardGameSubcategory, BookSubcategory, getProductCategoryLabel, getSubcategoryLabel, IProduct, ProductCategory, PuzzleSubcategory } from "@/types/products";
import { useExchangeRequest } from "@/hooks/useExchangeRequest";
import { useAuth } from "@/context/AuthContext";
import AppDialog from "@/components/AppDialog";
import useProducts from "@/hooks/useProducts";
import toast from "react-hot-toast";

interface Props {
  open: boolean;
  productId: number;
  mode?: "create" | "edit";
  initialSelectedIds?: number[];
  onClose: () => void;
  onSuccess?: () => void;
  onEditConfirm?: (newSelectedIds: number[]) => void;
}

export default function ExchangeRequestDialog({
  open,
  productId,
  mode = "create",
  initialSelectedIds = [],
  onClose,
  onSuccess,
  onEditConfirm,
}: Props) {
  const { user } = useAuth();
  const { fetchOfferableProducts } = useProducts();
  const { createRequest, loading, error } = useExchangeRequest();
  const [hasPartialOverlap, setHasPartialOverlap] = useState(false);
  const [offerableProducts, setOfferableProducts] = useState<IProduct[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [selectedIds, setSelectedIds] = useState<number[]>(initialSelectedIds);
  const [categoryFilter, setCategoryFilter] = useState("");
  const [subcategoryFilter, setSubcategoryFilter] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    if (!user?.user_id || !open) return;
    setLoadingProducts(true);
    fetchOfferableProducts(user.user_id)
      .then(setOfferableProducts)
      .catch(() => toast.error("שגיאה בטעינת מוצרים להצעה"))
      .finally(() => setLoadingProducts(false));
      console.log("Offerable products fetched:", offerableProducts);
      
  }, [user?.user_id, open]);

  useEffect(() => {
    if (open && initialSelectedIds.length > 0) {
      setSelectedIds(initialSelectedIds);
    }
  }, [initialSelectedIds, open]);

  const toggleSelect = (id: number) => {
    setSelectedIds((prev) =>
      prev.includes(id)
        ? prev.filter((pid) => pid !== id)
        : [...prev, id].slice(0, 4)
    );
  };

const handleSubmit = async () => {
  if (mode === "edit") {
    if (onEditConfirm) onEditConfirm(selectedIds);
    handleClose();
    return;
  }

  if (!user || selectedIds.length === 0 || selectedIds.length > 4) return;

  // אם יש חפיפה – רק מראה הודעה ולא שולח עדיין
  if (!hasPartialOverlap) {
    try {
      const response = await createRequest({
        userId: user.user_id,
        userName: user.name,
        productId,
        offeredProductIds: selectedIds,
      });

      if (response.hasPartialOverlap) {
        setHasPartialOverlap(true);
        return; // מחכים ללחיצה שנייה
      } else {
        onSuccess?.();
        handleClose();
      }
    } catch {
      // error כבר מטופל ב-hook
    }
  } else {
    // לחיצה שנייה אחרי שהוזהר
    try {
      const response = await createRequest({
        userId: user.user_id,
        userName: user.name,
        productId,
        offeredProductIds: selectedIds,
      });
      onSuccess?.();
      handleClose();
    } catch {
      // error כבר מטופל
    }
  }
};


  const handleClose = () => {
    onClose();
    setSelectedIds([]);
    setCategoryFilter("");
    setSubcategoryFilter("");
    setSearchTerm("");
    setHasPartialOverlap(false);
  };

  const filtered = offerableProducts.filter((p) => {
    return (
      (!categoryFilter || p.category === categoryFilter) &&
      (!subcategoryFilter ||
        p.subcategory
          ?.toLowerCase()
          .includes(subcategoryFilter.toLowerCase())) &&
      p.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const hasChanges =
    JSON.stringify(initialSelectedIds.sort()) !==
    JSON.stringify(selectedIds.sort());
  const confirmDisabled =
    (mode === "edit" && !hasChanges) ||
    selectedIds.length === 0 ||
    selectedIds.length > 4 || !!error;

  return (
    <AppDialog
      description="בחר עד 4 מוצרים משלך להציע למשתמש השני"
      open={open}
      title={mode === "edit" ? "ערוך מוצרים מוצעים" : "הגש בקשת החלפה"}
      confirmText={mode === "edit" ? "שמור שינויים" : hasPartialOverlap
    ? "אישור ושליחה בכל זאת" : "שלח בקשה"}
      cancelText="ביטול"
      confirmVariant="default"
      onCancel={handleClose}
      onConfirm={handleSubmit}
      loading={loading || loadingProducts}
      confirmDisabled={confirmDisabled}

    >
      <div className="mb-4 text-sm text-gray-600 dark:text-gray-300">
        ניתן לבחור עד <strong>4 מוצרים</strong> להחלפה.
        <br />
        נבחרו כרגע: <strong>{selectedIds.length}</strong> מתוך 4
      </div>

      <div className="mb-2">
        <label className="font-medium">קטגוריה:</label>
        <select
          className="w-full border p-1 rounded mt-1"
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
        >
          <option value="">הכל</option>
          {Object.values(ProductCategory).map((cat) => (
            <option key={cat} value={cat}>
              {getProductCategoryLabel(cat)}
            </option>
          ))}
        </select>
      </div>

      <div className="mb-2">
        <label className="font-medium">תת־קטגוריה:</label>
        <input
          className="w-full border p-1 rounded mt-1"
          placeholder="למשל: Nature, Strategy"
          value={subcategoryFilter}
          onChange={(e) => setSubcategoryFilter(e.target.value)}
        />
      </div>

      <div className="mb-2">
        <label className="font-medium">חיפוש לפי שם מוצר:</label>
        <input
          className="w-full border p-1 rounded mt-1"
          placeholder="הקלד/י שם מוצר"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="max-h-32 overflow-y-auto space-y-2 mt-3">
        {filtered.map((p) => {
          const isSelected = selectedIds.includes(p.product_id);
          const canSelectMore = selectedIds.length < 4 || isSelected;

          return (
            <div
              key={p.product_id}
              className={`flex items-center justify-between border rounded p-2 cursor-pointer transition ${
                isSelected
                  ? "border-blue-500 bg-blue-50 dark:bg-blue-900"
                  : "hover:bg-gray-100 dark:hover:bg-gray-700"
              } ${!canSelectMore ? "opacity-50 cursor-not-allowed" : ""}`}
              onClick={() => {
                if (canSelectMore) toggleSelect(p.product_id);
              }}
            >
              <div>
                <strong>{p.title}</strong> – {getProductCategoryLabel(p.category)} / {getSubcategoryLabel(p.category, p.subcategory as PuzzleSubcategory | BookSubcategory | BoardGameSubcategory)}
              </div>
              {isSelected && <span className="text-blue-500 font-bold">✓</span>}
            </div>
          );
        })}

        {filtered.length === 0 && !loadingProducts && (
          <p className="text-sm text-gray-500">אין מוצרים מתאימים להצגה</p>
        )}
      </div>

      {selectedIds.length >= 4 && (
        <div className="mt-2 text-xs text-red-500">
          ניתן לבחור עד 4 מוצרים בלבד.
        </div>
      )}
      {/* הודעה פנימית על חפיפה חלקית, עם מקום קבוע למניעת קפיצות */}
      <div className="min-h-[48px] mt-4">
        {hasPartialOverlap && (
          <div className="rounded border border-yellow-300 dark:border-yellow-700 bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-100 px-3 py-2 text-sm">
            ⚠️ שים לב: חלק מהמוצרים שכבר בחרת מופיעים בבקשות קודמות שלך על מוצר
            זה. מומלץ לבדוק אם כבר הגשת בקשה דומה לפני שליחה נוספת.
          </div>
        )}
        {error && <div className="mt-3 text-sm text-red-500">{error}</div>}
      </div>
    </AppDialog>
  );
}
