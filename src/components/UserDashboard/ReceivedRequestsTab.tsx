// 📁 components/MyReceivedRequestsTab.tsx

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useExchangeRequest } from "@/hooks/useExchangeRequest";
import { IExchangeRequest } from "@/types/exchangeRequest";
import { receivedRequestFilters } from "@/lib/filters/exchangeRequestFilters";
import { filterRequests } from "@/utils/filterRequests";
import toast from "react-hot-toast";
import ImageDialog from "@/components/dialogs/ImageDialog";
import { Filters } from "./exchangeTabsHelpers/Filters";
import { SkeletonTable } from "./exchangeTabsHelpers/SkeletonTable";
import { RequestsTable } from "./exchangeTabsHelpers/RequestsTable";
import { Pagination } from "./exchangeTabsHelpers/Pagination";

const ITEMS_PER_PAGE = 12;

export default function MyReceivedRequestsTab() {
  const { user } = useAuth();
  const { getIncomingRequests } = useExchangeRequest();

  const [requests, setRequests] = useState<IExchangeRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [modalImage, setModalImage] = useState<string | null>(null);
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

  const filteredRequests = filterRequests(requests, filters);
  const totalPages = Math.ceil(filteredRequests.length / ITEMS_PER_PAGE);
  const paginatedRequests = filteredRequests.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <div className="p-6 min-w-96">
      <h1 className="text-2xl font-bold mb-4">בקשות שהתקבלו</h1>

      <Filters
        filters={filters}
        setFilters={setFilters}
        resetPage={() => setCurrentPage(1)}
        fields={receivedRequestFilters}
      />

      {loading ? (
        <SkeletonTable />
      ) : filteredRequests.length === 0 ? (
        <p className="text-center text-gray-500">לא נמצאו בקשות תואמות.</p>
      ) : (
        <RequestsTable
          requests={paginatedRequests}
          onImageClick={setModalImage}
          type="received"
        />
      )}

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />

      {modalImage && (
        <ImageDialog imageUrl={modalImage} onClose={() => setModalImage(null)} />
      )}
    </div>
  );
}
