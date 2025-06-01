// 📁 components/Chat/ChatRoom.tsx
import { useEffect, useRef } from "react";
import { useAuth } from "@/context/AuthContext";
import { useChatMessages } from "@/hooks/useChatMessages";
import ChatMessageBubble from "./ChatMessageBubble";
import ChatInput from "./ChatInput";

export default function ChatRoom({ chatId }: { chatId: number }) {
  const { user } = useAuth();
  const { messages, sendMessage, loading } = useChatMessages(chatId);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="flex flex-col h-[80vh] border rounded-xl overflow-hidden shadow-md">
      <div className="flex-1 overflow-y-auto p-4 space-y-2 bg-muted">
        {loading ? (
          <div>טוען הודעות...</div>
        ) : (
          messages.map((msg) => (
            <ChatMessageBubble
              key={msg.message_id}
              message={msg}
              isOwn={msg.sender_id === user?.user_id}
            />
          ))
        )}
        <div ref={bottomRef} />
      </div>
      <div className="border-t bg-white dark:bg-gray-900 p-3">
        <ChatInput onSend={(text) => sendMessage({ senderId: user?.user_id!, content: text, type: "text" })} />
      </div>
    </div>
  );
}
