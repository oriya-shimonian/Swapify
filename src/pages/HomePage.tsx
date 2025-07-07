import { useState, useEffect, useMemo } from "react";
import { useAuth } from "@/context/AuthContext";
import useProducts from "@/hooks/useProducts";
import { useInfiniteScroll } from "@/hooks/useInfiniteScroll";
import ProductCard from "@/components/ProductCard";
import { SkeletonProductCard } from "@/components/skelton/SkeletonProductCard";
import { homePageFields } from "@/lib/filters/homePageFilters";
import { Filters } from "@/components/UserDashboard/exchangeTabsHelpers/Filters";
import { DateRangePicker } from "@/components/DateRangePicker";
import { defaultProductFilters, ProductCategory, ProductFilters } from "@/types/products";
import { extraFieldsByCategory } from "@/lib/filters/extraFieldsByCategory";

export default function HomePage() {
  const { products, loading, loadingNextPage, hasMore, fetchProducts } =
    useProducts();
  const { user } = useAuth();
  const [page, setPage] = useState(0);

const [filters, setFilters] = useState<ProductFilters>(defaultProductFilters);


  useEffect(() => {
    fetchProducts(page, filters, true);
  }, [page, filters]);

  const bottomRef = useInfiniteScroll({
    isFetching: loadingNextPage,
    hasMore,
    onLoadMore: () => setPage((prev) => prev + 1),
  });

  // const selectedCategory = filters.category as ProductCategory | null;

  // const extendedFields = selectedCategory
  //   ? [...homePageFields(user), ...(extraFieldsByCategory[selectedCategory] || [])]
  //   : homePageFields(user);
  const selectedCategory = filters.category as ProductCategory | null;

const extendedFields = useMemo(() => {
  return selectedCategory
    ? [...homePageFields(user), ...(extraFieldsByCategory[selectedCategory] || [])]
    : homePageFields(user);
}, [selectedCategory, user]);


  return (
    <div className="container mx-auto px-4 py-6 mt-[4.5rem]">
      <h1 className="text-3xl font-bold text-center mb-6">גלה והחלף פריטים</h1>
      {/* <AddProductButton /> */}

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8 pb-0">
        <div className="flex flex-wrap gap-4 items-end">
          <div className="flex-1 min-w-[200px]">
            <Filters
              filters={filters}
              setFilters={setFilters}
              resetPage={() => setPage(0)}
              fields={extendedFields}
              design="w-full"
            />
          </div>

          <div className="min-w-[200px] self-baseline">
            <DateRangePicker
              fromDate={filters.fromDate ?? ""}
              toDate={filters.toDate ?? ""}
              onChange={(from, to) =>
                setFilters((prev) => ({ ...prev, fromDate: from, toDate: to }))
              }
            />
          </div>
        </div>
      </div>

      {loading && products.length === 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 min-w-full">
          {Array.from({ length: 6 }).map((_, i) => (
            <SkeletonProductCard key={i} />
          ))}
        </div>
      ) : (
        <div className="min-w-full">
          {products.length === 0 && !loading && (
            <div className="text-center text-gray-500 font-medium mt-8">
              לא נמצאו פריטים מתאימים לסינון שבחרת 🎯
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 min-w-full">
            {products.map((product) => {
              // const isOwner = user?.user_id === product.user_id;
              return (
                <ProductCard
                  key={product.product_id}
                  product={product}

                />
              );
            })}

            {hasMore && (
              <div ref={bottomRef} className="h-10 w-full col-span-full" />
            )}

            {loadingNextPage && (
              <div className="flex justify-center col-span-full py-4">
                <div className="animate-spin rounded-full h-6 w-6 border-2 border-t-transparent border-blue-500" />
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
// TODO filter by dates do not working!!!
