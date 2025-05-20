// // // import { useEffect, useState } from "react";
// // // import { useNotifications } from "@/hooks/useNotifications";
// // // import { Skeleton } from "@/components/ui/skeleton";
// // // import { motion } from "framer-motion";
// // // import { FilterField, Filters } from "@/components/UserDashboard/exchangeTabsHelpers/Filters";

// // // const filterFields: FilterField[] = [
// // //   {
// // //     key: "type",
// // //     type: "select",
// // //     placeholder: "סוג התראה",
// // //     options: [
// // //       { label: "בקשה חדשה", value: "new_request" },
// // //       { label: "אושרה", value: "approved" },
// // //       { label: "נדחתה אוטומטית", value: "auto_rejected" },
// // //       { label: "הושלמה", value: "completed" },
// // //       { label: "בוטלה", value: "cancelled" },
// // //     ],
// // //   },
// // //   {
// // //     key: "status",
// // //     type: "select",
// // //     placeholder: "סטטוס קריאה",
// // //     options: [
// // //       { label: "נקראו", value: "Read" },
// // //       { label: "לא נקראו", value: "Unread" },
// // //     ],
// // //   },
// // //   {
// // //     key: "message",
// // //     type: "input",
// // //     placeholder: "טקסט חופשי",
// // //   },
// // // ];

// // // export default function NotificationsPage({ user }: { user: any }) {
// // //   const {
// // //     notifications,
// // //     fetchNotifications,
// // //     loadingNotifications,
// // //     markNotificationAsRead,
// // //   } = useNotifications(user);

// // //   const [filters, setFilters] = useState({
// // //     type: null,
// // //     status: null,
// // //     message: "",
// // //   });

// // //   const resetPage = () => {}; // במידת הצורך

// // //   useEffect(() => {
// // //     fetchNotifications(); // נטען את כל ההתראות
// // //   }, [fetchNotifications]);

// // //   const filtered = notifications.filter((n) => {
// // //     const matchType = filters.type ? n.type === filters.type : true;
// // //     const matchStatus = filters.status ? n.status === filters.status : true;
// // //     const matchText = filters.message
// // //       ? n.message?.toLowerCase().includes(filters.message.toLowerCase())
// // //       : true;
// // //     return matchType && matchStatus && matchText;
// // //   });

// // //   return (
// // //     <div className="max-w-4xl mx-auto px-4 py-8">
// // //       <h1 className="text-2xl font-bold mb-4">כל ההתראות</h1>

// // //       <Filters
// // //         filters={filters}
// // //         setFilters={setFilters}
// // //         resetPage={resetPage}
// // //         fields={filterFields}
// // //       />

// // //       {loadingNotifications ? (
// // //         <div className="space-y-4">
// // //           {[...Array(4)].map((_, i) => (
// // //             <Skeleton key={i} className="h-16 w-full rounded-lg" />
// // //           ))}
// // //         </div>
// // //       ) : (
// // //         <div className="space-y-4">
// // //           {filtered.map((n) => (
// // //             <motion.div
// // //               key={n.notification_id}
// // //               className="p-4 border rounded-md bg-white dark:bg-zinc-800 shadow-sm hover:bg-gray-50 dark:hover:bg-zinc-700 transition cursor-pointer"
// // //               onClick={() => {
// // //                 markNotificationAsRead(n.notification_id);
// // //                 window.location.href = n.link;
// // //               }}
// // //               initial={{ opacity: 0, y: 6 }}
// // //               animate={{ opacity: 1, y: 0 }}
// // //               transition={{ duration: 0.2 }}
// // //             >
// // //               <div className="text-sm font-medium text-gray-800 dark:text-gray-100">
// // //                 {n.message}
// // //               </div>
// // //               <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
// // //                 {new Date(n.created_at).toLocaleString("he-IL")}
// // //               </div>
// // //             </motion.div>
// // //           ))}
// // //           {filtered.length === 0 && (
// // //             <p className="text-center text-gray-500 dark:text-gray-400 mt-8">
// // //               לא נמצאו התראות התואמות לסינון.
// // //             </p>
// // //           )}
// // //         </div>
// // //       )}
// // //     </div>
// // //   );
// // // }

