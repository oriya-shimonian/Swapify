// // // import { useEffect, useState } from "react";
// // // import { useNavigate } from "react-router-dom";
// // // import { useNotifications } from "@/hooks/useNotifications";
// // // import { cn } from "@/lib/utils";
// // // import { Bell } from "lucide-react";
// // // import { AnimatePresence, motion } from "framer-motion";

// // // export default function NotificationsDropdown({ user }: { user: any }) {
// // //   const navigate = useNavigate();
// // //   const {
// // //     unreadCount,
// // //     notifications,
// // //     fetchNotifications,
// // //     markNotificationAsRead,
// // //     loadingNotifications,
// // //   } = useNotifications(user);

// // //   const [isOpen, setIsOpen] = useState(false);

// // //   useEffect(() => {
// // //     if (isOpen) {
// // //       fetchNotifications(10);
// // //     }
// // //   }, [isOpen, fetchNotifications]);

// // //   const handleClick = async (id: number, link: string) => {
// // //     await markNotificationAsRead(id);
// // //     navigate(link);
// // //   };

// // //   return (
// // //     <div className="relative">
// // //       <button onClick={() => setIsOpen((prev) => !prev)} className="relative p-2">
// // //         <Bell className="w-6 h-6 text-zinc-700 dark:text-zinc-200" />
// // //         {unreadCount > 0 && (
// // //           <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
// // //             {unreadCount}
// // //           </span>
// // //         )}
// // //       </button>

// // //       <AnimatePresence>
// // //         {isOpen && (
// // //           <motion.div
// // //             className="absolute right-0 mt-2 w-80 max-h-96 overflow-y-auto bg-white dark:bg-zinc-800 shadow-xl rounded-xl z-50 border border-gray-200 dark:border-zinc-700"
// // //             initial={{ opacity: 0, y: -8 }}
// // //             animate={{ opacity: 1, y: 0 }}
// // //             exit={{ opacity: 0, y: -8 }}
// // //           >
// // //             {loadingNotifications ? (
// // //               <div className="p-4 text-sm text-gray-500 dark:text-gray-300">טוען התראות...</div>
// // //             ) : notifications.length === 0 ? (
// // //               <div className="p-4 text-sm text-gray-500 dark:text-gray-300">אין התראות כרגע.</div>
// // //             ) : (
// // //               notifications.map((n) => (
// // //                 <div
// // //                   key={n.notification_id}
// // //                   onClick={() => handleClick(n.notification_id, n.link)}
// // //                   className={cn(
// // //                     "cursor-pointer px-4 py-3 border-b border-gray-100 dark:border-zinc-700 hover:bg-gray-50 dark:hover:bg-zinc-700 transition",
// // //                     n.status === "Unread" && "bg-blue-50 dark:bg-zinc-700/60"
// // //                   )}
// // //                 >
// // //                   <p className="text-sm font-medium text-gray-800 dark:text-gray-100">
// // //                     {n.message}
// // //                   </p>
// // //                   <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
// // //                     {new Date(n.created_at).toLocaleString("he-IL")}
// // //                   </p>
// // //                 </div>
// // //               ))
// // //             )}
// // //           </motion.div>
// // //         )}
// // //       </AnimatePresence>
// // //     </div>
// // //   );
// // // }

// // import { useEffect, useState } from "react";
// // import { useNavigate } from "react-router-dom";
// // import { useNotifications } from "@/hooks/useNotifications";
// // import { cn } from "@/lib/utils";
// // import { Bell, CheckCheck, Eye } from "lucide-react";
// // import { AnimatePresence, motion } from "framer-motion";
// // import { Tooltip } from "@radix-ui/react-tooltip";

// // export default function NotificationsDropdown({ user }: { user: any }) {
// //   const navigate = useNavigate();
// //   const {
// //     unreadCount,
// //     notifications,
// //     fetchNotifications,
// //     markNotificationAsRead,
// //     markAllNotificationsAsRead,
// //     loadingNotifications,
// //   } = useNotifications(user);

