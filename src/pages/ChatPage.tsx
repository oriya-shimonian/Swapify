// import { useRef, useEffect, useState } from "react";
// import { useChat } from "@/hooks/useChat";
// import { IMessage } from "@/types/chat";
// import { cn } from "@/lib/utils";
// import { MeetingSuggestionDialog } from "@/components/MeetingSuggestionDialog";

// export function ChatWindow({ chatId, userId }: { chatId: number; userId: number }) {
//   const { messages, loading, hasMore, loadMore, sendMessage } = useChat(chatId, userId);
//   const scrollRef = useRef<HTMLDivElement>(null);
//   const bottomRef = useRef<HTMLDivElement>(null);
//   const [lastReadMessageId, setLastReadMessageId] = useState<number | null>(null);
//   const [dialogOpen, setDialogOpen] = useState(false);

//   useEffect(() => {
//     bottomRef.current?.scrollIntoView({ behavior: "smooth" });
//   }, [messages.length]);

//   useEffect(() => {
//     if (messages.length > 0 && lastReadMessageId === null) {
//       setLastReadMessageId(messages[messages.length - 1].message_id);
//     }
//   }, [messages]);

//   const handleSend = async (e: React.FormEvent<HTMLFormElement>) => {
//     e.preventDefault();
//     const input = e.currentTarget.elements.namedItem("message") as HTMLInputElement;
//     const content = input.value.trim();
//     if (!content) return;
//     await sendMessage("text", content);
//     input.value = "";
//   };

//   const handleSendMeeting = async (meetingOptionId: number) => {
//     await sendMessage("location_suggestion", undefined, meetingOptionId);
//     setDialogOpen(false);
//   };

//   return (
//     <div className="flex flex-col h-full border rounded-lg overflow-hidden">
//       <div
//         className="flex-1 overflow-y-auto px-4 py-2 space-y-2 flex flex-col-reverse"
//         onScroll={(e) => {
//           const el = e.currentTarget;
//           if (el.scrollTop === el.scrollHeight - el.clientHeight && hasMore) {
//             loadMore();
//           }
//         }}
//         ref={scrollRef}
//         dir="rtl"
//       >
//         <div ref={bottomRef} />

//         {(loading || hasMore) && (
//           <div className="flex flex-col gap-2 mt-4">
//             {[...Array(3)].map((_, idx) => (
//               <div
//                 key={idx}
//                 className="h-5 w-1/2 bg-gray-300 animate-pulse rounded self-start"
//               />
//             ))}
//           </div>
//         )}

//         {messages
//           .slice()
//           .reverse()
//           .map((msg, i, arr) => {
//             const isNew = lastReadMessageId !== null && msg.message_id > lastReadMessageId;
//             const isFirstNew =
//               isNew &&
//               (i === 0 || (arr[i - 1] && arr[i - 1].message_id <= lastReadMessageId!));

//             return (
//               <div key={msg.message_id} className="flex flex-col">
//                 {isFirstNew && (
//                   <div className="text-center text-xs text-gray-500 my-2">
//                     ── הודעות חדשות ──
//                   </div>
//                 )}
//                 <div
//                   className={cn(
//                     "max-w-[75%] px-4 py-2 rounded-lg shadow text-sm",
//                     msg.sender_id === userId
//                       ? "bg-green-200 self-start rounded-br-none"
//                       : "bg-gray-200 self-end rounded-bl-none"
//                   )}
//                 >
//                   {msg.type === "text" && msg.content}
//                   {msg.type === "location_suggestion" && (
//                     <span className="italic text-sm text-gray-800">
//                       📍 הוצע מקום מפגש ({msg.meeting_option_id})
//                     </span>
//                   )}
//                 </div>
//               </div>
//             );
//           })}
//       </div>

//       <form
//         onSubmit={handleSend}
//         className="border-t px-4 py-2 flex gap-2 items-center bg-white"
//         dir="rtl"
//       >
//         <input
//           name="message"
//           type="text"
//           placeholder="הקלד הודעה..."
//           className="flex-1 border rounded-full px-4 py-2 text-sm"
//         />
//         <button type="submit" className="bg-green-500 text-white rounded-full px-4 py-2">
//           שלח
//         </button>
//         <button
//           type="button"
//           onClick={() => setDialogOpen(true)}
//           className="bg-blue-500 text-white rounded-full px-4 py-2"
//         >
//           הצע מקום
//         </button>
//       </form>

//       <MeetingSuggestionDialog
//         open={dialogOpen}
//         onClose={() => setDialogOpen(false)}
//         onSelect={handleSendMeeting}
//       />
//     </div>
//   );
// }
