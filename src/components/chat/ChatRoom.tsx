// // // import { useEffect, useRef } from "react";
// // // import { useAuth } from "@/context/AuthContext";
// // // import { useChatMessages } from "@/hooks/useChatMessages";
// // // import ChatMessageBubble from "./ChatMessageBubble";
// // // import ChatInput from "./ChatInput";

// // // export default function ChatRoom({ chatId }: { chatId: number }) {
// // //   const { user } = useAuth();
// // //   const { messages, sendMessage, loading } = useChatMessages(chatId);
// // //   const bottomRef = useRef<HTMLDivElement>(null);

// // //   useEffect(() => {
// // //     bottomRef.current?.scrollIntoView({ behavior: "smooth" });
// // //   }, [messages]);

// // //   return (
// // //     <div className="flex flex-col h-[80vh] border rounded-xl overflow-hidden shadow-md">
// // //       <div className="flex-1 overflow-y-auto p-4 space-y-2 bg-muted">
// // //         {loading ? (
// // //           <div>טוען הודעות...</div>
// // //         ) : (
// // //           messages.map((msg) => (
// // //             <ChatMessageBubble
// // //               key={msg.message_id}
// // //               message={msg}
// // //               isOwn={msg.sender_id === user?.user_id}
// // //             />
// // //           ))
// // //         )}
// // //         <div ref={bottomRef} />
// // //       </div>
// // //       <div className="border-t bg-white dark:bg-gray-900 p-3">
// // //         <ChatInput onSend={(text) => sendMessage({ senderId: user?.user_id!, content: text, type: "text" })} />
// // //       </div>
// // //     </div>
// // //   );
// // // }

// // import { useEffect, useRef, useState } from "react";
// // import axios from "axios";
// // import { useAuth } from "@/context/AuthContext";
// // import { useChatMessages } from "@/hooks/useChatMessages";
// // import ChatMessageBubble from "./ChatMessageBubble";
// // import ChatInput from "./ChatInput";
// // import AppDialog from "@/components/AppDialog";
// // import { Button } from "@/components/ui/button";
// // import { chatRoutes, exchangeRequestRoutes } from "@/settings";

// // interface ChatRoomProps {
// //   chatId: number;
// // }

// // export default function ChatRoom({ chatId }: ChatRoomProps) {
// //   const { user } = useAuth();
// //   const { messages, sendMessage, loading } = useChatMessages(chatId);
// //   const bottomRef = useRef<HTMLDivElement>(null);

// //   const [exchangeRequestInfo, setExchangeRequestInfo] = useState<any>(null);
// //   const [openReject, setOpenReject] = useState(false);
// //   const [openApprove, setOpenApprove] = useState(false);
// //   const [actionInProgress, setActionInProgress] = useState(false);
// //   const [approvedOrRejected, setApprovedOrRejected] = useState(false);

// //   // if there is no user, return early
// //   useEffect(() => {
// //     if (!user) {
// //       // console.error("User not found, cannot load chat room.");
// //       return;
// //     }
// //   }
// //   , [user]);

// //   useEffect(() => {
// //     bottomRef.current?.scrollIntoView({ behavior: "smooth" });
// //   }, [messages]);

// //   useEffect(() => {
// //     const fetchExchangeRequestInfo = async () => {
// //       try {
// //         const chatRes = await axios.get(chatRoutes.getChatById(chatId), {
// //           headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
// //         });
// //         const requestId = chatRes.data.exchange_request_id;
// //         console.log(chatRes, "מזהה הבקשה מהצ׳אט");

// //         const requestRes = await axios.get(exchangeRequestRoutes.getExchangeRequestById(requestId), {
// //           headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
// //         });
// //         const request = requestRes.data;
// //         console.log("פרטי ההחלפה:", requestRes.data);

// //         setExchangeRequestInfo(request);
// //       } catch (err) {
// //         console.error("שגיאה בשליפת פרטי ההחלפה מהצ׳אט", err);
// //       }
// //     };

// //     if (chatId) {
// //       fetchExchangeRequestInfo();
// //     }
// //   }, [chatId]);

// //   const shouldShowApprovalButtons =
// //     exchangeRequestInfo?.status === "Approved" &&
// //     exchangeRequestInfo?.requested_product_id &&
// //     user?.user_id === exchangeRequestInfo?.requested_product_owner_id &&
// //     !approvedOrRejected;