// // import { useEffect, useState } from "react";
// // import { useNotifications } from "@/hooks/useNotifications";
// // import { Skeleton } from "@/components/ui/skeleton";
// // import { motion } from "framer-motion";
// // import { cn } from "@/lib/utils";
// // import { format, isAfter, isBefore } from "date-fns";
// // import {
// //   FilterField,
// //   Filters,
// // } from "@/components/UserDashboard/exchangeTabsHelpers/Filters";

// // const filterFields: FilterField[] = [
// //   {
// //     key: "type",
// //     type: "select",
// //     placeholder: "סוג התראה",
// //     options: [
// //       { label: "בקשה חדשה", value: "new_request" },
// //       { label: "אושרה", value: "approved" },
// //       { label: "נדחתה אוטומטית", value: "auto_rejected" },
// //       { label: "הושלמה", value: "completed" },
// //       { label: "בוטלה", value: "cancelled" },
// //     ],
// //   },
// //   {
// //     key: "status",
// //     type: "select",
// //     placeholder: "סטטוס קריאה",
// //     options: [
// //       { label: "נקראו", value: "Read" },
// //       { label: "לא נקראו", value: "Unread" },
// //     ],
// //   },
// //   {
// //     key: "message",
// //     type: "input",
// //     placeholder: "טקסט חופשי",
// //   },
// //   {
// //     key: "fromDate",
// //     type: "input",
// //     placeholder: "מתאריך (yyyy-mm-dd)",
// //   },
// //   {
// //     key: "toDate",
// //     type: "input",
// //     placeholder: "עד תאריך (yyyy-mm-dd)",
// //   },
// // ];

// // type Notification = {
// //   notification_id: number;
// //   type: string;
// //   status: string;
// //   message: string;
// //   created_at: string;
// //   link: string;
// // };

// // export default function NotificationsPage({ user }: { user: any }) {
// //   const {
// //     notifications,
// //     fetchNotifications,
// //     loadingNotifications,
// //     markNotificationAsRead,
// //     markAllNotificationsAsRead,
// //   } = useNotifications(user);

// //   const [filters, setFilters] = useState({
// //     type: null,
// //     status: null,
// //     message: "",
// //     fromDate: "",
// //     toDate: "",
// //   });

// //   const [clickedId, setClickedId] = useState<number | null>(null);

// //   const resetPage = () => {};

// //   useEffect(() => {
// //     fetchNotifications();
// //   }, [fetchNotifications]);

// //   const filtered = notifications.filter((n: Notification) => {
// //     const matchType = filters.type ? n.type === filters.type : true;
// //     const matchStatus = filters.status ? n.status === filters.status : true;
// //     const matchText = filters.message
// //       ? n.message?.toLowerCase().includes(filters.message.toLowerCase())
// //       : true;

// //     const created = new Date(n.created_at);
// //     const matchFromDate = filters.fromDate
// //       ? isAfter(created, new Date(filters.fromDate))
// //       : true;
// //     const matchToDate = filters.toDate
// //       ? isBefore(created, new Date(filters.toDate + "T23:59:59"))
// //       : true;

// //     return (
// //       matchType && matchStatus && matchText && matchFromDate && matchToDate
// //     );
// //   });

// //   const handleClick = async (id: number, link: string) => {
// //     setClickedId(id);
// //     await markNotificationAsRead(id);
// //     window.location.href = link;
// //   };

// //   return (
// //     <div className="max-w-4xl mx-auto px-4 py-8">
// //       <div className="flex justify-between items-center mb-4">
// //         <h1 className="text-2xl font-bold">כל ההתראות</h1>
// //         {notifications.some((n) => n.status === "Unread") && (
// //           <button
// //             onClick={markAllNotificationsAsRead}
// //             className="text-sm text-blue-600 hover:underline"
// //           >
// //             סמן הכל כנקרא
// //           </button>
// //         )}
// //       </div>

// //       <Filters
// //         filters={filters}
// //         setFilters={setFilters}
// //         resetPage={resetPage}
// //         fields={filterFields}
// //       />

