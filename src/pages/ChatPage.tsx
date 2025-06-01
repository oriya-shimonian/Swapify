// 📁 pages/ChatPage.tsx
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import ChatRoom from "@/components/chat/ChatRoom";
import { useStartChat } from "@/hooks/useStartChat";

export default function ChatPage() {
  const [params] = useSearchParams();
  const exchangeRequestId = Number(params.get("exchangeRequestId"));

  const [chatId, setChatId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  const { startChat } = useStartChat();

  useEffect(() => {
    if (!exchangeRequestId || chatId) return;

    const fetchOrCreateChat = async () => {
      console.log(
        "🔍 Fetching or creating chat for request ID:",
        exchangeRequestId
      );
      try {
        const chat = await startChat(exchangeRequestId);
        if (chat?.chat_id) {
          console.log("✅ Chat fetched/created:", chat);
          setChatId(chat.chat_id);
        } else {
          console.warn("⚠️ No chat returned from startChat");
        }
      } catch (err) {
        console.error("❌ Failed to start chat", err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrCreateChat();
  }, [exchangeRequestId, chatId]);

  return (
    <div className="p-4 max-w-3xl mx-auto mt-[4.5rem]">
      {!exchangeRequestId && (
        <div className="text-center mt-10">❌ שגיאה: לא נשלח מזהה בקשה</div>
      )}
      {loading && <div className="text-center mt-10">⌛ טוען צ'אט...</div>}
      {!chatId ? (
        <div className="text-center mt-10">⚠️ לא נמצא צ'אט מתאים</div>
      ) : (
        <>
          <h1 className="text-xl font-bold mb-4">צ'אט החלפה</h1>
          <ChatRoom chatId={chatId} />
        </>
      )}
    </div>
  );
}
