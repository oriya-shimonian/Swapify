// import { boardGameRoutes, bookRoutes, productRoutes, puzzleRoutes } from "@/settings";
// import { IProduct, ProductCategory } from "@/types/products";
// import axios from "axios";
// import { useState, useEffect } from "react";

// interface CreateProductPayload {
//   category: ProductCategory;
//   data: any;
// }

// interface UpdateProductPayload {
//   category: ProductCategory;
//   id: string;
//   data: any;
// }

// interface DeleteProductPayload {
//   category: ProductCategory;
//   id: string;
// }

// const useProducts = () => {
//   const [products, setProducts] = useState<IProduct[]>([]);
//   const [loading, setLoading] = useState<boolean>(true);
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     const fetchProducts = async () => {
//       try {
//         const response = await fetch(productRoutes.getAllProducts);
//         if (!response.ok) {
//           throw new Error("Failed to fetch products");
//         }
//         const data = await response.json();
//         setProducts(data);
//       } catch (err) {
//         setError(err instanceof Error ? err.message : "An unknown error occurred");
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchProducts();
//   }, []);

//   const getRoutesByCategory = (category: ProductCategory) => {
//     switch (category) {
//       case "Book":
//         return bookRoutes;
//       case "Puzzle":
//         return puzzleRoutes;
//       case "Board Game":
//         return boardGameRoutes;
//       default:
//         throw new Error("Unsupported category");
//     }
//   };

//   const addProduct = async ({ category, data }: CreateProductPayload) => {
//     const routes = getRoutesByCategory(category);
//       // @ts-ignore

//    console.log("routes", routes, category, `create${category.replace(/\s/g, '')}`, routes[`create${category.replace(/\s/g, '')}`]);

//     try {
//       setLoading(true);
//       // @ts-ignore
//       const res = await axios.post(routes[`create${category.replace(/\s/g, '')}`], data);
//       setProducts((prev) => [...prev, res.data]);
//       if(res.data?.error) {
//         setError(res.data.error);
//         throw new Error(res.data.error);
//       }

//       return res.data;
//     } catch (err: any) {
//       setError(err?.response?.data?.error || "Failed to create product");
//       throw err;
//     } finally {
//       setLoading(false);
//     }
//   };

//   const updateProduct = async ({ category, id, data }: UpdateProductPayload) => {
//     const routes = getRoutesByCategory(category);
//     try {
//       setLoading(true);
//       // @ts-ignore
//       const res = await axios.put(routes[`update${category.replace(/\s/g, '')}`](id), data ,{ headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } });
//       setProducts((prev) =>
//         prev.map((p) => (p.product_id === Number(id) ? { ...p, ...res.data } : p))
//       );
//       return res.data;
//     } catch (err: any) {
//       setError(err?.response?.data?.error || "Failed to update product");
//       throw err;
//     } finally {
//       setLoading(false);
//     }
//   };

//   const deleteProduct = async ({ category, id }: DeleteProductPayload) => {
//     console.log("deleteProduct", category, id);

//     const routes = getRoutesByCategory(category);
//     console.log("deleteProduct", category, id);
//     try {
//       setLoading(true);
//       // @ts-ignore
//       const res = await axios.delete(routes[`delete${category.replace(/\s/g, '')}`](id), { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } });
//       setProducts((prev) => prev.filter((p) => p.product_id !== Number(id)));
//       return res.data
//     } catch (err: any) {
//       setError(err?.response?.data?.error || "Failed to delete product");
//       throw err;
//     } finally {
//       setLoading(false);
//     }
//   };

//   const fetchOfferableProducts = async (userId: number): Promise<IProduct[]> => {
//     try {
//       const res = await axios.get(productRoutes.getOfferableProducts(userId), {
//         headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
//       });

//       return res.data;
//     } catch (err: any) {
//       console.error(err);
//       throw new Error(err?.response?.data?.error || "שגיאה בטעינת מוצרים להצעה");
//     }
//   };

//   const fetchUserProducts = async (userId: number): Promise<IProduct[]> => {
//     try {
//       const res = await axios.get(productRoutes.getProductsByUser(userId), {
//         headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
//       });
//       return res.data;
//     } catch (err: any) {
//       console.error(err);
//       throw new Error(err?.response?.data?.error || "שגיאה בטעינת מוצרים של המשתמש");
//     }
//   };

//   return { products, loading, error, addProduct, updateProduct, deleteProduct, fetchOfferableProducts, fetchUserProducts };
// };

// export default useProducts;

// 📁 hooks/useProducts.ts
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
  UpdateProductPayload,
} from "@/types/products";

const useProducts = () => {
  const [products, setProducts] = useState<IProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [loadingNextPage, setLoadingNextPage] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const fetchProducts = useCallback(
    async (
      page: number,
      filters?: {
        search?: string;
        category?: string | null;
        subcategory?: string | null;
        location?: string | null;
        fromDate?: string;
        toDate?: string;
        availability?: string | null;
        // שדות דינמיים
        author: string;
        publisher: string;
        publish_year: string;
        manufacturer: string;
        piecesCount: string;
        min_players: string;
        max_players: string;
        duration: string;
      },
      excludeMyProducts?: boolean
    ) => {
      const offset = page * NUM_PRODUCTS_IN_PAGE;
      setLoadingNextPage(true);

      try {
        // בניית הפרמטרים ל־URL
        const params = new URLSearchParams();
        params.append("limit", String(NUM_PRODUCTS_IN_PAGE));
        params.append("offset", String(offset));
        if (excludeMyProducts) params.append("excludeMyProducts", "true");
        if (filters?.availability) params.append("availability", filters.availability);
        if (filters?.search) params.append("search", filters.search);
        if (filters?.category) params.append("category", filters.category);
        if (filters?.subcategory)
          params.append("subcategory", filters.subcategory);
        if (filters?.location) params.append("location", filters.location);
        if (filters?.fromDate) params.append("from", filters.fromDate);
        if (filters?.toDate) params.append("to", filters.toDate);
        if (filters?.author) params.append("author", filters.author);
        if (filters?.publisher) params.append("publisher", filters.publisher);
        if (filters?.publish_year)
          params.append("publish_year", filters.publish_year);
        if (filters?.manufacturer)
          params.append("manufacturer", filters.manufacturer);
        if (filters?.piecesCount)
          params.append("piecesCount", filters.piecesCount);
        if (filters?.min_players)
          params.append("min_players", filters.min_players);
        if (filters?.max_players)
          params.append("max_players", filters.max_players);
        if (filters?.duration) params.append("duration", filters.duration);

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
      params.append("limit", String(limit));
      params.append("offset", String(offset));

      if (filters?.search) params.append("search", filters.search);
      if (filters?.category) params.append("category", filters.category);
      if (filters?.subcategory)
        params.append("subcategory", filters.subcategory);
      if (filters?.condition) params.append("condition", filters.condition);
      if (filters?.availability)
        params.append("availability", filters.availability);
      if (filters?.fromDate) params.append("from", filters.fromDate);
      if (filters?.toDate) params.append("to", filters.toDate);

      // const response = await axios.get(
      //   productRoutes.getProductsByUser(userId, limit, offset) +
      //     `&${params.toString()}`,
      //   {
      //     headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      //   }
      // );
      // return response.data;
      return new Promise((resolve, reject) => {})
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
  };
};

export default useProducts;
