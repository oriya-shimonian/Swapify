import { useEffect, useState } from "react";
import { IProduct } from "@/types/products";
import useProducts from "@/hooks/useProducts";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import ProductCard from "@/components/ProductCard";
import AppDialog from "@/components/AppDialog";
import toast from "react-hot-toast";
import { GoTrash } from "react-icons/go";
import { FaEdit } from "react-icons/fa";

export default function MyProductsTab() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const {
    loading,
    deleteProduct,
    fetchUserProducts, // ← נוסיף את הפונקציה הזו אם אין עדיין
  } = useProducts();

  const [myProducts, setMyProducts] = useState<IProduct[]>([]);
  const [selectedToDelete, setSelectedToDelete] = useState<IProduct | null>(
    null
  );
  const [loadingDelete, setLoadingDelete] = useState(false);

  useEffect(() => {
    if (!user?.user_id) return;
    fetchUserProducts(user.user_id)
      .then(setMyProducts)
      .catch(() => toast.error("שגיאה בטעינת המוצרים שלי"));
  }, [user?.user_id]);

  const handleDelete = async () => {
    if (!selectedToDelete) return;
    try {
      setLoadingDelete(true);
      await deleteProduct({
        category: selectedToDelete.category,
        id: String(selectedToDelete.product_id),
      });
      setMyProducts((prev) =>
        prev.filter((p) => p.product_id !== selectedToDelete.product_id)
      );
      toast.success("המוצר נמחק בהצלחה");
    } catch {
      toast.error("שגיאה במחיקת המוצר");
    } finally {
      setLoadingDelete(false);
      setSelectedToDelete(null);
    }
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">המוצרים שלי</h1>
        <Button onClick={() => navigate("/add-product")}>הוסף מוצר חדש</Button>
      </div>

      {loading ? (
        <p>טוען...</p>
      ) : myProducts.length === 0 ? (
        <p className="text-gray-500">אין לך עדיין מוצרים.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {myProducts.map((product) => (
            <ProductCard
              key={product.product_id}
              product={product}
              actionButtons={
                <>
                  <FaEdit
                    className="text-blue-600 cursor-pointer"
                    size={18}
                    title="ערוך"
                    onClick={() =>
                      navigate(`/edit-product/${product.product_id}`)
                    }
                  />
                  <GoTrash
                    className="text-red-600 cursor-pointer"
                    size={18}
                    title="מחק"
                    onClick={() => setSelectedToDelete(product)}
                  />
                </>
              }
            />
          ))}
        </div>
      )}

      <AppDialog
        open={!!selectedToDelete}
        title="מחיקת מוצר"
        description={`המוצר "${selectedToDelete?.title}" יימחק לצמיתות. להמשיך?`}
        confirmText="מחק"
        cancelText="בטל"
        confirmVariant="destructive"
        onConfirm={handleDelete}
        onCancel={() => setSelectedToDelete(null)}
        loading={loadingDelete}
      />
    </div>
  );
}