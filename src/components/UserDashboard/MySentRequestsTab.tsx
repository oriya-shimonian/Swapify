import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useExchangeRequest } from "@/hooks/useExchangeRequest";
import { IExchangeRequest } from "@/types/exchangeRequest";
import { sentRequestFilters } from "@/lib/filters/exchangeRequestFilters";
import { filterRequests } from "@/utils/filterRequests";
import toast from "react-hot-toast";
import { SkeletonTable } from "./exchangeTabsHelpers/SkeletonTable";
import { Filters } from "./exchangeTabsHelpers/Filters";
import { RequestsTable } from "./exchangeTabsHelpers/RequestsTable";
import { Pagination } from "./exchangeTabsHelpers/Pagination";
import ImageDialog from "@/components/dialogs/ImageDialog";
import AppDialog from "@/components/AppDialog";
import ExchangeRequestDialog from "../dialogs/ExchangeRequestDialog";

const ITEMS_PER_PAGE = 12;

export default function MySentRequestsTab() {
  const { user } = useAuth();
  const { getUserRequests, updateExchangeRequestProposalOptions, cancelMyRequest } = useExchangeRequest();

  const [requests, setRequests] = useState<IExchangeRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [modalImage, setModalImage] = useState<string | null>(null);
  const [editingRequest, setEditingRequest] = useState<IExchangeRequest | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [confirmDeleteDialog, setConfirmDeleteDialog] = useState<{ open: boolean; id: number | null }>({ open: false, id: null });
  const [filters, setFilters] = useState({
    searchTerm: "",
    category: null as string | null,
    subcategory: null as string | null,
    location: "",
    availability: null as string | null,
    status: null as string | null,
    offeredProduct: "",
    owner_name: "",
  });

  useEffect(() => {
    if (!user?.user_id) return;
    setLoading(true);
    getUserRequests(user.user_id)
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

  const fetchRequests = () => {
    if (!user?.user_id) return;
    getUserRequests(user.user_id).then((data) => setRequests(data));
  };

  const handleDelete = async (id: number) => {
    if (!user) return;
    const request = requests.find(r => r.request_id === id);
    if (!request) return;

    if (request.status !== "Pending") {
      toast.error("ניתן לבטל רק בקשות ממתינות.");
      return;
    }

    setConfirmDeleteDialog({ open: true, id });
  };

  const confirmDelete = async () => {
    if (!user || confirmDeleteDialog.id === null) return;
    try {
      await cancelMyRequest(confirmDeleteDialog.id, user.user_id, user.name);
      toast.success("הבקשה בוטלה בהצלחה.");
      fetchRequests();
    } catch {
      toast.error("שגיאה בביטול הבקשה.");
    } finally {
      setConfirmDeleteDialog({ open: false, id: null });
    }
  };

  return (
    <div className="p-6 min-w-96">
      <h1 className="text-2xl font-bold mb-4">בקשות ששלחתי</h1>

      <Filters
        filters={filters}
        setFilters={setFilters}
        resetPage={() => setCurrentPage(1)}
        fields={sentRequestFilters}
      />

      {loading ? (
        <SkeletonTable />
      ) : filteredRequests.length === 0 ? (
        <p className="text-center text-gray-500">לא נמצאו בקשות תואמות.</p>
      ) : (
        <RequestsTable
          requests={paginatedRequests}
          onImageClick={setModalImage}
          type="sent"
          onEditClick={(id) => {
            const req = requests.find(r => r.request_id === id);
            if (req) {
              setEditingRequest(req);
              setDialogOpen(true);
            }
          }}
          onDeleteClick={handleDelete}
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

       {editingRequest && (
        <ExchangeRequestDialog
          open={dialogOpen}
          productId={editingRequest.product_id}
          mode="edit"
          initialSelectedIds={editingRequest.offered_products.map(
            (p) => p.product_id
          )}
          onClose={() => {
            setDialogOpen(false);
            setEditingRequest(null);
          }}
          onEditConfirm={(newIds) =>
            updateExchangeRequestProposalOptions(editingRequest.request_id, newIds, fetchRequests)
          }
          
        />
      )}

      <AppDialog
        open={confirmDeleteDialog.open}
        title="האם את/ה בטוח/ה שברצונך לבטל בקשה זו?"
        description="ברגע שתבטל/י את הבקשה, היא תימחק לחלוטין ולא תוכל/י לשחזר אותה."
        confirmText="בטל בקשה"
        cancelText="חזרה"
        confirmVariant="destructive"
        onCancel={() => setConfirmDeleteDialog({ open: false, id: null })}
        onConfirm={confirmDelete}
      />
    </div>
  );
}
