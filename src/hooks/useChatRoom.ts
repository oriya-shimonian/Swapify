// ✅ useChatRoom.ts – Hook לטיפול בצ'אט בודד כולל טעינת הודעות ושליחה
import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import {   chatRoutes, messageRoutes } from "@/settings";
import { IChat, IMessage } from "@/types/chat";
import { getSocket } from "@/lib/socket";

export function useChatRoom(chatId: number, userId: number | null) {
  const [chat, setChat] = useState<IChat | null>(null);
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);

  // ✅ טעינת הצ'אט וההודעות בתחילה
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [chatRes, msgRes] = await Promise.all([
          axios.get<IChat>(chatRoutes.getById(chatId)),
          axios.get<IMessage[]>(messagesRoutes.getAll(chatId)),
        ]);
        setChat(chatRes.data);
        setMessages(msgRes.data);
      } catch (error) {
        console.error("Failed to fetch chat data", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [chatId]);

  // ✅ שליחת הודעה
  const sendMessage = useCallback(async () => {
    if (!newMessage.trim() || !userId) return;
    try {
      const res = await axios.post<IMessage>(messagesRoutes.create, {
        chat_id: chatId,
        sender_id: userId,
        content: newMessage,
      });
      setMessages((prev) => [...prev, res.data]);
      setNewMessage("");

      // שידור ב-Socket (אם נדרש)
      const socket = getSocket();
      socket?.emit("new_message", res.data);
    } catch (error) {
      console.error("Failed to send message", error);
    }
  }, [chatId, newMessage, userId]);

  // ✅ קבלת הודעה חדשה ב-socket
  useEffect(() => {
    const socket = getSocket();
    if (!socket) return;

    const handleIncomingMessage = (msg: IMessage) => {
      if (msg.chat_id === chatId) {
        setMessages((prev) => [...prev, msg]);
      }
    };

    socket.on("new_message", handleIncomingMessage);
    return () => {
      socket.off("new_message", handleIncomingMessage);
    };
  }, [chatId]);

  return {
    chat,
    messages,
    newMessage,
    setNewMessage,
    sendMessage,
    loading,
  };
}