// //   const handleApprove = async () => {
// //     setActionInProgress(true);
// //     try {
// //       await axios.post(`/api/exchange-requests/${exchangeRequestInfo.request_id}/complete`, {
// //         userId: user!.user_id,
// //         userName: user!.name,
// //       });
// //       await sendMessage({
// //         senderId: user!.user_id,
// //         type: "system",
// //         content: `אישרת את ההחלפה עם ${exchangeRequestInfo.requester_name}.`,
// //       });
// //       setApprovedOrRejected(true);
// //     } catch (err) {
// //       console.error("שגיאה באישור ההחלפה", err);
// //     } finally {
// //       setActionInProgress(false);
// //       setOpenApprove(false);
// //     }
// //   };

// //   const handleReject = async () => {
// //     setActionInProgress(true);
// //     try {
// //       await axios.put(`/api/exchange-requests/${exchangeRequestInfo.request_id}`, {
// //         status: "Rejected",
// //         userId: user?.user_id,
// //         userName: user?.name,
// //       });
// //       await sendMessage({
// //         senderId: user!.user_id,
// //         type: "system",
// //         content: `דחית את ההצעה להחלפה עם ${exchangeRequestInfo.requester_name}.`,
// //       });
// //       setApprovedOrRejected(true);
// //     } catch (err) {
// //       console.error("שגיאה בדחיית ההחלפה", err);
// //     } finally {
// //       setActionInProgress(false);
// //       setOpenReject(false);
// //     }
// //   };

// //   return (
// //     <div className="flex flex-col h-[80vh] border rounded-xl overflow-hidden shadow-md">
// //       {exchangeRequestInfo && (
// //         <div className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 border-b text-sm md:text-base">
// //           <div className="font-medium">
// //             💬 צ'אט להחלפת&nbsp;
// //             <span className="font-semibold text-primary">
// //               "{exchangeRequestInfo.requested_product?.title}"
// //             </span>
// //             &nbsp;שלך עם&nbsp;
// //             <span className="font-semibold text-primary">
// //               "{exchangeRequestInfo.offered_product?.title}"
// //             </span>
// //             &nbsp;של {exchangeRequestInfo.requester_name}
// //           </div>

// //           {shouldShowApprovalButtons && (
// //             <div className="flex gap-2">
// //               <Button size="sm" variant="destructive" onClick={() => setOpenReject(true)}>
// //                 דחייה
// //               </Button>
// //               <Button size="sm" onClick={() => setOpenApprove(true)}>
// //                 אישור
// //               </Button>
// //             </div>
// //           )}
// //         </div>
// //       )}

// //       <div className="flex-1 overflow-y-auto p-4 space-y-2 bg-muted">
// //         {loading ? (
// //           <div>טוען הודעות...</div>
// //         ) : (
// //           messages.map((msg) => (
// //             <ChatMessageBubble
// //               key={msg.message_id}
// //               message={msg}
// //               isOwn={msg.sender_id === user?.user_id}
// //             />
// //           ))
// //         )}
// //         <div ref={bottomRef} />
// //       </div>

// //       <div className="border-t bg-white dark:bg-gray-900 p-3">
// //         <ChatInput
// //           onSend={(text) =>
// //             sendMessage({ senderId: user?.user_id!, content: text, type: "text" })
// //           }
// //         />
// //       </div>

// //       <AppDialog
// //         open={openReject}
// //         title="דחיית ההחלפה"
// //         description="האם את בטוחה שברצונך לדחות את ההצעה? פעולה זו אינה הפיכה."
// //         confirmVariant="destructive"
// //         onCancel={() => setOpenReject(false)}
// //         onConfirm={handleReject}
// //         loading={actionInProgress}
// //       />

// //       <AppDialog
// //         open={openApprove}
// //         title="אישור ההחלפה"
// //         description={`האם את בטוחה שברצונך לאשר את ההצעה ולהחליף את המוצר שלך במוצר "${exchangeRequestInfo?.offered_product?.title}"? פעולה זו אינה הפיכה.`}
// //         onCancel={() => setOpenApprove(false)}
// //         onConfirm={handleApprove}
// //         loading={actionInProgress}
// //       />
// //     </div>
// //   );
// // }