// //   const [isOpen, setIsOpen] = useState(false);

// //   useEffect(() => {
// //     if (isOpen) {
// //       fetchNotifications(10);
// //     }
// //   }, [isOpen, fetchNotifications]);

// //   const handleClick = async (id: number, link: string) => {
// //     await markNotificationAsRead(id);
// //     navigate(link);
// //   };

// //   const getIcon = (type: string) => {
// //     switch (type) {
// //       case "new_request":
// //         return <Bell className="w-4 h-4 text-blue-500" />;
// //       case "approved":
// //         return <CheckCheck className="w-4 h-4 text-green-500" />;
// //       case "auto_rejected":
// //         return <Bell className="w-4 h-4 text-yellow-500" />;
// //       case "completed":
// //         return <CheckCheck className="w-4 h-4 text-purple-500" />;
// //       case "cancelled":
// //         return <Bell className="w-4 h-4 text-red-500" />;
// //       default:
// //         return <Bell className="w-4 h-4 text-gray-400" />;
// //     }
// //   };

// //   return (
// //     <div className="relative">
// //       <button onClick={() => setIsOpen((prev) => !prev)} className="relative p-2">
// //         <Bell className="w-6 h-6 text-zinc-700 dark:text-zinc-200" />
// //         {unreadCount > 0 && (
// //           <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
// //             {unreadCount}
// //           </span>
// //         )}
// //       </button>

// //       <AnimatePresence>
// //         {isOpen && (
// //           <motion.div
// //             className="absolute right-0 mt-2 w-80 max-h-96 overflow-y-auto bg-white dark:bg-zinc-800 shadow-xl rounded-xl z-50 border border-gray-200 dark:border-zinc-700"
// //             initial={{ opacity: 0, y: -8 }}
// //             animate={{ opacity: 1, y: 0 }}
// //             exit={{ opacity: 0, y: -8 }}
// //           >
// //             <div className="p-2 text-sm font-semibold text-gray-700 dark:text-gray-100 border-b border-gray-100 dark:border-zinc-700">
// //               התראות אחרונות
// //             </div>

// //             {loadingNotifications ? (
// //               <div className="p-4 text-sm text-gray-500 dark:text-gray-300">טוען התראות...</div>
// //             ) : notifications.length === 0 ? (
// //               <div className="p-4 text-sm text-gray-500 dark:text-gray-300">אין התראות כרגע.</div>
// //             ) : (
// //               <div className="max-h-72 overflow-y-auto">
// //                 {notifications.map((n) => (
// //                   <div
// //                     key={n.notification_id}
// //                     onClick={() => handleClick(n.notification_id, n.link)}
// //                     className={cn(
// //                       "cursor-pointer px-4 py-3 border-b border-gray-100 dark:border-zinc-700 flex gap-2 items-start hover:bg-gray-50 dark:hover:bg-zinc-700 transition",
// //                       n.status === "Unread" && "bg-blue-50 dark:bg-zinc-700/60 border-r-4 border-blue-500"
// //                     )}
// //                   >
// //                     {getIcon(n.type)}
// //                     <div>
// //                       <p className="text-sm font-medium text-gray-800 dark:text-gray-100">
// //                         {n.message}
// //                       </p>
// //                       <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
// //                         {new Date(n.created_at).toLocaleString("he-IL")}
// //                       </p>
// //                     </div>
// //                   </div>
// //                 ))}
// //               </div>
// //             )}

// //             <div className="flex items-center justify-between gap-2 p-2 border-t border-gray-100 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-900">
// //               {unreadCount > 0 && (
// //                 <button
// //                   onClick={markAllNotificationsAsRead}
// //                   className="text-xs text-blue-600 hover:underline"
// //                 >
// //                   סמן הכל כנקרא
// //                 </button>
// //               )}
// //               <button
// //                 onClick={() => navigate("/notifications")}
// //                 className="text-xs text-gray-600 dark:text-gray-300 hover:underline ml-auto"
// //               >
// //                 צפה בכל ההתראות
// //               </button>
// //             </div>
// //           </motion.div>
// //         )}
// //       </AnimatePresence>
// //     </div>
// //   );
// // }

