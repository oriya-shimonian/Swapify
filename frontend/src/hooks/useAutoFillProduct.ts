// hooks/useAutoFillProduct.ts
import { useState } from "react";
import axios from "axios";
import { autoFillRoutes } from "@/settings";

export function useAutoFillProduct() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function autoFill(productName: string) {
console.log("useAutoFillProduct hook initialized");
    
    setLoading(true);
    setError(null);

    try {
        console.log("Auto-filling product with name:", productName);
        
      const { data } = await axios.post(autoFillRoutes.autoFillProduct , { productName });
      return data.autofill;
    } catch (err: any) {
      setError("שגיאה במילוי האוטומטי");
      return null;
    } finally {
      setLoading(false);
    }
  }

  return { autoFill, loading, error };
}
