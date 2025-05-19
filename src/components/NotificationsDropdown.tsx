// // 📁 components/notifications/NotificationsDropdown.tsx
// import { useEffect, useRef, useState } from "react";
// import { AnimatePresence, motion } from "framer-motion";
// import { useNotifications } from "@/hooks/useNotifications";
// import { markNotificationAsRead, markAllNotificationsAsRead } from "@/services/notificationService";
// import { Link } from "react-router-dom";
// import { Button } from "@/components/ui/button";
// import { Bell } from "lucide-react";

// export const NotificationsDropdown = () => {
//   const { notifications, unreadCount, refetchNotifications } = useNotifications();
//   const [open, setOpen] = useState(false);
//   const dropdownRef = useRef<HTMLDivElement>(null);

//   useEffect(() => {
//     const handleClickOutside = (event: MouseEvent) => {
//       if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
//         setOpen(false);
//       }
//     };
//     document.addEventListener("mousedown", handleClickOutside);
//     return () => document.removeEventListener("mousedown", handleClickOutside);
//   }, []);

//   const handleNotificationClick = async (id: number, link: string) => {
//     await markNotificationAsRead(id);
//     refetchNotifications();
//     window.location.href = link;
//   };

//   const handleMarkAllAsRead = async () => {
//     await markAllNotificationsAsRead();
//     refetchNotifications();
//   };

//   return (
//     <div className="relative" ref={dropdownRef}>
//       <button onClick={() => setOpen(!open)} className="relative">
//         <Bell className="w-6 h-6" />
//         {unreadCount > 0 && (
//           <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
//             {unreadCount > 9 ? "9+" : unreadCount}
//           </span>
//         )}
//       </button>

//       <AnimatePresence>
//         {open && (
//           <motion.div
//             initial={{ opacity: 0, y: -10 }}
//             animate={{ opacity: 1, y: 0 }}
//             exit={{ opacity: 0, y: -10 }}
//             transition={{ duration: 0.2 }}
//             className="absolute right-0 mt-2 w-96 max-w-[90vw] bg-white dark:bg-gray-900 shadow-xl border border-gray-200 dark:border-gray-700 rounded-lg z-50"
//           >
//             <div className="p-4 flex justify-between items-center border-b border-gray-200 dark:border-gray-700">
//               <span className="font-semibold text-gray-800 dark:text-white">התראות</span>
//               {unreadCount > 0 && (
//                 <Button variant="ghost" size="sm" onClick={handleMarkAllAsRead}>
//                   סמן הכל כנקרא
//                 </Button>
//               )}
//             </div>
//             <div className="max-h-96 overflow-y-auto divide-y divide-gray-200 dark:divide-gray-700">
//               {notifications.length === 0 ? (
//                 <div className="p-4 text-center text-gray-500 dark:text-gray-400">
//                   אין התראות להצגה
//                 </div>
//               ) : (
//                 notifications.map((n) => (
//                   <button
//                     key={n.notification_id}
//                     className={`w-full text-right px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-800 transition text-sm text-gray-700 dark:text-gray-200 ${
//                       n.status === "Unread" ? "bg-gray-100 dark:bg-gray-800" : ""
//                     }`}
//                     onClick={() => handleNotificationClick(n.notification_id, n.link)}
//                   >
//                     <div className="font-medium">{n.message}</div>
//                     <div className="text-xs text-gray-500">{new Date(n.created_at).toLocaleString("he-IL")}</div>
//                   </button>
//                 ))
//               )}
//             </div>
//           </motion.div>
//         )}
//       </AnimatePresence>
//     </div>
//   );
// };
