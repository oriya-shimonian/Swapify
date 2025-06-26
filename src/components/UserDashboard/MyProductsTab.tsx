import { useEffect, useState } from "react";
import { IProduct, NUM_PRODUCTS_IN_PAGE } from "@/types/products";
import useProducts from "@/hooks/useProducts";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import ProductCard from "@/components/ProductCard";
import AppDialog from "@/components/AppDialog";
import toast from "react-hot-toast";
import { GoTrash } from "react-icons/go";
import { FaEdit } from "react-icons/fa";
import { SkeletonProductCard } from "../skelton/SkeletonProductCard";
import { useInfiniteScroll } from "@/hooks/useInfiniteScroll";
import { Filters } from "./exchangeTabsHelpers/Filters";
import { filterFieldsMyProductsTab } from "@/lib/filters/myProductsTabFilters";
import { DateRangePicker } from "../DateRangePicker";

export default function MyProductsTab() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { deleteProduct, fetchUserProducts } = useProducts();

  const [myProducts, setMyProducts] = useState<IProduct[]>([]);
  const [selectedToDelete, setSelectedToDelete] = useState<IProduct | null>(null);
  const [loadingDelete, setLoadingDelete] = useState(false);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [loadingNextPage, setLoadingNextPage] = useState(false);

  const [filters, setFilters] = useState({
    search: "",
    category: null,
    subcategory: null,
    condition: null,
    availability: null,
    fromDate: "",
    toDate: "",
  });

  const bottomRef = useInfiniteScroll({
    isFetching: loadingNextPage,
    hasMore,
    onLoadMore: () => setPage((prev) => prev + 1),
  });

  // טוען דף ראשון מחדש בכל שינוי פילטרים
  useEffect(() => {
    if (!user?.user_id) return;

    setLoadingNextPage(true);
    setPage(0);
    fetchUserProducts(user.user_id, NUM_PRODUCTS_IN_PAGE, 0, filters)
      .then((newData) => {
        setMyProducts(newData);
        setHasMore(newData.length === NUM_PRODUCTS_IN_PAGE);
      })
      .catch(() => toast.error("שגיאה בטעינת המוצרים שלי"))
      .finally(() => setLoadingNextPage(false));
  }, [user?.user_id, filters]);

  // טוען עמודים נוספים (אחרי עמוד ראשון)
  useEffect(() => {
    if (!user?.user_id || page === 0) return;

    setLoadingNextPage(true);
    fetchUserProducts(user.user_id, NUM_PRODUCTS_IN_PAGE, page * NUM_PRODUCTS_IN_PAGE, filters)
      .then((newData) => {
        setMyProducts((prev) => {
          const existingIds = new Set(prev.map((p) => p.product_id));
          const uniqueNew = newData.filter((p) => !existingIds.has(p.product_id));
          return [...prev, ...uniqueNew];
        });
        if (newData.length < NUM_PRODUCTS_IN_PAGE) {
          setHasMore(false);
        }
      })
      .catch(() => toast.error("שגיאה בטעינת המוצרים שלי"))
      .finally(() => setLoadingNextPage(false));
  }, [user?.user_id, page]);

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

      <Filters
        filters={filters}
        setFilters={setFilters}
        resetPage={() => setPage(0)}
        fields={filterFieldsMyProductsTab}
      />

      <div className="mb-4 w-full sm:w-auto">
        <DateRangePicker
          fromDate={filters.fromDate}
          toDate={filters.toDate}
          onChange={(from, to) =>
            setFilters((prev) => ({
              ...prev,
              fromDate: from,
              toDate: to,
            }))
          }
        />
      </div>

      {(loadingNextPage && page === 0) ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 min-w-full">
          {Array.from({ length: 6 }).map((_, i) => (
            <SkeletonProductCard key={i} />
          ))}
        </div>
      ) : myProducts.length === 0 ? (
        <p className="text-gray-500">לא נמצאו מוצרים התואמים לחיפוש.</p>
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
                    onClick={() => navigate(`/edit-product/${product.product_id}`)}
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
          {hasMore && <div ref={bottomRef} className="h-10 col-span-full" />}
          {loadingNextPage && page > 0 && (
            <div className="flex justify-center col-span-full py-4">
              <div className="animate-spin rounded-full h-6 w-6 border-2 border-t-transparent border-blue-500" />
            </div>
          )}
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
