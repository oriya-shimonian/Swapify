// import { useEffect, useState } from "react";
// import axios from "axios";
// import { IUser } from "@/types/type";
// import { notificationRoutes } from "@/settings";
// import { connectSocket, getSocket } from "@/lib/socket";

// export const useNotifications = (user?: IUser | null) => {
//   const [unreadCount, setUnreadCount] = useState<number>(0);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     if (user) {
//       fetchUnreadCount();

//       const socket = connectSocket(user.user_id);

//       socket.on("new_notification", (data: any) => {
//         console.log("📬 התראה חדשה בזמן אמת:", data);
//         fetchUnreadCount();
//       });

//       return () => {
//         socket.off("new_notification");
//       };
//     }
//   }, [user]);

//   const fetchUnreadCount = async () => {
//     try {
//       const res = await axios.get(notificationRoutes.getUnreadCount, {
//         headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
//       });
//       setUnreadCount(res.data.count);
//     } catch (error) {
//       console.error("שגיאה בשליפת מספר התראות:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return { unreadCount, loading, refetchUnreadCount: fetchUnreadCount };
// };
import { useEffect, useState } from "react";
import axios from "axios";
import { IUser } from "@/types/type";
import { notificationRoutes } from "@/settings";
import { getSocket } from "@/lib/socket"; // ✅

export const useNotifications = (user?: IUser | null) => {
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  const audio = new Audio("/sounds/swapify-notifications-sound.mp3");
  const fetchUnreadCount = async () => {
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
  };

  useEffect(() => {
    if (!user) return;

    fetchUnreadCount();

    const socket = getSocket(); // 🧠 שימוש ב־getSocket (ולא יצירה מחדש)
    
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
  }, [user]);

  return { unreadCount, loading, refetchUnreadCount: fetchUnreadCount };
};
