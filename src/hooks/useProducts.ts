import { useState, useCallback } from "react";
import axios from "axios";
import {
  bookRoutes,
  puzzleRoutes,
  boardGameRoutes,
  productRoutes,
} from "@/settings";
import {
  CreateProductPayload,
  DeleteProductPayload,
  IProduct,
  NUM_PRODUCTS_IN_PAGE,
  ProductCategory,
  ProductFilters,
  UpdateProductPayload,
} from "@/types/products";
import { buildProductQueryParams } from "@/utils/buildProductQueryParams";

const useProducts = () => {
  const [products, setProducts] = useState<IProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [loadingNextPage, setLoadingNextPage] = useState(false);
  const [hasMore, setHasMore] = useState(true);

const fetchProducts = useCallback(
  async (page: number, filters: ProductFilters = {}, excludeMyProducts?: boolean) => {
    const offset = page * NUM_PRODUCTS_IN_PAGE;
    setLoadingNextPage(true);

    try {
      const params = buildProductQueryParams(filters, {
        limit: NUM_PRODUCTS_IN_PAGE,
        offset,
        excludeMyProducts,
      });

      const url = `${productRoutes.getAllProducts()}?${params.toString()}`;
      const token = localStorage.getItem("token");

      const res = await axios.get(url, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });

      const newProducts = res.data;

      if (page === 0 && newProducts.length === 0) {
        setProducts([]);
        setHasMore(false);
      } else {
        setProducts((prev) =>
          page === 0 ? newProducts : [...prev, ...newProducts]
        );
        setHasMore(newProducts.length === NUM_PRODUCTS_IN_PAGE);
      }
    } catch (err: any) {
      console.error("שגיאה בטעינת מוצרים:", err);
      setError(err?.response?.data?.error || "שגיאה בטעינה");
    } finally {
      setLoading(false);
      setLoadingNextPage(false);
    }
  },
  []
);

  const fetchUserProducts = async (
    userId: number,
    limit: number,
    offset: number,
    filters?: {
      search?: string;
      category?: string | null;
      subcategory?: string | null;
      condition?: string | null;
      availability?: string | null;
      fromDate?: string;
      toDate?: string;
    }
  ): Promise<IProduct[]> => {
    try {
      const params = new URLSearchParams();

      if (filters?.search) params.append("search", filters.search);
      if (filters?.category) params.append("category", filters.category);
      if (filters?.subcategory)
        params.append("subcategory", filters.subcategory);
      if (filters?.condition) params.append("condition", filters.condition);
      if (filters?.availability)
        params.append("availability", filters.availability);
      if (filters?.fromDate) params.append("from", filters.fromDate);
      if (filters?.toDate) params.append("to", filters.toDate);

      const response = await axios.get(
        productRoutes.getProductsByUser(userId, limit, offset) +
          `&${params.toString()}`,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      return response.data;
      // return new Promise((resolve, reject) => {})
    } catch (error) {
      console.error("Error fetching user products:", error);
      return [];
    }
  };

  const fetchOfferableProducts = async (
    userId: number
  ): Promise<IProduct[]> => {
    try {
      const res = await axios.get(productRoutes.getOfferableProducts(userId), {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      return res.data;
    } catch (err: any) {
      console.error(err);
      throw new Error(
        err?.response?.data?.error || "שגיאה בטעינת מוצרים להצעה"
      );
    }
  };

  const getRoutesByCategory = (category: ProductCategory) => {
    switch (category) {
      case "Book":
        return bookRoutes;
      case "Puzzle":
        return puzzleRoutes;
      case "Board Game":
        return boardGameRoutes;
      default:
        throw new Error("Unsupported category");
    }
  };

  const fetchAllProductImages = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get(productRoutes.getgetAllProductsImages());
      console.log("Fetched all product images:", res.data);
      return res.data;
    } catch (err: any) {
      const errMsg = err?.response?.data?.error || "שגיאה בטעינת התמונות";
      setError(errMsg);
      console.error(err);
      throw new Error(errMsg);
    } finally {
      setLoading(false);
    }
  };

  const addProduct = async ({ category, data }: CreateProductPayload) => {
    const routes = getRoutesByCategory(category);
    console.log(
      "routes",
      routes,
      category,
      `create${category.replace(/\s/g, "")}`,
    
    );
    try {
      setLoading(true);
      // @ts-ignore
      const res = await axios.post(
        // @ts-ignore
        routes[`create${category.replace(/\s/g, "") as string}`],
        data, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      }
      );
      setProducts((prev) => [...prev, res.data]);
      if (res.data?.error) {
        setError(res.data.error);
        throw new Error(res.data.error);
      }

      return res.data;
    } catch (err: any) {
      setError(err?.response?.data?.error || "Failed to create product");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateProduct = async ({
    category,
    id,
    data,
  }: UpdateProductPayload) => {
    const routes = getRoutesByCategory(category);
    try {
      setLoading(true);
      // @ts-ignore
      const res = await axios.put(
        // @ts-ignore
        routes[`update${category.replace(/\s/g, "")}`](id),
        data,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      setProducts((prev) =>
        prev.map((p) =>
          p.product_id === Number(id) ? { ...p, ...res.data } : p
        )
      );
      return res.data;
    } catch (err: any) {
      setError(err?.response?.data?.error || "Failed to update product");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteProduct = async ({ category, id }: DeleteProductPayload) => {
    console.log("deleteProduct", category, id);

    const routes = getRoutesByCategory(category);
    console.log("deleteProduct", category, id);
    try {
      setLoading(true);
      // @ts-ignore
      const res = await axios.delete(
        // @ts-ignore
        routes[`delete${category.replace(/\s/g, "")}`](id),
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      setProducts((prev) => prev.filter((p) => p.product_id !== Number(id)));
      return res.data;
    } catch (err: any) {
      setError(err?.response?.data?.error || "Failed to delete product");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    products,
    loading,
    loadingNextPage,
    hasMore,
    error,
    fetchProducts,
    addProduct,
    updateProduct,
    deleteProduct,
    fetchOfferableProducts,
    fetchUserProducts,
    fetchAllProductImages
  };
};

export default useProducts;