// the most important part of the code is the NotificationsDropdown component
// import { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { useNotifications } from "@/hooks/useNotifications";
// import { cn } from "@/lib/utils";
// import { Bell, CheckCheck, Eye } from "lucide-react";
// import { AnimatePresence, motion } from "framer-motion";
// import { Tooltip } from "@radix-ui/react-tooltip";

// export default function NotificationsDropdown({ user }: { user: any }) {
//   const navigate = useNavigate();
//   const {
//     unreadCount,
//     notifications,
//     fetchNotifications,
//     markNotificationAsRead,
//     markAllNotificationsAsRead,
//     loadingNotifications,
//   } = useNotifications(user);

//   const [isOpen, setIsOpen] = useState(false);

//   useEffect(() => {
//     if (isOpen) {
//       fetchNotifications(10);
//     }
//   }, [isOpen, fetchNotifications]);

//   const handleClick = async (id: number, link: string) => {
//     await markNotificationAsRead(id);
//     navigate(link);
//   };

//   const getIcon = (type: string) => {
//     switch (type) {
//       case "new_request":
//         return <Bell className="w-4 h-4 text-blue-500" />;
//       case "approved":
//         return <CheckCheck className="w-4 h-4 text-green-500" />;
//       case "auto_rejected":
//         return <Bell className="w-4 h-4 text-yellow-500" />;
//       case "completed":
//         return <CheckCheck className="w-4 h-4 text-purple-500" />;
//       case "cancelled":
//         return <Bell className="w-4 h-4 text-red-500" />;
//       default:
//         return <Bell className="w-4 h-4 text-gray-400" />;
//     }
//   };

//   return (
//     <div className="relative">
//       <button
//         onClick={() => setIsOpen((prev) => !prev)}
//         className="relative p-2"
//       >
//         <Bell className="w-6 h-6 text-zinc-700 dark:text-zinc-200" />
//         {unreadCount > 0 && (
//           <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
//             {unreadCount}
//           </span>
//         )}
//       </button>

//       <AnimatePresence>
//         {isOpen && (
//           <motion.div
//             className="fixed sm:absolute right-2 top-16 sm:top-auto sm:mt-2 w-[calc(100vw-1rem)] sm:w-80 max-h-96 overflow-y-auto bg-white dark:bg-zinc-800 shadow-xl rounded-xl z-50 border border-gray-200 dark:border-zinc-700"
//             initial={{ opacity: 0, y: -8 }}
//             animate={{ opacity: 1, y: 0 }}
//             exit={{ opacity: 0, y: -8 }}
//           >
//             <div className="p-2 text-sm font-semibold text-gray-700 dark:text-gray-100 border-b border-gray-100 dark:border-zinc-700">
//               התראות אחרונות
//             </div>

//             {loadingNotifications ? (
//               <div className="p-4 text-sm text-gray-500 dark:text-gray-300">
//                 טוען התראות...
//               </div>
//             ) : notifications.length === 0 ? (
//               <div className="p-4 text-sm text-gray-500 dark:text-gray-300">
//                 אין התראות כרגע.
//               </div>
//             ) : (
//               <div className="max-h-72 overflow-y-auto">
//                 {notifications.map((n) => (
//                   <div
//                     key={n.notification_id}
//                     onClick={() => handleClick(n.notification_id, n.link)}
//                     className={cn(
//                       "cursor-pointer px-4 py-3 border-b border-gray-100 dark:border-zinc-700 flex gap-2 items-start hover:bg-gray-50 dark:hover:bg-zinc-700 transition",
//                       n.status === "Unread" &&
//                         "bg-blue-50 dark:bg-zinc-700/60 border-r-4 border-blue-500"
//                     )}
//                   >
//                     {getIcon(n.type)}
//                     <div>
//                       <p className="text-sm font-medium text-gray-800 dark:text-gray-100">
//                         {n.message}
//                       </p>
//                       <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
//                         {new Date(n.created_at).toLocaleString("he-IL")}
//                       </p>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             )}

