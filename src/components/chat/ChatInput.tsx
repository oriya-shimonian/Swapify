// 📁 components/Chat/ChatInput.tsx
import { useState } from "react";
import { FiSend } from "react-icons/fi";

export default function ChatInput({ onSend }: { onSend: (text: string) => void }) {
  const [text, setText] = useState("");

  const handleSend = () => {
    if (text.trim()) {
      onSend(text);
      setText("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex items-center gap-2">
      <textarea
        className="flex-1 resize-none border rounded-lg px-3 py-2 text-sm focus:outline-none"
        rows={1}
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="הקלד הודעה..."
      />
      <button
        onClick={handleSend}
        className="text-blue-600 hover:text-blue-800 transition"
        aria-label="שלח הודעה"
      >
        <FiSend size={20} />
      </button>
    </div>
  );
}
