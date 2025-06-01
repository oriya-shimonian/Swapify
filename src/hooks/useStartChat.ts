// 📁 hooks/useStartChat.ts
import { useState } from "react";
import axios from "axios";
import { chatRoutes } from "@/settings";
import { IChat } from "@/types/chat";

export function useStartChat() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const startChat = async (exchangeRequestId: number): Promise<IChat | null> => {
    setLoading(true);
    setError(null);
    try {
      // 🟢 ננסה קודם לשלוף צ׳אט קיים
      try {
        const existingRes = await axios.get(chatRoutes.getChatByExchangeRequestId(exchangeRequestId), {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        console.log("🔍 Found existing chat:", existingRes.data);
        if (existingRes.data) return existingRes.data;
      } catch (err: any) {
        if (err.response?.status !== 404) {
          throw err; // רק 404 זה תקין – שאר השגיאות מייד ל־catch
        }
        // אם זה 404 – נמשיך ל־POST
      }

      // 🛠️ לא נמצא צ׳אט – ניצור חדש
      const createRes = await axios.post(chatRoutes.createChat,
        { exchangeRequestId },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      return createRes.data;
    } catch (err: any) {
      console.error("❌ Failed to start chat", err);
      setError(err.response?.data?.error || "שגיאה בלתי צפויה");
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { startChat, loading, error };
}