// import { useEffect, useRef, useState } from "react";
// import { useAuth } from "@/context/AuthContext";
// import { useChatMessages } from "@/hooks/useChatMessages";
// import { useExchangeRequest } from "@/hooks/useExchangeRequest";
// import ChatMessageBubble from "./ChatMessageBubble";
// import ChatInput from "./ChatInput";
// import AppDialog from "@/components/AppDialog";
// import { Button } from "@/components/ui/button";
// import { useChat } from "@/hooks/useChat";

// interface ChatRoomProps {
//   chatId: number;
// }

// export default function ChatRoom({ chatId }: ChatRoomProps) {
//   const { user } = useAuth();
//   const { messages, sendMessage, loading } = useChatMessages(chatId);
//   const { getChatById } = useChat();
//   const {
//     getRequestById,
//     completeRequest,
//     rejectOfferedRequest,
//   } = useExchangeRequest();

//   const bottomRef = useRef<HTMLDivElement>(null);
//   const [exchangeRequestInfo, setExchangeRequestInfo] = useState<any>(null);
//   const [openReject, setOpenReject] = useState(false);
//   const [openApprove, setOpenApprove] = useState(false);
//   const [actionInProgress, setActionInProgress] = useState(false);
//   const [approvedOrRejected, setApprovedOrRejected] = useState(false);

//   useEffect(() => {
//     if (!user) return;
//   }, [user]);

//   useEffect(() => {
//     bottomRef.current?.scrollIntoView({ behavior: "smooth" });
//   }, [messages]);

//   useEffect(() => {
//     const fetchExchangeRequestInfo = async () => {
//       try {
//         const chat = await getChatById(chatId);
//         const request = await getRequestById(chat.exchange_request_id);
//         setExchangeRequestInfo(request);
//       } catch (err) {
//         console.error("שגיאה בשליפת פרטי ההחלפה מהצ׳אט", err);
//       }
//     };

//     if (chatId) {
//       fetchExchangeRequestInfo();
//     }
//   }, [chatId]);

//   const shouldShowApprovalButtons =
//     exchangeRequestInfo?.status === "Approved" &&
//     exchangeRequestInfo?.requested_product_id &&
//     user?.user_id === exchangeRequestInfo?.requested_product_owner_id &&
//     !approvedOrRejected;

//   const handleApprove = async () => {
//     setActionInProgress(true);
//     try {
//       await completeRequest(
//         exchangeRequestInfo.request_id,
//         user!.user_id,
//         user!.name
//       );

//       await sendMessage({
//         senderId: user!.user_id,
//         type: "system",
//         content: `אישרת את ההחלפה עם ${exchangeRequestInfo.requester_name}.`,
//       });

//       setApprovedOrRejected(true);
//     } catch (err) {
//       console.error("שגיאה באישור ההחלפה", err);
//     } finally {
//       setActionInProgress(false);
//       setOpenApprove(false);
//     }
//   };

//   const handleReject = async () => {
//     setActionInProgress(true);
//     try {
//       await rejectOfferedRequest(
//         exchangeRequestInfo.request_id,
//         user!.user_id,
//         user!.name
//       );

//       await sendMessage({
//         senderId: user!.user_id,
//         type: "system",
//         content: `דחית את ההצעה להחלפה עם ${exchangeRequestInfo.requester_name}.`,
//       });

//       setApprovedOrRejected(true);
//     } catch (err) {
//       console.error("שגיאה בדחיית ההחלפה", err);
//     } finally {
//       setActionInProgress(false);
//       setOpenReject(false);
//     }
//   };

//   return (
//     <div className="flex flex-col h-[80vh] border rounded-xl overflow-hidden shadow-md">
//       {exchangeRequestInfo && (
//         <div className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 border-b text-sm md:text-base">
//           <div className="font-medium">
//             💬 צ'אט להחלפת&nbsp;
//             <span className="font-semibold text-primary">
//               "{exchangeRequestInfo.requested_product?.title}"
//             </span>
//             &nbsp;שלך עם&nbsp;
//             <span className="font-semibold text-primary">
//               "{exchangeRequestInfo.offered_product?.title}"
//             </span>
//             &nbsp;של {exchangeRequestInfo.requester_name}
//           </div>

