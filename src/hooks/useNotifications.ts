// import { useEffect, useState } from "react";
// import axios from "axios";
// import { IUser } from "@/types/type";
// import { notificationRoutes } from "@/settings";
// import { getSocket } from "@/lib/socket"; // ✅

// export const useNotifications = (user?: IUser | null) => {
//   const [unreadCount, setUnreadCount] = useState<number>(0);
//   const [loading, setLoading] = useState(true);

//   const audio = new Audio("/sounds/swapify-notifications-sound.mp3");
//   const fetchUnreadCount = async () => {
//     try {
//       const res = await axios.get(notificationRoutes.getUnreadCount, {
//         headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
//       });
//       setUnreadCount(res.data.count);
//     } catch (error) {
//       console.error("שגיאה בשליפת מספר התראות לא נקראו:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     if (!user) return;

//     fetchUnreadCount();

//     const socket = getSocket(); // 🧠 שימוש ב־getSocket (ולא יצירה מחדש)
    
//     if (socket && !socket.hasListeners?.("new_notification")) {
//       socket.on("new_notification", () => {
//         fetchUnreadCount();
//         if (user.notification_enabled) {
//           audio.currentTime = 0;
//           audio.play().catch((err) => {
//             console.warn("🔇 לא ניתן לנגן את הצליל:", err.message);
//           });
//         }
//       });
//     }

//     return () => {
//       socket?.off("new_notification");
//     };
//   }, [user]);

//   return { unreadCount, loading, refetchUnreadCount: fetchUnreadCount };
// };


import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { IUser } from "@/types/type";
import { notificationRoutes } from "@/settings";
import { getSocket } from "@/lib/socket";
import { Notification } from "@/types/notifications";

export const useNotifications = (user?: IUser | null) => {
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loadingNotifications, setLoadingNotifications] = useState(false);

  const audio = new Audio("/sounds/swapify-notifications-sound.mp3");

  const fetchUnreadCount = useCallback(async () => {
    try {
      const res = await axios.get(notificationRoutes.getUnreadCount, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setUnreadCount(res.data.count);
    } catch (error) {
      console.error("שגיאה בשליפת מספר התראות לא נקראו:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchNotifications = useCallback(async (limit = 10) => {
    setLoadingNotifications(true);
    try {
      const res = await axios.get(notificationRoutes.getEnrichedNotifications(limit), {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setNotifications(res.data);
    } catch (error) {
      console.error("שגיאה בטעינת התראות:", error);
    } finally {
      setLoadingNotifications(false);
    }
  }, []);

  const markNotificationAsRead = useCallback(async (id: number) => {
    try {
      await axios.put(notificationRoutes.markNotificationAsRead(id), {}, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setNotifications((prev) =>
        prev.map((n) =>
          n.notification_id === id ? { ...n, status: "Read" } : n
        )
      );
      fetchUnreadCount();
    } catch (error) {
      console.error("שגיאה בסימון התראה כנקראה:", error);
    }
  }, [fetchUnreadCount]);

  const markAllNotificationsAsRead = useCallback(async () => {
    try {
      await axios.put(notificationRoutes.markAllAsRead, {}, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setNotifications((prev) =>
        prev.map((n) => ({ ...n, status: "Read" }))
      );
      fetchUnreadCount();
    } catch (error) {
      console.error("שגיאה בסימון כל ההתראות כנקראו:", error);
    }
  }, [fetchUnreadCount]);

  useEffect(() => {
    if (!user) return;

    fetchUnreadCount();

    const socket = getSocket();
    if (socket && !socket.hasListeners?.("new_notification")) {
      socket.on("new_notification", () => {
        fetchUnreadCount();
        if (user.notification_enabled) {
          audio.currentTime = 0;
          audio.play().catch((err) => {
            console.warn("🔇 לא ניתן לנגן את הצליל:", err.message);
          });
        }
      });
    }

    return () => {
      socket?.off("new_notification");
    };
  }, [user, fetchUnreadCount]);

  return {
    unreadCount,
    loading,
    notifications,
    loadingNotifications,
    fetchNotifications,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    refetchUnreadCount: fetchUnreadCount,
  };
};