// //       {loadingNotifications ? (
// //         <div className="space-y-4">
// //           {[...Array(4)].map((_, i) => (
// //             <Skeleton key={i} className="h-16 w-full rounded-lg" />
// //           ))}
// //         </div>
// //       ) : (
// //         <div className="space-y-4">
// //           {filtered.map((n: Notification) => (
// //             <motion.div
// //               key={n.notification_id}
// //               className={cn(
// //                 "p-4 border rounded-md bg-white dark:bg-zinc-800 shadow-sm hover:bg-gray-50 dark:hover:bg-zinc-700 transition cursor-pointer",
// //                 clickedId === n.notification_id && "opacity-50"
// //               )}
// //               onClick={() => handleClick(n.notification_id, n.link)}
// //               initial={{ opacity: 0, y: 6 }}
// //               animate={{ opacity: 1, y: 0 }}
// //               transition={{ duration: 0.2 }}
// //             >
// //               <div className="flex items-center justify-between">
// //                 <div className="text-sm font-medium text-gray-800 dark:text-gray-100">
// //                   {n.message}
// //                 </div>
// //                 {n.status === "Unread" && (
// //                   <span className="text-xs bg-blue-100 text-blue-600 rounded px-2 py-0.5 ml-2">
// //                     לא נקרא
// //                   </span>
// //                 )}
// //               </div>
// //               <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
// //                 {format(new Date(n.created_at), "dd/MM/yyyy HH:mm")}
// //               </div>
// //             </motion.div>
// //           ))}
// //           {filtered.length === 0 && (
// //             <p className="text-center text-gray-500 dark:text-gray-400 mt-8">
// //               לא נמצאו התראות התואמות לסינון.
// //             </p>
// //           )}
// //         </div>
// //       )}
// //     </div>
// //   );
// // }

// import { useEffect, useState } from "react";
// import { useNotifications } from "@/hooks/useNotifications";
// import { Skeleton } from "@/components/ui/skeleton";
// import { motion } from "framer-motion";
// import { cn } from "@/lib/utils";
// import { format, isAfter, isBefore } from "date-fns";
// import { DateRangePicker } from "@/components/DateRangePicker";
// import { FilterField, Filters } from "@/components/UserDashboard/exchangeTabsHelpers/Filters";

// const filterFields: FilterField[] = [
//   {
//     key: "type",
//     type: "select",
//     placeholder: "סוג התראה",
//     options: [
//       { label: "בקשה חדשה", value: "new_request" },
//       { label: "אושרה", value: "approved" },
//       { label: "נדחתה אוטומטית", value: "auto_rejected" },
//       { label: "הושלמה", value: "completed" },
//       { label: "בוטלה", value: "cancelled" },
//     ],
//   },
//   {
//     key: "status",
//     type: "select",
//     placeholder: "סטטוס קריאה",
//     options: [
//       { label: "נקראו", value: "Read" },
//       { label: "לא נקראו", value: "Unread" },
//     ],
//   },
//   {
//     key: "message",
//     type: "input",
//     placeholder: "טקסט חופשי",
//   },
// ];

// type Notification = {
//   notification_id: number;
//   type: string;
//   status: string;
//   message: string;
//   created_at: string;
//   link: string;
// };

// export default function NotificationsPage({ user }: { user: any }) {
//   const {
//     notifications,
//     fetchNotifications,
//     loadingNotifications,
//     markNotificationAsRead,
//     markAllNotificationsAsRead,
//   } = useNotifications(user);

//   const [filters, setFilters] = useState({
//     type: null,
//     status: null,
//     message: "",
//     fromDate: "",
//     toDate: "",
//   });

//   const [clickedId, setClickedId] = useState<number | null>(null);

//   const resetPage = () => {};

//   useEffect(() => {
//     fetchNotifications();
//   }, [fetchNotifications]);

//   const filtered = notifications.filter((n: Notification) => {
//     const matchType = filters.type ? n.type === filters.type : true;
//     const matchStatus = filters.status ? n.status === filters.status : true;
//     const matchText = filters.message
//       ? n.message?.toLowerCase().includes(filters.message.toLowerCase())
//       : true;

//     const created = new Date(n.created_at);
//     const matchFromDate = filters.fromDate
//       ? isAfter(created, new Date(filters.fromDate))
//       : true;
//     const matchToDate = filters.toDate
//       ? isBefore(created, new Date(filters.toDate + "T23:59:59"))
//       : true;

//     return matchType && matchStatus && matchText && matchFromDate && matchToDate;
//   });

//   const handleClick = async (id: number, link: string) => {
//     setClickedId(id);
//     await markNotificationAsRead(id);
//     window.location.href = link;
//   };

