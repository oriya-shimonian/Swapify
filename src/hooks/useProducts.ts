import { boardGameRoutes, bookRoutes, productRoutes, puzzleRoutes } from "@/settings";
import { IProduct, ProductCategory } from "@/types/products";
import axios from "axios";
import { useState, useEffect } from "react";

interface CreateProductPayload {
  category: ProductCategory;
  data: any;
}

interface UpdateProductPayload {
  category: ProductCategory;
  id: string;
  data: any;
}

interface DeleteProductPayload {
  category: ProductCategory;
  id: string;
}

const useProducts = () => {
  const [products, setProducts] = useState<IProduct[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(productRoutes.getAllProducts);
        if (!response.ok) {
          throw new Error("Failed to fetch products");
        }
        const data = await response.json();
        setProducts(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An unknown error occurred");
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);


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
      // @ts-ignore

   console.log("routes", routes, category, `create${category.replace(/\s/g, '')}`, routes[`create${category.replace(/\s/g, '')}`]);
   
    try {
      setLoading(true);
      // @ts-ignore
      const res = await axios.post(routes[`create${category.replace(/\s/g, '')}`], data);
      setProducts((prev) => [...prev, res.data]);
      if(res.data?.error) {
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

  const updateProduct = async ({ category, id, data }: UpdateProductPayload) => {
    const routes = getRoutesByCategory(category);
    try {
      setLoading(true);
      // @ts-ignore
      const res = await axios.put(routes[`update${category.replace(/\s/g, '')}`](id), data);
      setProducts((prev) =>
        prev.map((p) => (p.product_id === Number(id) ? { ...p, ...res.data } : p))
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
    const routes = getRoutesByCategory(category);
    try {
      setLoading(true);
      // @ts-ignore
      await axios.delete(routes[`delete${category.replace(/\s/g, '')}`](id));
      setProducts((prev) => prev.filter((p) => p.product_id !== Number(id)));
    } catch (err: any) {
      setError(err?.response?.data?.error || "Failed to delete product");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { products, loading, error, addProduct, updateProduct, deleteProduct };
};

export default useProducts;
