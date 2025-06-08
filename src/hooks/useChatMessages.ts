import { useState, useEffect } from "react";
import axios from "axios";
import { IMessage } from "@/types/chat";
import { messageRoutes } from "@/settings";
import { useAuth } from "@/context/AuthContext";
import { getSocket } from "@/lib/socket";

export function useChatMessages(chatId: number) {
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  // טעינת ההודעות מהשרת
  const fetchMessages = async () => {
    try {
      setLoading(true);
      const res = await axios.get(messageRoutes.getMessages(chatId), {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setMessages(res.data);
    } catch (err) {
      console.error(err);
      setError("שגיאה בטעינת ההודעות");
    } finally {
      setLoading(false);
    }
  };

  // שליחת הודעה – נותנת ל־Socket לעדכן את ה־UI
  const sendMessage = async (data: {
    senderId: number;
    content: string;
    type?: "text" | "system";
  }) => {
    const payload = { ...data, type: data.type || "text" };
    await axios.post(messageRoutes.sendMessage(chatId), payload, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
  };

  // סימון כהודעה שנקראה
  const markAsRead = async (messageId: number) => {
    try {
      await axios.post(messageRoutes.markMessageAsRead(messageId));
      setMessages((prev) =>
        prev.map((msg) =>
          msg.message_id === messageId
            ? { ...msg, read_at: new Date().toISOString() }
            : msg
        )
      );
    } catch (err) {
      console.error("סימון כנקראה נכשל", err);
    }
  };

  useEffect(() => {
    if (!chatId || !user?.user_id) return;

    fetchMessages();

    const socket = getSocket();
    if (!socket) return;

    // הצטרפות לצ'אט
    socket.emit("join_chat", { userId: user.user_id, chatId });

    const handleNewMessage = (message: IMessage) => {
      if (message.chat_id === chatId) {
        setMessages((prev) => {
          const alreadyExists = prev.some(
            (msg) => msg.message_id === message.message_id
          );
          if (!alreadyExists) {
            return [...prev, message];
          }
          return prev;
        });
      }
    };

    socket.on("new_message", handleNewMessage);

    return () => {
      socket.emit("leave_chat", user.user_id);
      socket.off("new_message", handleNewMessage);
    };
  }, [chatId, user?.user_id]);

  return {
    messages,
    loading,
    error,
    sendMessage,
    markAsRead,
    refetch: fetchMessages,
  };
}