//             <div className="flex items-center justify-between gap-2 p-2 border-t border-gray-100 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-900">
//               {unreadCount > 0 && (
//                 <button
//                   onClick={markAllNotificationsAsRead}
//                   className="text-xs text-blue-600 hover:underline"
//                 >
//                   סמן הכל כנקרא
//                 </button>
//               )}
//               <button
//                 onClick={() => navigate("/notifications")}
//                 className="text-xs text-gray-600 dark:text-gray-300 hover:underline ml-auto"
//               >
//                 צפה בכל ההתראות
//               </button>
//             </div>
//           </motion.div>
//         )}
//       </AnimatePresence>
//     </div>
//   );
// }


// ✅ NotificationsDropdown.tsx – כולל שורת התראה נפרדת וסגירה בלחיצה חיצונית
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useNotificationsContext } from "@/context/NotificationsContext";
import { cn } from "@/lib/utils";
import { Bell } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { NotificationsDropdownRow } from "./NotificationsDropdownRow";
import { useClickOutside } from "@/hooks/useClickOutside";

export default function NotificationsDropdown() {
  const navigate = useNavigate();
  const {
    unreadCount,
    notifications,
    fetchNotifications,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    loadingNotifications,
  } = useNotificationsContext();

  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  useClickOutside(dropdownRef, () => setIsOpen(false));

  useEffect(() => {
    if (isOpen) {
      fetchNotifications(10);
    }
  }, [isOpen, fetchNotifications]);

  const handleClick = async (id: number, link: string) => {
    await markNotificationAsRead(id);
    navigate(link);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className="relative p-2"
      >
        <Bell className="w-6 h-6 text-zinc-700 dark:text-zinc-200" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
            {unreadCount}
          </span>
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            ref={dropdownRef}
            className="fixed sm:absolute right-2 top-16 sm:top-auto sm:mt-2 w-[calc(100vw-1rem)] sm:w-80 max-h-96 overflow-y-auto bg-white dark:bg-zinc-800 shadow-xl rounded-xl z-50 border border-gray-200 dark:border-zinc-700"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
          >
            <div className="p-2 text-sm font-semibold text-gray-700 dark:text-gray-100 border-b border-gray-100 dark:border-zinc-700">
              התראות אחרונות
            </div>

            {loadingNotifications ? (
              <div className="p-4 text-sm text-gray-500 dark:text-gray-300">
                טוען התראות...
              </div>
            ) : notifications.length === 0 ? (
              <div className="p-4 text-sm text-gray-500 dark:text-gray-300">
                אין התראות כרגע.
              </div>
            ) : (
              <div className="max-h-72 overflow-y-auto">
                {notifications.map((n) => (
                  <NotificationsDropdownRow
                    key={n.notification_id}
                    notification={n}
                    onClick={() => handleClick(n.notification_id, n.link)}
                  />
                ))}
              </div>
            )}

            <div className="flex items-center justify-between gap-2 p-2 border-t border-gray-100 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-900">
              {unreadCount > 0 && (
                <button
                  onClick={markAllNotificationsAsRead}
                  className="text-xs text-blue-600 hover:underline"
                >
                  סמן הכל כנקרא
                </button>
              )}
              <button
                onClick={() => {
                  navigate("/notifications");
                  setIsOpen(false);
                }}
                className="text-xs text-gray-600 dark:text-gray-300 hover:underline ml-auto"
              >
                צפה בכל ההתראות
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
