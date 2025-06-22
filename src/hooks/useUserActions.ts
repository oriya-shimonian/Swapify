import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { userRoutes } from "@/settings";
import { useAuth } from "@/context/AuthContext"; // כדי להתממשק עם המשתמש המחובר

export const useUserActions = () => {
  const { login, user } = useAuth(); // להשתמש ב-login אם רוצים להתחבר אחרי הרשמה
  const [loading, setLoading] = useState(false);

  const createUser = async (
    username: string,
    email: string,
    password: string,
    notificationEnabled: boolean,
    locations: string[]
  ) => {
    setLoading(true);
    try {
      const response = await axios.post(userRoutes.createUser, {
        username,
        email,
        password,
        notificationEnabled,
        locations,
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

  // ❗ ב־useUserActions.ts
  const getAllUsers = async () => {
    if (user && user.role_name === "Admin") {
      try {
        const res = await axios.get(userRoutes.getAllUsers, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        return res.data;
      } catch (error: any) {
        toast.error("שגיאה בקבלת רשימת המשתמשים");
        return [];
      }
    }
  };

  const deleteUser = async (userId: number) => {
    if (user && user.role_name === "Admin") {
      try {
        await axios.delete(userRoutes.deleteUser(userId), {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        toast.success("המשתמש נמחק בהצלחה");
      } catch (error: any) {
        toast.error("שגיאה במחיקת המשתמש");
      }
    }
  };

  const banUser = async (userId: number) => {
    console.log(localStorage.getItem("token"), "espreso");
    
    if (user && user.role_name === "Admin") {
      try {
        const res = await axios.put(userRoutes.banUser(userId), {}, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        const updated = res.data.user;

      toast.success(
        updated.is_banned
          ? "המשתמש נחסם בהצלחה"
          : "חסימת המשתמש בוטלה בהצלחה"
      );
        return res.data
      } catch (error: any) {
        toast.error("שגיאה בחסימת המשתמש");
      }
    }
  };

  const deleteUsers = async (userIds: number[]) => {
    try {
      await axios.delete(userRoutes.deleteUsers, {
        data: { userIds },
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      toast.success("המשתמשים נמחקו");
    } catch (error: any) {
      toast.error("שגיאה במחיקת המשתמשים");
    }
  };

  const banUsers = async (userIds: number[]) => {
    try {
      const res = await axios.put(userRoutes.banUsers, { userIds }, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      toast.success("סטטוס המשתמשים עודכן");
      return res.data;
    } catch (error: any) {
      toast.error("שגיאה בעדכון סטטוס המשתמשים");
    }
  };

  const updateUserRole = async (userId: number, newRoleId: number) => {
    try {
      await axios.put(userRoutes.updateUserRole(userId), { newRoleId }, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
      toast.success("הרול עודכן בהצלחה");
    } catch (error: any) {
      toast.error("שגיאה בעדכון הרול");
    }
  };


  return {
    createUser,
    getUserById,
    updateUser,
    getAllUsers,
    deleteUser,
    banUser,
    deleteUsers,
    banUsers,
    updateUserRole,
    loading,
  };
};
