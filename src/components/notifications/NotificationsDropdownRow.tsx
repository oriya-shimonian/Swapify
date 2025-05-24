// NotificationsDropdownRow.tsx
import { cn } from "@/lib/utils";
import { Bell, CheckCheck } from "lucide-react";
import { Notification } from "@/types/notifications";

export function NotificationsDropdownRow({
  notification,
  onClick,
}: {
  notification: Notification;
  onClick: () => void;
}) {
  const getIcon = (type: string) => {
    switch (type) {
      case "new_request":
        return <Bell className="w-4 h-4 text-blue-500" />;
      case "approved":
        return <CheckCheck className="w-4 h-4 text-green-500" />;
      case "auto_rejected":
        return <Bell className="w-4 h-4 text-yellow-500" />;
      case "completed":
        return <CheckCheck className="w-4 h-4 text-purple-500" />;
      case "cancelled":
        return <Bell className="w-4 h-4 text-red-500" />;
      case "match_found":
        return <Bell className="w-4 h-4 text-pink-500" />;
      default:
        return <Bell className="w-4 h-4 text-gray-400" />;
    }
  };

  return (
    <div
      onClick={onClick}
      className={cn(
        "cursor-pointer px-4 py-3 border-b border-gray-100 dark:border-zinc-700 flex gap-2 items-start hover:bg-gray-50 dark:hover:bg-zinc-700 transition",
        notification.status === "Unread" &&
          "bg-blue-50 dark:bg-zinc-700/60 border-r-4 border-blue-500"
      )}
    >
      {getIcon(notification.type)}
      <div>
        <p className="text-sm font-medium text-gray-800 dark:text-gray-100">
          {notification.message}
        </p>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
          {new Date(notification.created_at).toLocaleString("he-IL")}
        </p>
      </div>
    </div>
  );
}
