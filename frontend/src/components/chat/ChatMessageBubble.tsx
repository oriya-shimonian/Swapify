import { IMessage } from "@/types/chat";

export default function ChatMessageBubble({
  message,
  isOwn,
}: {
  message: IMessage;
  isOwn: boolean;
}) {
  return (
    <div className={`flex ${isOwn ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-xs px-4 py-2 rounded-xl text-sm shadow ${
          isOwn
            ? "bg-blue-500 text-white rounded-br-none"
            : "bg-gray-200 text-gray-900 rounded-bl-none"
        }`}
      >
        <p>{message.content}</p>
        <div className="text-[10px] text-gray-500 mt-1 text-end rtl:text-start">
          {new Date(message.created_at).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </div>
      </div>
    </div>
  );
}
