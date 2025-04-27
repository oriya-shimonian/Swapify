import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { IExchangeRequest } from "@/types/exchangeRequest";
import { getStatusBadge, getAvailabilityBadge } from "../../../utils/BadgeUtils";
import { format } from "date-fns";
import { FaEdit } from "react-icons/fa";
import { GoTrash } from "react-icons/go";

interface RequestsTableProps {
  requests: IExchangeRequest[];
  onImageClick: (imageUrl: string) => void;
  onEditClick?: (requestId: number) => void;
  onDeleteClick?: (requestId: number) => void;
}

export function RequestsTable({ requests, onImageClick, onEditClick, onDeleteClick }: RequestsTableProps) {
  return (
    <Table className="text-sm">
      <TableHeader>
        <TableRow>
          {columns.map((col) => (
            <TableHead key={col.key}>{col.label}</TableHead>
          ))}
          <TableHead>פעולות</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {requests.map((req) => (
          <TableRow key={req.request_id}>
            {columns.map((col) => (
              <TableCell key={col.key}>
                {renderCell(col.key, req, onImageClick)}
              </TableCell>
            ))}
            <TableCell className="flex gap-2">
              <FaEdit
                className="cursor-pointer text-blue-500"
                title="ערוך"
                size={18}
                onClick={() => onEditClick?.(req.request_id)}
              />
              <GoTrash
                className="cursor-pointer text-red-500"
                title="בטל בקשה"
                size={18}
                onClick={() => onDeleteClick?.(req.request_id)}
              />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

const columns = [
  { key: "image", label: "תמונה" },
  { key: "title", label: "שם מוצר" },
  { key: "category", label: "קטגוריה" },
  { key: "subcategory", label: "תת קטגוריה" },
  { key: "location", label: "מיקום" },
  { key: "availability", label: "זמינות" },
  { key: "status", label: "סטטוס" },
  { key: "offered", label: "הצעות" },
  { key: "createdAt", label: "תאריך" },
] as const;

function renderCell(
  key: string,
  req: IExchangeRequest,
  onImageClick: (imageUrl: string) => void
) {
  const product = req.requested_product;

  const fieldMap: Record<string, any> = {
    category: product?.category,
    subcategory: product?.subcategory,
    location: product?.location,
    createdAt: format(new Date(req.created_at), "dd/MM/yyyy"),
  };

  if (fieldMap[key] !== undefined) {
    return fieldMap[key] || "-";
  }

  switch (key) {
    case "image":
      return product?.image_url ? (
        <img
          src={product.image_url}
          alt={product.title || "מוצר"}
          className="w-14 h-14 object-cover rounded cursor-pointer"
          onClick={() => onImageClick(product.image_url || "")}
        />
      ) : (
        <div className="w-14 h-14 bg-gray-200 rounded flex items-center justify-center">
          אין תמונה
        </div>
      );
    case "title":
      return (
        <span
          className="font-semibold cursor-pointer"
          onClick={() => {
            if (product?.product_id) {
              window.open(`/product/${product.product_id}`, "_blank");
            }
          }}
        >
          {product?.title ?? "ללא שם"}
        </span>
      );
    case "availability":
      return getAvailabilityBadge(product?.availability);
    case "status":
      return getStatusBadge(req.status);
    case "offered":
      return req.offered_products.length ? (
        req.offered_products.map((p, idx) => (
          <div
            key={idx}
            className="text-blue-500 cursor-pointer underline"
            onClick={() => window.open(`/product/${p.product_id}`, "_blank")}
          >
            {p.title}
          </div>
        ))
      ) : (
        "-"
      );
    default:
      return null;
  }
}
