import { useEffect, useState } from "react";
import { useNotificationsContext  } from "@/context/NotificationsContext";
import { DateRangePicker } from "@/components/DateRangePicker";
import {
  Filters,
} from "@/components/UserDashboard/exchangeTabsHelpers/Filters";
import { NotificationCard } from "@/components/notifications/NotificationCard";
import { useInfiniteScroll } from "@/hooks/useInfiniteScroll";
import { Notification, NUM_NOTIFICATIONS_IN_PAGE } from "@/types/notifications";
import { InfiniteScrollList } from "@/components/InfiniteScrollList";
import { filterFields } from "@/lib/filters/notifications";

export default function NotificationsPage() {
  const {
    notifications,
    fetchNotifications,
    loadingNotifications,
    markNotificationAsRead,
    markAllNotificationsAsRead,
  } = useNotificationsContext();

  const [filters, setFilters] = useState({
    type: null,
    status: null,
    message: "",
    fromDate: "",
    toDate: "",
  });
  const [clickedId, setClickedId] = useState<number | null>(null);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [isFetchingMore, setIsFetchingMore] = useState(false);

  const resetPage = () => {};

  useEffect(() => {
    setIsFetchingMore(true);
    fetchNotifications(
      NUM_NOTIFICATIONS_IN_PAGE,
      page * NUM_NOTIFICATIONS_IN_PAGE
    ).then((newData) => {
      if (!newData || newData.length < NUM_NOTIFICATIONS_IN_PAGE) {
        setHasMore(false);
      }
      setIsFetchingMore(false);
    });
  }, [page]);

  const filtered = notifications.filter((n: Notification) => {
    const matchType = filters.type ? n.type === filters.type : true;
    const matchStatus = filters.status ? n.status === filters.status : true;
    const matchText = filters.message
      ? n.message?.toLowerCase().includes(filters.message.toLowerCase())
      : true;
    const created = new Date(n.created_at);
    const matchFromDate = filters.fromDate
      ? created >= new Date(filters.fromDate)
      : true;
    const matchToDate = filters.toDate
      ? created <= new Date(filters.toDate + "T23:59:59")
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

  const lastNotificationRef = useInfiniteScroll({
    isFetching: isFetchingMore,
    hasMore,
    onLoadMore: () => setPage((prev) => prev + 1),
  });

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

      <InfiniteScrollList
        items={filtered}
        renderItem={(n: Notification, isLast) => (
          <NotificationCard
            key={n.notification_id}
            notification={n}
            onClick={() => handleClick(n.notification_id, n.link)}
            isDimmed={clickedId === n.notification_id}
            ref={isLast ? lastNotificationRef : undefined}
          />
        )}
        isFetching={isFetchingMore}
        hasMore={hasMore}
      />

      {filtered.length === 0 && !loadingNotifications && !isFetchingMore && (
        <div className="text-center text-sm text-gray-500 dark:text-gray-400 pt-4">
          לא נמצאו התראות התואמות לסינון.
        </div>
      )}
    </div>
  );
}