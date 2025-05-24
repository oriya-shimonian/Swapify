import { createContext, useContext } from "react";
import { Notification } from "@/types/notifications";
import { IUser } from "@/types/type";
import { useNotifications } from "@/hooks/useNotifications";

interface NotificationsContextProps {
  unreadCount: number;
  notifications: Notification[];
  loading: boolean;
  loadingNotifications: boolean;
  fetchUnreadCount: () => Promise<void>;
  fetchNotifications: (limit?: number, offset?: number) => Promise<Notification[]>;
  markNotificationAsRead: (id: number) => Promise<void>;
  markAllNotificationsAsRead: () => Promise<void>;
//   fetchUnreadCount: () => Promise<void>; // ✅ נוספה כדי לתאם עם מה ש־hook מחזיר
}

const NotificationsContext = createContext<NotificationsContextProps | undefined>(undefined);

export function NotificationsProvider({ user, children }: { user: IUser; children: React.ReactNode }) {
  const value = useNotifications(user); // ✔️ שימוש ב-hook במקום כפילות לוגיקה

  return (
    <NotificationsContext.Provider value={value}>
      {children}
    </NotificationsContext.Provider>
  );
}

export function useNotificationsContext() {
  const ctx = useContext(NotificationsContext);
  if (!ctx) throw new Error("useNotificationsContext must be used within NotificationsProvider");
  return ctx;
}