//   const handleDateRangeChange = (from: string, to: string) => {
//     setFilters((prev) => ({ ...prev, fromDate: from, toDate: to }));
//     resetPage();
//   };

//   return (
//     <div className="max-w-4xl mx-auto px-4 py-8 mt-[4.5rem]">
//       <div className="flex justify-between items-center mb-4">
//         <h1 className="text-2xl font-bold">כל ההתראות</h1>
//         {notifications.some((n) => n.status === "Unread") && (
//           <button
//             onClick={markAllNotificationsAsRead}
//             className="text-sm text-blue-600 hover:underline"
//           >
//             סמן הכל כנקרא
//           </button>
//         )}
//       </div>

// <div className="flex flex-col md:flex-row gap-4 justify-center items-center mb-6">
//         <div className="mb-6 max-w-sm">
//         <DateRangePicker
//           fromDate={filters.fromDate}
//           toDate={filters.toDate}
//           onChange={handleDateRangeChange}
//         />
//       </div>

//       <Filters
//         filters={filters}
//         setFilters={setFilters}
//         resetPage={resetPage}
//         fields={filterFields}
//       />
// </div>

//       {loadingNotifications ? (
//         <div className="space-y-4">
//           {[...Array(4)].map((_, i) => (
//             <Skeleton key={i} className="h-16 w-full rounded-lg" />
//           ))}
//         </div>
//       ) : (
//         <div className="space-y-4">
//           {filtered.map((n: Notification) => (
//             <motion.div
//               key={n.notification_id}
//               className={cn(
//                 "p-4 border rounded-md bg-white dark:bg-zinc-800 shadow-sm hover:bg-gray-50 dark:hover:bg-zinc-700 transition cursor-pointer",
//                 clickedId === n.notification_id && "opacity-50"
//               )}
//               onClick={() => handleClick(n.notification_id, n.link)}
//               initial={{ opacity: 0, y: 6 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ duration: 0.2 }}
//             >
//               <div className="flex items-center justify-between">
//                 <div className="text-sm font-medium text-gray-800 dark:text-gray-100">
//                   {n.message}
//                 </div>
//                 {n.status === "Unread" && (
//                   <span className="text-xs bg-blue-100 text-blue-600 rounded px-2 py-0.5 ml-2">
//                     לא נקרא
//                   </span>
//                 )}
//               </div>
//               <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
//                 {format(new Date(n.created_at), "dd/MM/yyyy HH:mm")}
//               </div>
//             </motion.div>
//           ))}
//           {filtered.length === 0 && (
//             <p className="text-center text-gray-500 dark:text-gray-400 mt-8">
//               לא נמצאו התראות התואמות לסינון.
//             </p>
//           )}
//         </div>
//       )}
//     </div>
//   );
// }

import { useEffect, useState } from "react";
import { useNotifications } from "@/hooks/useNotifications";
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { format, isAfter, isBefore } from "date-fns";
import { DateRangePicker } from "@/components/DateRangePicker";
import {
  FilterField,
  Filters,
} from "@/components/UserDashboard/exchangeTabsHelpers/Filters";

const filterFields: FilterField[] = [
  {
    key: "type",
    type: "select",
    placeholder: "סוג התראה",
    options: [
      { label: "בקשה חדשה", value: "new_request" },
      { label: "אושרה", value: "approved" },
      { label: "נדחתה אוטומטית", value: "auto_rejected" },
      { label: "הושלמה", value: "completed" },
      { label: "בוטלה", value: "cancelled" },
    ],
  },
  {
    key: "status",
    type: "select",
    placeholder: "סטטוס קריאה",
    options: [
      { label: "נקראו", value: "Read" },
      { label: "לא נקראו", value: "Unread" },
    ],
  },
  {
    key: "message",
    type: "input",
    placeholder: "טקסט חופשי",
  },
];

type Notification = {
  notification_id: number;
  type: string;
  status: string;
  message: string;
  created_at: string;
  link: string;
};

