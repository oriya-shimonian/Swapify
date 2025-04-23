import AppDialog from "@/components/AppDialog";
import { IProduct, ProductCategory } from "@/types/products";
import { useState } from "react";


type Props = {
  dialogProps: {
    open: boolean;
    loading: boolean;
    filteredProducts: IProduct[];
    selectedIds: number[];
    categoryFilter: string;
    subcategoryFilter: string;
    setCategoryFilter: (val: string) => void;
    setSubcategoryFilter: (val: string) => void;
    toggleSelect: (id: number) => void;
    setOpen: (val: boolean) => void;
    setSelectedIds: (ids: number[]) => void;
    handleSubmit: () => void;
  };
};

export default function ExchangeRequestDialog({ dialogProps }: Props) {
  const {
    open,
    loading,
    filteredProducts,
    selectedIds,
    categoryFilter,
    subcategoryFilter,
    setCategoryFilter,
    setSubcategoryFilter,
    toggleSelect,
    setOpen,
    setSelectedIds,
    handleSubmit,
  } = dialogProps;

  const [searchTerm, setSearchTerm] = useState("");

  const searchFiltered = filteredProducts.filter((p) =>
    p.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <AppDialog
      open={open}
      title="הגש בקשת החלפה"
      confirmText="שלח בקשה"
      cancelText="ביטול"
      confirmVariant="default"
      onCancel={() => {
        setOpen(false);
        setSelectedIds([]);
      }}
      onConfirm={handleSubmit}
      loading={loading}
    >
      <div className="mb-4 text-sm text-gray-600 dark:text-gray-300">
        ניתן לבחור עד <strong>4 מוצרים</strong> להחלפה.<br />
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
            <option key={cat} value={cat}>{cat}</option>
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

      <div className="max-h-64 overflow-y-auto space-y-2 mt-3">
        {searchFiltered.map((p) => {
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
                <strong>{p.title}</strong> – {p.category} / {p.subcategory}
              </div>
              {isSelected && <span className="text-blue-500 font-bold">✓</span>}
            </div>
          );
        })}

        {searchFiltered.length === 0 && (
          <p className="text-sm text-gray-500">אין מוצרים מתאימים להצגה</p>
        )}
      </div>

      {selectedIds.length >= 4 && (
        <div className="mt-2 text-xs text-red-500">
          ניתן לבחור עד 4 מוצרים בלבד.
        </div>
      )}
    </AppDialog>
  );
}
