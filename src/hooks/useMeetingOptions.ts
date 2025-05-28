import { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { meetingOptionsRoutes } from "@/settings";
import { MeetingOption } from "@/types/chat";

export const useMeetingOptions = () => {
  const [options, setOptions] = useState<MeetingOption[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchOptions = async () => {
    setLoading(true);
    try {
      const res = await axios.get(meetingOptionsRoutes.getAllAdmin, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setOptions(res.data);
    } catch (err: any) {
      setError(err?.response?.data?.error || "שגיאה בעת טעינת המיקומים");
    } finally {
      setLoading(false);
    }
  };

  const createOption = async (data: Omit<MeetingOption, "id" | "is_active">) => {
    try {
      const res = await axios.post(meetingOptionsRoutes.create, data, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setOptions((prev) => [...prev, res.data]);
      toast.success("המיקום נוסף בהצלחה");
    } catch (err: any) {
      toast.error(err?.response?.data?.error || "שגיאה בהוספת מיקום");
    }
  };

  const updateOption = async (id: number, data: Partial<MeetingOption>) => {
    try {
      const res = await axios.put(meetingOptionsRoutes.update(id), data, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setOptions((prev) =>
        prev.map((opt) => (opt.id === id ? res.data : opt))
      );
      toast.success("המיקום עודכן בהצלחה");
    } catch (err: any) {
      toast.error(err?.response?.data?.error || "שגיאה בעדכון מיקום");
    }
  };

  const deleteOption = async (id: number) => {
    try {
      await axios.delete(meetingOptionsRoutes.delete(id), {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setOptions((prev) => prev.filter((opt) => opt.id !== id));
      toast.success("המיקום נמחק");
    } catch (err: any) {
      toast.error(err?.response?.data?.error || "שגיאה במחיקת מיקום");
    }
  };

  useEffect(() => {
    fetchOptions();
  }, []);

  return {
    options,
    loading,
    error,
    fetchOptions,
    createOption,
    updateOption,
    deleteOption,
  };
};