export default function NotificationsPage({ user }: { user: any }) {
  const {
    notifications,
    fetchNotifications,
    loadingNotifications,
    markNotificationAsRead,
    markAllNotificationsAsRead,
  } = useNotifications(user);

  const [filters, setFilters] = useState({
    type: null,
    status: null,
    message: "",
    fromDate: "",
    toDate: "",
  });

  const [clickedId, setClickedId] = useState<number | null>(null);

  const resetPage = () => {};

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  const filtered = notifications.filter((n: Notification) => {
    const matchType = filters.type ? n.type === filters.type : true;
    const matchStatus = filters.status ? n.status === filters.status : true;
    const matchText = filters.message
      ? n.message?.toLowerCase().includes(filters.message.toLowerCase())
      : true;

    const created = new Date(n.created_at);
    const matchFromDate = filters.fromDate
      ? isAfter(created, new Date(filters.fromDate))
      : true;
    const matchToDate = filters.toDate
      ? isBefore(created, new Date(filters.toDate + "T23:59:59"))
      : true;

    return (
      matchType && matchStatus && matchText && matchFromDate && matchToDate
    );
  });

  const handleClick = async (id: number, link: string) => {
    setClickedId(id);
    await markNotificationAsRead(id);
    window.location.href = link;
  };

  const handleDateRangeChange = (from: string, to: string) => {
    setFilters((prev) => ({ ...prev, fromDate: from, toDate: to }));
    resetPage();
  };

  const getTypeColor = (type: string) => {
    const colors = {
      new_request: "from-purple-500 to-blue-500",
      approved: "from-green-500 to-emerald-400",
      auto_rejected: "from-red-500 to-pink-500",
      completed: "from-teal-500 to-cyan-400",
      cancelled: "from-yellow-500 to-amber-400",
    };
    return colors[type as keyof typeof colors] || "from-blue-500 to-purple-500";
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 mt-[4.5rem] dark:bg-zinc-900 bg-gray-50 rounded-lg">
      <div className="bg-gradient-to-r from-blue-500 to-purple-500 text-white p-6 rounded-xl shadow-lg mb-8">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-blue-100">
            כל ההתראות
          </h1>
          {notifications.some((n) => n.status === "Unread") && (
            <button
              onClick={markAllNotificationsAsRead}
              className="px-4 py-2 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-lg text-sm font-medium backdrop-blur-sm transition-all duration-300 border border-white border-opacity-30"
            >
              סמן הכל כנקרא
            </button>
          )}
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4 justify-center items-center bg-white dark:bg-zinc-800 p-6 rounded-xl shadow-md mb-6 w-full">
        <div className="mb-6 max-w-sm">
          <DateRangePicker
            fromDate={filters.fromDate}
            toDate={filters.toDate}
            onChange={handleDateRangeChange}
          />
        </div>
        <div className="flex-grow">
          <Filters
            filters={filters}
            setFilters={setFilters}
            resetPage={resetPage}
            fields={filterFields}
          />
        </div>
      </div>

      {loadingNotifications ? (
        <div className="space-y-4">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-20 w-full rounded-xl" />
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((n: Notification) => (
            <motion.div
              key={n.notification_id}
              className={cn(
                "relative overflow-hidden p-5 border border-gray-100 dark:border-zinc-700 rounded-xl bg-white dark:bg-zinc-800 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer group",
                clickedId === n.notification_id && "opacity-50"
              )}
              onClick={() => handleClick(n.notification_id, n.link)}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              whileHover={{ scale: 1.01 }}
            >
              {/* Neon border effect on hover */}
              <div
                className={`absolute inset-0 bg-gradient-to-r ${getTypeColor(
                  n.type
                )} opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl -z-10 blur-sm`}
              ></div>

              <div className="flex items-center justify-between">
                <div className="text-base font-medium text-gray-800 dark:text-gray-100">
                  {n.message}
                </div>
                {n.status === "Unread" && (
                  <span className="text-xs bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-full px-3 py-1 ml-2 font-semibold">
                    לא נקרא
                  </span>
                )}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400 mt-2 flex items-center">
                <span className="bg-gray-100 dark:bg-zinc-700 px-2 py-1 rounded-md">
                  {format(new Date(n.created_at), "dd/MM/yyyy HH:mm")}
                </span>
              </div>
            </motion.div>
          ))}
          {filtered.length === 0 && (
            <motion.div
              className="text-center p-12 rounded-xl bg-white dark:bg-zinc-800 shadow-md"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <div className="text-6xl mb-4">🔍</div>
              <p className="text-lg text-gray-500 dark:text-gray-400">
                לא נמצאו התראות התואמות לסינון.
              </p>
            </motion.div>
          )}
        </div>
      )}
    </div>
  );
}
