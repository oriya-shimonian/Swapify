import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { IExchangeRequest } from "@/types/exchangeRequest";
import { getStatusBadge, getAvailabilityBadge } from "@/utils/BadgeUtils";
import { format } from "date-fns";
import { FaEdit } from "react-icons/fa";
import { GoTrash } from "react-icons/go";

interface RequestsTableProps {
  requests: IExchangeRequest[];
  onImageClick: (imageUrl: string) => void;
  onEditClick?: (requestId: number) => void;
  onDeleteClick?: (requestId: number) => void;
  type: "sent" | "received"; // מציין האם זה בקשות ששלחתי או שהתקבלו
}

export function RequestsTable({
  requests,
  onImageClick,
  onEditClick,
  onDeleteClick,
  type,
}: RequestsTableProps) {
  const columns = type === "sent" ? sentColumns : receivedColumns;

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
              {type === "sent" ? (
                <>
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
                </>
              ) : (
                <>
                  <button
                    className="text-green-600 font-bold"
                    onClick={() => {
                      // future: openApproveDialog(req.request_id)
                    }}
                  >
                    אשר
                  </button>
                  <button
                    className="text-red-600 font-bold"
                    onClick={() => {
                      // future: rejectRequest(req.request_id)
                    }}
                  >
                    דחה
                  </button>
                </>
              )}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

// 🔵 בסיס עמודות שחוזר
const baseColumns = [
  { key: "image", label: "תמונה" },
  { key: "title", label: "שם מוצר" },
  { key: "category", label: "קטגוריה" },
  { key: "subcategory", label: "תת קטגוריה" },
  { key: "location", label: "מיקום" },
  { key: "availability", label: "זמינות" },
  { key: "status", label: "סטטוס" },
  { key: "createdAt", label: "תאריך" },
] as const;

// 🔵 עמודות לבקשות ששלחתי
const sentColumns = [
  ...baseColumns.slice(0, 2),
  ...baseColumns.slice(2),
  { key: "offered", label: "מוצרים שהצעתי להחלפה" }, 
] as const;

// 🔵 עמודות לבקשות שהתקבלו
const receivedColumns = [
  ...baseColumns.slice(0, 2),
  { key: "requester", label: "שם מבקש" }, 
  ...baseColumns.slice(2),
  { key: "offered", label: "מוצרים שהוצעו להחלפה" }, 
] as const;

// 🔵 פונקציה לפתיחת עמוד מוצר
function openProductPage(productId: number) {
  window.open(`/product/${productId}`, "_self");
}

// 🔵 רינדור תא בטבלה
function renderCell(
  key: string,
  req: IExchangeRequest,
  onImageClick: (imageUrl: string) => void
) {
  const product = req.requested_product;

  const fieldMap: Record<string, string | undefined> = {
    category: product?.category,
    subcategory: product?.subcategory ?? undefined,
    location: product?.location ?? undefined,
    createdAt: format(new Date(req.created_at), "dd/MM/yyyy"),
    requester: (req as any).requester_name, // מתייחס ל-received
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
              openProductPage(product.product_id);
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
      return req.offered_products.length
        ? req.offered_products.map((p, idx) => (
            <div
              key={idx}
              className="text-blue-500 cursor-pointer underline"
              onClick={() => openProductPage(p.product_id)}
            >
              {p.title}
            </div>
          ))
        : "-";
    default:
      return null;
  }
}
