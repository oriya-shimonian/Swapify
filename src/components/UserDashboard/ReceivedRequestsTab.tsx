import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useExchangeRequest } from "@/hooks/useExchangeRequest";
import { IExchangeRequest } from "@/types/exchangeRequest";
import { receivedRequestFilters } from "@/lib/filters/exchangeRequestFilters";
import { filterRequests } from "@/utils/filterRequests";
import toast from "react-hot-toast";
import ImageDialog from "@/components/dialogs/ImageDialog";
import AppDialog from "@/components/AppDialog";
import { Filters } from "./exchangeTabsHelpers/Filters";
import { SkeletonTable } from "./exchangeTabsHelpers/SkeletonTable";
import { RequestsTable } from "./exchangeTabsHelpers/RequestsTable";
import { Pagination } from "./exchangeTabsHelpers/Pagination";
import { useLocation } from "react-router-dom";
// import { DateRangePicker } from "../DateRangePicker";

const ITEMS_PER_PAGE = 12;

export default function MyReceivedRequestsTab() {
  const { user } = useAuth();
  const { getIncomingRequests, approveRequest, rejectOfferedRequest } =
    useExchangeRequest();
  const location = useLocation();
  const [requests, setRequests] = useState<IExchangeRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [modalImage, setModalImage] = useState<string | null>(null);
  const [confirmDialog, setConfirmDialog] = useState<{
    open: boolean;
    title: string;
    description?: string;
    onConfirm: () => void;
  } | null>(null);
  const [filters, setFilters] = useState({
    searchTerm: "",
    category: null as string | null,
    subcategory: null as string | null,
    location: "",
    availability: null as string | null,
    status: null as string | null,
    offeredProduct: "",
    requesterName: "",
  });

  useEffect(() => {
    if (!user?.user_id) return;
    setLoading(true);
    getIncomingRequests(user.user_id)
      .then((data) => setRequests(data))
      .catch(() => toast.error("שגיאה בטעינת הבקשות"))
      .finally(() => setLoading(false));
  }, [user?.user_id]);

  useEffect(() => {
    const hash = location.hash; // למשל: #request-2
    if (hash) {
      const el = document.querySelector(hash);
      if (el) {
        // ✨ גלילה חלקה למרכז
        el.scrollIntoView({ behavior: "smooth", block: "center" });

        // ✨ הדגשת רקע מורגשת (ולא הבהוב רגעי)
        el.classList.add("animate-pulse-highlight");

        const timeout = setTimeout(() => {
          el.classList.remove("animate-pulse-highlight");
        }, 3000); // נשאר ל־3 שניות

        return () => clearTimeout(timeout);
      }
    }
  }, [location.hash]);

  const filteredRequests = filterRequests(requests, filters);
  const totalPages = Math.ceil(filteredRequests.length / ITEMS_PER_PAGE);
  const paginatedRequests = filteredRequests.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handleApprove = async (
    request: IExchangeRequest,
    chosen_product_id: number
  ) => {
    if (!user) return;
    try {
      await approveRequest(
        request.request_id,
        chosen_product_id,
        request.user_id,
        user.name
      );
      toast.success("הבקשה אושרה בהצלחה");
      getIncomingRequests(user.user_id).then(setRequests);
    } catch {
      toast.error("שגיאה באישור הבקשה");
    }
  };
  const [isRequestDeleted, setIsRequestDeleted] = useState(false);
  async function handleDelete(request: IExchangeRequest) {
    if (!user) return;
    try {
      await rejectOfferedRequest(request.request_id, user.user_id, user.name);
      setIsRequestDeleted(true);

      setRequests((prev) =>
        prev.map((r) =>
          r.request_id === request.request_id ? { ...r, status: "Rejected" } : r
        )
      );
    } catch {
      setIsRequestDeleted(false);
    } finally {
      setConfirmDialog(null);
    }
  }

  const handleReject = (request: IExchangeRequest) => {
    setConfirmDialog({
      open: true,
      title: "האם את/ה בטוח/ה שברצונך לדחות את הבקשה?",
      description: "לא תוכל/י לאשר אותה שוב לאחר מכן.",
      onConfirm: () => handleDelete(request),
    });
    if (isRequestDeleted) {
      toast.success("הבקשה נדחתה");
    } else {
      toast.error("שגיאה בדחיית הבקשה");
    }
  };

  return (
    <div className="p-6 min-w-96">
      {/* <h1 className="text-2xl font-bold mb-4">בקשות שהתקבלו</h1> */}

      <div className="bg-white rounded-xl dark:bg-white/5 dark:backdrop-blur-mdshadow-sm border border-gray-100 p-6 mb-8 pb-0">
        <div className="flex flex-wrap gap-4 items-end">
          <div className="flex-1 min-w-[200px]">
            <Filters
              filters={filters}
              setFilters={setFilters}
              resetPage={() => setCurrentPage(1)}
              fields={receivedRequestFilters}
            />
          </div>

          {/* <div className="min-w-[200px] self-baseline">
                  <DateRangePicker
                    fromDate={filters.fromDate ?? ""}
                    toDate={filters.toDate ?? ""}
                    onChange={(from, to) =>
                      setFilters((prev) => ({ ...prev, fromDate: from, toDate: to }))
                    }
                  />
                </div> */}
        </div>
      </div>

      {loading ? (
        <SkeletonTable />
      ) : filteredRequests.length === 0 ? (
        <p className="text-center text-gray-500">לא נמצאו בקשות תואמות.</p>
      ) : (
        <RequestsTable
          requests={paginatedRequests}
          onImageClick={setModalImage}
          onApproveClick={handleApprove}
          onRejectClick={handleReject}
          AutomaticRejection={handleDelete}
          type="received"
        />
      )}

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />

      {modalImage && (
        <ImageDialog
          imageUrl={modalImage}
          onClose={() => setModalImage(null)}
        />
      )}

      {confirmDialog?.open && (
        <AppDialog
          open={confirmDialog.open}
          title={confirmDialog.title}
          description={confirmDialog.description}
          onCancel={() => setConfirmDialog(null)}
          onConfirm={confirmDialog.onConfirm}
          confirmText="כן, דחה"
          cancelText="ביטול"
          confirmVariant="destructive"
        />
      )}
    </div>
  );
}
