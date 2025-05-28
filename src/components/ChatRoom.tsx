import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { IMessage } from "@/types/chat";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { messageRoutes } from "@/settings";

export default function ChatRoom() {
  const { chatId } = useParams();
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const { data } = await axios.get(messageRoutes.getMessages(Number(chatId)), {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        setMessages(data);
      } catch (err) {
        console.error("Failed to fetch messages", err);
      } finally {
        setLoading(false);
      }
    };
    fetchMessages();
  }, [chatId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if (!newMessage.trim()) return;
    try {
      const { data } = await axios.post(
        messageRoutes.sendMessage,
        {
          chat_id: Number(chatId),
          content: newMessage,
        },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      setMessages((prev) => [...prev, data]);
      setNewMessage("");
    } catch (err) {
      console.error("Failed to send message", err);
    }
  };

  return (
    <div className="flex flex-col h-[80vh] border rounded-lg overflow-hidden">
      <div className="flex-1 overflow-y-auto p-4 space-y-2 bg-background">
        {loading ? (
          <div>טוען הודעות...</div>
        ) : (
          messages.map((msg) => (
            <div
              key={msg.id}
              className={`max-w-[70%] p-2 rounded-md text-sm shadow ${
                msg.is_own ? "bg-primary text-white ml-auto" : "bg-muted"
              }`}
            >
              {msg.content}
            </div>
          ))
        )}
        <div ref={bottomRef} />
      </div>
      <div className="border-t p-2 flex gap-2">
        <Input
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="הקלד הודעה..."
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
        />
        <Button onClick={handleSend}>שלח</Button>
      </div>
    </div>
  );
}
