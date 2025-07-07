import { useEffect, useState } from "react";
import { IExchangeRequest } from "@/types/exchangeRequest";
import {
  Calendar,
  Edit3,
  MapPin,
  Trash2,
  User,
  Eye,
  Package,
  Tag,
  Info,
} from "lucide-react";
import { getAvailabilityBadge, getStatusBadge } from "@/utils/BadgeUtils";
import { getProductCategoryLabel, getSubcategoryLabel } from "@/types/products";

interface RequestsCardsListProps {
  requests: IExchangeRequest[];
  onImageClick: (imageUrl: string) => void;
  onEditClick?: (requestId: number) => void;
  onDeleteClick?: (requestId: number) => void;
  onApproveClick?: (request: IExchangeRequest, productId: number) => void;
  onRejectClick?: (request: IExchangeRequest) => void;
  AutomaticRejection?: (request: IExchangeRequest) => void;
  type: "sent" | "received";
}

export function RequestsCardsList({
  requests,
  onImageClick,
  onEditClick,
  onDeleteClick,
  onApproveClick,
  onRejectClick,
  AutomaticRejection,
  type,
}: RequestsCardsListProps) {
  const [expandedRows, setExpandedRows] = useState<number[]>([]);

  useEffect(() => {
    const hash = window.location.hash;
    if (hash?.startsWith("#request-")) {
      const id = Number(hash.replace("#request-", ""));
      setExpandedRows([id]);
      const el = document.getElementById(`request-${id}`);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "center" });
        el.classList.add("pulse-highlight");
        setTimeout(() => el.classList.remove("pulse-highlight"), 2000);
      }
    }
  }, [requests]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("he-IL");
  };

  const parseLocation = (location?: string) => {
    if (!location) return "-";
    if (location.startsWith("{")) {
      return location
        .replace(/[{}"\s]/g, "")
        .split(",")
        .join(", ");
    }
    return location;
  };

  return (
    <div className="grid gap-4">
      {requests.map((request) => {
        const product = request.requested_product;
        const isUnavailable = product?.availability === "Unavailable";

        return (
          <div
            key={request.request_id}
            id={`request-${request.request_id}`}
            className={`relative bg-white rounded-xl border shadow-sm transition overflow-hidden ${
              isUnavailable
                ? "border-gray-300 opacity-80"
                : "border-gray-100 hover:shadow-md"
            }`}
          >
            <div className="p-4 md:flex gap-4 items-start">
              {/* Image */}
              <div className="flex justify-between">
                {product?.image_url ? (
                  <div className="relative group w-20 h-20">
                    <img
                      src={product.image_url}
                      alt={product.title || "מוצר"}
                      className="w-20 h-20 object-cover rounded-lg cursor-pointer"
                      onClick={() => onImageClick(product.image_url!)}
                    />
                    <div className="absolute inset-0 rounded-lg bg-black/10 opacity-0 group-hover:opacity-100 flex items-center justify-center transition">
                      <Eye className="w-5 h-5 text-white" />
                    </div>
                  </div>
                ) : (
                  <div className="w-20 h-20 bg-gray-100 rounded-lg flex items-center justify-center">
                    <Package className="w-6 h-6 text-gray-400" />
                  </div>
                )}

              <div className="flex items-center gap-2">
                {(type === "sent" && request.status === "Pending") && (
                  <>
                    <button
                      onClick={() => onEditClick?.(request.request_id)}
                      title="ערוך"
                      className="text-blue-600 hover:bg-blue-50 p-2 rounded"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onDeleteClick?.(request.request_id)}
                      title="בטל בקשה"
                      className="text-red-600 hover:bg-red-50 p-2 rounded"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </>
                )}
              </div>
              </div>


              {/* Info */}
              <div className="flex-1 space-y-1">
                <div className="flex justify-between items-start">
                  <h3
                    className="text-base font-semibold cursor-pointer text-gray-900 hover:text-purple-600 transition-colors"
                    onClick={() => {
                      if (product?.product_id) {
                        window.open(`/product/${product.product_id}`, "_self");
                      }
                    }}
                  >
                    {product?.title || "ללא שם"}
                  </h3>
                </div>

                <div className="text-sm text-gray-600 flex flex-wrap gap-4">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    {formatDate(request.created_at)}
                  </div>
                  <div className="flex items-center gap-1">
                    <User className="w-4 h-4" />
                    {request.type === "sent"
                      ? `בעל המוצר: ${request.owner_name || "-"}`
                      : `מבקש: ${request.requester_name || "-"}`}
                  </div>
                  {product?.location && (
                    <div className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      {parseLocation(product.location)}
                    </div>
                  )}
                </div>

                <div className="text-sm text-gray-700 flex flex-wrap gap-4 pt-1">
                  {product?.category && (
                    <div className="flex items-center gap-1">
                      <Tag className="w-4 h-4" />
                      קטגוריה: {getProductCategoryLabel(product.category)}
                    </div>
                  )}
                  {product?.subcategory && (
                    <div className="flex items-center gap-1">
                      <span className="text-gray-500">תת־קטגוריה:</span>
                      {getSubcategoryLabel(
                        product.category,
                        product.subcategory
                      )}
                    </div>
                  )}
                  {product?.condition && (
                    <div className="flex items-center gap-1">
                      <Package className="w-4 h-4" />
                      מצב: {product.condition === "New" ? "חדש" : "משומש"}
                    </div>
                  )}
                </div>

                <div className="flex gap-2 items-center pt-2">
                  {getAvailabilityBadge(product?.availability)}
                  {getStatusBadge(request.status)}
                </div>

                {isUnavailable && (
                  <div className="mt-3 flex items-center gap-2 bg-red-50 text-red-700 text-sm px-3 py-2 rounded-md border border-red-200">
                    <Info className="w-4 h-4" />
                    מוצר זה אינו זמין יותר להחלפה
                  </div>
                )}

                {type === "sent" && request.offered_products.length > 0 && (
                  <div className="pt-3">
                    <span className="text-sm font-medium text-gray-700">
                      מוצרים שהצעתי:
                    </span>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {request.offered_products.map((p) => (
                        <button
                          key={p.product_id}
                          className="text-sm bg-indigo-50 text-indigo-700 px-3 py-1 rounded hover:bg-indigo-100"
                          onClick={() =>
                            window.open(`/product/${p.product_id}`, "_self")
                          }
                        >
                          {p.title}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {type === "received" &&
                  expandedRows.includes(request.request_id) && (
                    <div className="pt-4">
                      <div className="flex flex-wrap gap-3">
                        <button
                          onClick={() =>
                            onApproveClick?.(request, product?.product_id || 0)
                          }
                          className="bg-green-600 hover:bg-green-700 text-white text-sm font-medium px-4 py-2 rounded"
                        >
                          אשר בקשה
                        </button>
                        <button
                          onClick={() => onRejectClick?.(request)}
                          className="bg-red-600 hover:bg-red-700 text-white text-sm font-medium px-4 py-2 rounded"
                        >
                          דחה בקשה
                        </button>
                        <button
                          onClick={() => AutomaticRejection?.(request)}
                          className="bg-gray-500 hover:bg-gray-600 text-white text-sm font-medium px-4 py-2 rounded"
                        >
                          דחייה אוטומטית
                        </button>
                      </div>
                    </div>
                  )}
              </div>
            </div>
          </div>
        );
      })}

      {requests.length === 0 && (
        <div className="text-center py-12 text-gray-500 text-sm">
          {type === "sent"
            ? "אין בקשות שנשלחו עדיין"
            : "אין בקשות שהתקבלו עדיין"}
        </div>
      )}
    </div>
  );
}