//           {shouldShowApprovalButtons && (
//             <div className="flex gap-2">
//               <Button size="sm" variant="destructive" onClick={() => setOpenReject(true)}>
//                 דחייה
//               </Button>
//               <Button size="sm" onClick={() => setOpenApprove(true)}>
//                 אישור
//               </Button>
//             </div>
//           )}
//         </div>
//       )}

//       <div className="flex-1 overflow-y-auto p-4 space-y-2 bg-muted">
//         {loading ? (
//           <div>טוען הודעות...</div>
//         ) : (
//           messages.map((msg) => (
//             <ChatMessageBubble
//               key={msg.message_id}
//               message={msg}
//               isOwn={msg.sender_id === user?.user_id}
//             />
//           ))
//         )}
//         <div ref={bottomRef} />
//       </div>

//       <div className="border-t bg-white dark:bg-gray-900 p-3">
//         <ChatInput
//           onSend={(text) =>
//             sendMessage({ senderId: user?.user_id!, content: text, type: "text" })
//           }
//         />
//       </div>

//       <AppDialog
//         open={openReject}
//         title="דחיית ההחלפה"
//         description="האם את בטוחה שברצונך לדחות את ההצעה? פעולה זו אינה הפיכה."
//         confirmVariant="destructive"
//         onCancel={() => setOpenReject(false)}
//         onConfirm={handleReject}
//         loading={actionInProgress}
//       />

//       <AppDialog
//         open={openApprove}
//         title="אישור ההחלפה"
//         description={`האם את בטוחה שברצונך לאשר את ההצעה ולהחליף את המוצר שלך במוצר "${exchangeRequestInfo?.offered_product?.title}"? פעולה זו אינה הפיכה.`}
//         onCancel={() => setOpenApprove(false)}
//         onConfirm={handleApprove}
//         loading={actionInProgress}
//       />
//     </div>
//   );
// }

import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { useChatMessages } from "@/hooks/useChatMessages";
import { useExchangeRequest } from "@/hooks/useExchangeRequest";
import { useChat } from "@/hooks/useChat";
import ChatMessageBubble from "./ChatMessageBubble";
import ChatInput from "./ChatInput";
import AppDialog from "@/components/AppDialog";
import { Button } from "@/components/ui/button";
import { TiWarningOutline } from "react-icons/ti";

interface ChatRoomProps {
  chatId: number;
}

