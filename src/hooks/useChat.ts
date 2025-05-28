// 📁 hooks/useChat.ts
import { useState, useEffect } from "react";
import axios from "axios";
import { IChat } from "@/types/chat";
import { chatRoutes } from "@/settings";

export function useChat() {
  const [chats, setChats] = useState<IChat[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchChats = async () => {
    try {
      const { data } = await axios.get(chatRoutes.getUserChats, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setChats(data);
    } catch (err) {
      console.error("Failed to load chats", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchChats();
  }, []);

  return { chats, loading, fetchChats };
}
