import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { IUser } from "@/types/type";
import { notificationRoutes } from "@/settings";
import { getSocket } from "@/lib/socket";
import { Notification, NUM_NOTIFICATIONS_IN_PAGE } from "@/types/notifications";

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

  const fetchNotifications = useCallback(
    async (
      limit = NUM_NOTIFICATIONS_IN_PAGE,
      offset = 0
    ): Promise<Notification[]> => {
      setLoadingNotifications(true);
      try {
        const res = await axios.get(
          notificationRoutes.getEnrichedNotifications(limit, offset),
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        console.log("🔔 התראות:", res.data);

        setNotifications((prev) => [...prev, ...res.data]);
        return res.data;
      } catch (error) {
        console.error("שגיאה בטעינת התראות:", error);
        return [];
      } finally {
        setLoadingNotifications(false);
      }
    },
    []
  );

  const markNotificationAsRead = useCallback(
    async (id: number) => {
      try {
        await axios.put(
          notificationRoutes.markNotificationAsRead(id),
          {},
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setNotifications((prev) =>
          prev.map((n) =>
            n.notification_id === id ? { ...n, status: "Read" } : n
          )
        );
        fetchUnreadCount();
      } catch (error) {
        console.error("שגיאה בסימון התראה כנקראה:", error);
      }
    },
    [fetchUnreadCount]
  );

  const markAllNotificationsAsRead = useCallback(async () => {
    try {
      await axios.put(
        notificationRoutes.markAllAsRead,
        {},
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      setNotifications((prev) => prev.map((n) => ({ ...n, status: "Read" })));
      // fetchUnreadCount();
      setUnreadCount(0);
    } catch (error) {
      console.error("שגיאה בסימון כל ההתראות כנקראו:", error);
    }
  }, [fetchUnreadCount]);

  useEffect(() => {
    if (!user) return;

    fetchUnreadCount();

    const socket = getSocket();
    if (!socket) return;
    // מאזין ל־"new_notification" – יופעל בכל פעם שמגיעה התראה חדשה
    const handleNewNotification = () => {
      fetchUnreadCount();
      if (user.notification_enabled) {
        audio.currentTime = 0;
        audio.play().catch((err) => {
          console.warn("🔇 לא ניתן לנגן את הצליל:", err.message);
        });
      }
    };

    const handleCrossMatch = (data: any) => {
      console.log("🎯 התאמה צולבת בזמן אמת:", data);
      if (user.notification_enabled) {
        audio.currentTime = 0;
        audio.play().catch((err) => {
          console.warn("🔇 לא ניתן לנגן את הצליל (cross match):", err.message);
        });
      }
    };

    socket.off("new_notification"); // מבטיחים שאין כפילויות
    socket.on("new_notification", handleNewNotification);
    socket.off("cross_request_match");
    socket.on("cross_request_match", handleCrossMatch);

    // ניקוי מאזין בעת unmount
    return () => {
      socket.off("new_notification", handleNewNotification);
      socket.off("cross_request_match", handleCrossMatch);
    };
  }, [user, fetchUnreadCount]);
  //   if (socket && !socket.hasListeners?.("new_notification")) {
  //     socket.on("new_notification", () => {
  //       fetchUnreadCount();
  //       if (user.notification_enabled) {
  //         audio.currentTime = 0;
  //         audio.play().catch((err) => {
  //           console.warn("🔇 לא ניתן לנגן את הצליל:", err.message);
  //         });
  //       }
  //     });
  //   }

  //   return () => {
  //     socket?.off("new_notification");
  //   };
  // }, [user, fetchUnreadCount]);

  return {
    unreadCount,
    loading,
    notifications,
    loadingNotifications,
    fetchNotifications,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    fetchUnreadCount,
  };
};