export default function ChatRoom({ chatId }: ChatRoomProps) {
  const { user } = useAuth();
  const { messages, sendMessage, loading } = useChatMessages(chatId);
  const { getChatById } = useChat();
  const { getRequestById, completeRequest, rejectOfferedRequest } =
    useExchangeRequest();

  const bottomRef = useRef<HTMLDivElement>(null);
  const [exchangeRequestInfo, setExchangeRequestInfo] = useState<any>(null);
  const [openReject, setOpenReject] = useState(false);
  const [openApprove, setOpenApprove] = useState(false);
  const [actionInProgress, setActionInProgress] = useState(false);
  const [approvedOrRejected, setApprovedOrRejected] = useState(false);

  useEffect(() => {
    if (!user) return;
  }, [user]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    const fetchExchangeRequestInfo = async () => {
      try {
        const chat = await getChatById(chatId);
        const request = await getRequestById(chat.exchange_request_id);
        setExchangeRequestInfo(request);
      } catch (err) {
        console.error("שגיאה בשליפת פרטי ההחלפה מהצ׳אט", err);
      }
    };

    if (chatId) {
      fetchExchangeRequestInfo();
    }
  }, [chatId]);

  if (!exchangeRequestInfo) {
    return (
      <div className="flex items-center justify-center h-[80vh] text-muted-foreground">
        טוען פרטי ההחלפה...
      </div>
    );
  }

  const isRequester = user?.user_id === exchangeRequestInfo.requester_id;

  const myProduct = isRequester
    ? {
        id: exchangeRequestInfo.chosen_product_id,
        title: exchangeRequestInfo.offered_product?.title,
      }
    : {
        id: exchangeRequestInfo.requested_product_id,
        title: exchangeRequestInfo.requested_product?.title,
      };

  const otherProduct = isRequester
    ? {
        id: exchangeRequestInfo.requested_product_id,
        title: exchangeRequestInfo.requested_product?.title,
      }
    : {
        id: exchangeRequestInfo.chosen_product_id,
        title: exchangeRequestInfo.offered_product?.title,
      };

  const otherUserName = isRequester
    ? exchangeRequestInfo.requested_product_owner_name
    : exchangeRequestInfo.requester_name;

  const shouldShowApprovalButtons =
    exchangeRequestInfo.status === "Approved" &&
    (user?.user_id === exchangeRequestInfo.requested_product_owner_id ||
      user?.user_id === exchangeRequestInfo.requester_id) &&
    !approvedOrRejected;

  const handleApprove = async () => {
    setActionInProgress(true);
    try {
      await completeRequest(
        exchangeRequestInfo.request_id,
        user!.user_id,
        user!.name
      );

      await sendMessage({
        senderId: user!.user_id,
        type: "system",
        content: `${user?.name} אישר/ה את ההחלפה עם ${otherUserName}.`,
      });

      setApprovedOrRejected(true);
    } catch (err) {
      console.error("שגיאה באישור ההחלפה", err);
    } finally {
      setActionInProgress(false);
      setOpenApprove(false);
    }
  };

  const handleReject = async () => {
    setActionInProgress(true);
    try {
      await rejectOfferedRequest(
        exchangeRequestInfo.request_id,
        user!.user_id,
        user!.name
      );

      await sendMessage({
        senderId: user!.user_id,
        type: "system",
        content: `דחית את ההצעה להחלפה עם ${otherUserName}.`,
      });

      setApprovedOrRejected(true);
    } catch (err) {
      console.error("שגיאה בדחיית ההחלפה", err);
    } finally {
      setActionInProgress(false);
      setOpenReject(false);
    }
  };

  return (
    <div className="flex flex-col h-[80vh] border rounded-xl overflow-hidden shadow-md">
      <div className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 border-b text-sm md:text-base">
        <div className="font-medium">
          💬 צ'אט להחלפת&nbsp;
          <Link
            to={`/product/${myProduct.id}`}
            className="font-semibold text-primary underline-offset-2 hover:underline"
          >
            "{myProduct.title}"
          </Link>
          &nbsp;שלך עם&nbsp;
          <Link
            to={`/product/${otherProduct.id}`}
            className="font-semibold text-primary underline-offset-2 hover:underline"
          >
            "{otherProduct.title}"
          </Link>
          &nbsp;של {otherUserName}
        </div>

        {shouldShowApprovalButtons && (
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="destructive"
              onClick={() => setOpenReject(true)}
            >
              דחייה
            </Button>
            <Button size="sm" onClick={() => setOpenApprove(true)}>
              אישור
            </Button>
          </div>
        )}
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-2 bg-muted">
        {loading ? (
          <div>טוען הודעות...</div>
        ) : (
          <>
            <div className="bg-amber-100 dark:bg-amber-400 text-yellow-800 dark:text-yellow-800 p-3 rounded-xl text-sm mb-4 shadow flex flex-row gap-3">
              <TiWarningOutline size={30}/>

              שימו לב: תוכן השיחה עשוי להיבדק על ידי צוות Swapify לצורכי אבטחה
              ושיפור השירות.<br/> השימוש בצ'אט מהווה הסכמה לכך ונעשה באחריות המשתמש.
            </div>
            {messages.map((msg) => (
              <ChatMessageBubble
                key={msg.message_id}
                message={msg}
                isOwn={msg.sender_id === user?.user_id}
              />
            ))}
          </>
        )}
        <div ref={bottomRef} />
      </div>

      <div className="border-t bg-white dark:bg-gray-900 p-3">
        <ChatInput
          onSend={(text) =>
            sendMessage({
              senderId: user?.user_id!,
              content: text,
              type: "text",
            })
          }
        />
      </div>

      <AppDialog
        open={openReject}
        title="דחיית ההחלפה"
        description="האם את בטוחה שברצונך לדחות את ההצעה? פעולה זו אינה הפיכה."
        confirmVariant="destructive"
        onCancel={() => setOpenReject(false)}
        onConfirm={handleReject}
        loading={actionInProgress}
      />

      <AppDialog
        open={openApprove}
        title="אישור ההחלפה"
        description={`האם את בטוחה שברצונך לאשר את ההצעה ולהחליף את המוצר שלך במוצר "${otherProduct.title}"? פעולה זו אינה הפיכה.`}
        onCancel={() => setOpenApprove(false)}
        onConfirm={handleApprove}
        loading={actionInProgress}
      />
    </div>
  );
}
