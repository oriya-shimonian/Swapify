import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import React from "react";

export type Notification = {
  notification_id: number;
  type: string;
  status: string;
  message: string;
  created_at: string;
  link: string;
};

type Props = {
  notification: Notification;
  onClick: () => void;
  isDimmed?: boolean;
  ref?: React.Ref<HTMLDivElement>;
};

const getTypeColor = (type: string) => {
  const colors = {
    new_request: "from-purple-500 to-blue-500",
    approved: "from-green-500 to-emerald-400",
    auto_rejected: "from-red-500 to-pink-500",
    completed: "from-teal-500 to-cyan-400",
    cancelled: "from-yellow-500 to-amber-400",
    match_found: "from-pink-500 to-pink-300",
  };
  return colors[type as keyof typeof colors] || "from-blue-500 to-purple-500";
};

export const NotificationCard = React.forwardRef<HTMLDivElement, Props>(
  ({ notification, onClick, isDimmed = false }, ref) => {
    return (
      <motion.div
        ref={ref}
        className={cn(
          "relative overflow-hidden p-5 border border-gray-100 dark:border-zinc-700 rounded-xl bg-white dark:bg-zinc-800 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer group",
          isDimmed && "opacity-50"
        )}
        onClick={onClick}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        whileHover={{ scale: 1.01 }}
      >
        <div
          className={`absolute inset-0 bg-gradient-to-r ${getTypeColor(
            notification.type
          )} opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl -z-10 blur-sm`}
        ></div>

        <div className="flex items-center justify-between">
          <div className="text-base font-medium text-gray-800 dark:text-gray-100">
            {notification.message}
          </div>
          {notification.status === "Unread" && (
            <span className="text-xs bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-full px-3 py-1 ml-2 font-semibold">
              לא נקרא
            </span>
          )}
        </div>
        <div className="text-xs text-gray-500 dark:text-gray-400 mt-2 flex items-center">
          <span className="bg-gray-100 dark:bg-zinc-700 px-2 py-1 rounded-md">
            {format(new Date(notification.created_at), "dd/MM/yyyy HH:mm")}
          </span>
        </div>
      </motion.div>
    );
  }
);

NotificationCard.displayName = "NotificationCard";