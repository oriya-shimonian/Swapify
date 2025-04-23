import { useState, useCallback } from "react";
import axios from "axios";
import { IProduct } from "@/types/products";
import { useAuth } from "@/context/AuthContext";
import toast from "react-hot-toast";
import { exchangeRequestRoutes, productRoutes } from "@/settings";

export function useExchangeRequestDialog() {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState<IProduct[]>([]);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [categoryFilter, setCategoryFilter] = useState<string>("");
  const [subcategoryFilter, setSubcategoryFilter] = useState<string>("");
  const [targetProductId, setTargetProductId] = useState<number | null>(null);

  const openDialog = useCallback(async (productId: number) => {
    setTargetProductId(productId);
    setOpen(true);
    console.log(user?.user_id, "User ID fd"); // בדוק אם ה־user_id קיים
    
    try {
      console.log(productRoutes.getOfferableProducts(user?.user_id!), "User ID"); // בדוק אם ה־user_id קיים
      
      const res = await axios.get(productRoutes.getOfferableProducts(user?.user_id!), {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setProducts(res.data);
    } catch (err) {
      toast.error("שגיאה בטעינת מוצרים להצעה");
    }
  }, [user?.user_id]);

  const toggleSelect = (id: number) => {
    setSelectedIds((prev) =>
      prev.includes(id)
        ? prev.filter((pid) => pid !== id)
        : prev.length < 4
        ? [...prev, id]
        : prev
    );
  };

  const handleSubmit = async () => {
    if (!targetProductId || selectedIds.length === 0) {
      toast.error("יש לבחור לפחות מוצר אחד");
      return;
    }
    setLoading(true);
    try {
      await axios.post(exchangeRequestRoutes.createExchangeRequest, {
        userId: user?.user_id,
        productId: targetProductId,
        offeredProductIds: selectedIds,
        userName: user?.name,
      });
      toast.success("הבקשה נשלחה בהצלחה");
      setOpen(false);
      setSelectedIds([]);
    } catch (err) {
      toast.error("שגיאה בשליחת הבקשה");
    } finally {
      setLoading(false);
    }
  };

  const filteredProducts = products.filter(
    (p) =>
      (!categoryFilter || p.category === categoryFilter) &&
      (!subcategoryFilter || p.subcategory === subcategoryFilter)
  );

  return {
    openDialog,
    dialogProps: {
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
    },
  };
}
