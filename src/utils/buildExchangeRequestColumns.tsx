import { Column } from "@/components/table/GenericTable";
import { IExchangeRequest, SentExchangeRequest, ReceivedExchangeRequest } from "@/types/exchangeRequest";
import { getAvailabilityBadge, getStatusBadge } from "@/utils/BadgeUtils";
import { format } from "date-fns";
import {
  ProductCategory,
  productCategoryLabels,
  subcategoryMaps,
} from "@/types/products";

export function buildExchangeRequestColumns(
  type: "sent" | "received",
  onImageClick: (imageUrl: string) => void,
  onEditClick?: (requestId: number) => void,
  onDeleteClick?: (requestId: number) => void,
  toggleExpand?: (requestId: number) => void,
  expandedRows?: number[]
): Column<IExchangeRequest>[] {
  const baseColumns: Column<IExchangeRequest>[] = [
    {
      label: "תמונה",
      width: "col-span-1",
      renderCell: (req) =>
        req.requested_product?.image_url ? (
          <img
            src={req.requested_product.image_url}
            alt="מוצר"
            className="w-14 h-14 object-cover rounded cursor-pointer"
            onClick={() => onImageClick(req.requested_product!.image_url!)}
          />
        ) : (
          <div className="w-14 h-14 bg-gray-200 rounded flex items-center justify-center">
            אין תמונה
          </div>
        ),
    },
    {
      label: "שם מוצר",
      width: "col-span-2",
      renderCell: (req) => (
        <span
          className="font-semibold cursor-pointer underline"
          onClick={() => {
            const id = req.requested_product?.product_id;
            if (id) window.open(`/product/${id}`, "_self");
          }}
        >
          {req.requested_product?.title ?? "ללא שם"}
        </span>
      ),
    },
    {
      label: type === "sent" ? "שם בעל המוצר" : "שם מבקש",
      renderCell: (req) =>
        req.type === "sent"
          ? (req as SentExchangeRequest).owner_name
          : (req as ReceivedExchangeRequest).requester_name,
    },
    {
      label: "קטגוריה",
      renderCell: (req) =>
        req.requested_product?.category
          ? productCategoryLabels[
              req.requested_product.category as ProductCategory
            ]
          : "-",
    },
    {
      label: "תת קטגוריה",
      renderCell: (req) =>
        // @ts-ignore
        subcategoryMaps[req.requested_product?.category]?.toLabel?.[req.requested_product?.subcategory] ?? "-",
    },
    {
      label: "מיקום",
      renderCell: (req) => req.requested_product?.location ?? "-",
    },
    {
      label: "זמינות",
      renderCell: (req) =>
        getAvailabilityBadge(req.requested_product?.availability),
    },
    {
      label: "סטטוס",
      renderCell: (req) => getStatusBadge(req.status),
    },
    {
      label: "תאריך",
      renderCell: (req) => format(new Date(req.created_at), "dd/MM/yyyy"),
    },
  ];

  const actionColumn: Column<IExchangeRequest> = {
    label: "פעולות",
    renderCell: (req) =>
      req.type === "sent" ? (
        <div className="flex gap-2">
          <button
            title="ערוך"
            onClick={() => onEditClick?.(req.request_id)}
            className="text-blue-500"
          >
            ✏️
          </button>
          <button
            title="מחק"
            onClick={() => onDeleteClick?.(req.request_id)}
            className="text-red-500"
          >
            🗑️
          </button>
        </div>
      ) : (
        <button
          title="הצג הצעות"
          onClick={() => toggleExpand?.(req.request_id)}
        >
          {expandedRows?.includes(req.request_id) ? "▲" : "▼"}
        </button>
      ),
  };

  return [...baseColumns, actionColumn];
}
