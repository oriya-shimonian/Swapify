import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { userRoutes } from "@/settings";
import { useAuth } from "@/context/AuthContext"; // כדי להתממשק עם המשתמש המחובר

export const useUserActions = () => {
  const { login } = useAuth(); // להשתמש ב-login אם רוצים להתחבר אחרי הרשמה
  const [loading, setLoading] = useState(false);

  const createUser = async (username: string, email: string, password: string, notificationEnabled: boolean, locations: string[]) => {
    setLoading(true);
    try {
      const response = await axios.post(userRoutes.createUser, {
        username,
        email,
        password,
        notificationEnabled,
        locations
      });

      await login(email, password);
    } catch (error: any) {
      toast.error("הרשמה נכשלה, נסה שנית");
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // 📌 פונקציה לקבלת משתמש לפי ID
  const getUserById = async (userId: string) => {
    try {
      const response = await axios.get(`/api/users/${userId}`);
      return response.data;
    } catch (error: any) {
      toast.error("שגיאה בשליפת משתמש");
      return null;
    }
  };

  // 📌 פונקציה לעדכון משתמש
  const updateUser = async (userId: string, data: any) => {
    try {
      const response = await axios.put(`/api/users/${userId}`, data);
      toast.success("הפרופיל עודכן בהצלחה!");
      return response.data;
    } catch (error: any) {
      toast.error("עדכון נכשל");
      return null;
    }
  };

  return { createUser, getUserById, updateUser, loading };
};
