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
import { ExchangeOfferCards } from "./ExchangeOfferCards";
import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { ProductCategory, productCategoryLabels, subcategoryMaps } from "@/types/products";

interface RequestsTableProps {
  requests: IExchangeRequest[];
  onImageClick: (imageUrl: string) => void;
  onEditClick?: (requestId: number) => void;
  onDeleteClick?: (requestId: number) => void;
  onApproveClick?: (request: IExchangeRequest, productId: number) => void;
  onRejectClick?: (request: IExchangeRequest) => void;
  AutomaticRejection?: (request: IExchangeRequest) => void;
  type: "sent" | "received";
}

export function RequestsTable({
  requests,
  onImageClick,
  onEditClick,
  onDeleteClick,
  onApproveClick,
  onRejectClick,
  AutomaticRejection,
  type,
}: RequestsTableProps) {
  const columns = type === "sent" ? sentColumns : receivedColumns;
  const [expandedRows, setExpandedRows] = useState<number[]>(
    requests.map((r) => r.request_id)
  );

  const toggleExpand = (id: number) => {
    setExpandedRows((prev) =>
      prev.includes(id) ? prev.filter((r) => r !== id) : [...prev, id]
    );
  };

  return (
    <Table className="text-sm text-right">
      <TableHeader>
        <TableRow>
          {columns.map((col) => (
            <TableHead key={col.key}>{col.label}</TableHead>
          ))}
          {type === "sent" && <TableHead>פעולות</TableHead>}
        </TableRow>
      </TableHeader>
      <TableBody>
        {requests.map((req) => (
          <>
            <TableRow key={req.request_id} className="group">
              {columns.map((col) => (
                <TableCell key={col.key}>
                  {renderCell(col.key, req, onImageClick)}
                </TableCell>
              ))}
              <TableCell className="flex items-center gap-2">
                {type === "sent" && (
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
                )}
                {type === "received" && (
                  <button
                    className="ml-auto"
                    onClick={() => toggleExpand(req.request_id)}
                  >
                    {expandedRows.includes(req.request_id) ? (
                      <ChevronUp className="w-4 h-4" />
                    ) : (
                      <ChevronDown className="w-4 h-4" />
                    )}
                  </button>
                )}
              </TableCell>
            </TableRow>

            {type === "received" && expandedRows.includes(req.request_id) && (
              <TableRow>
                <TableCell
                  colSpan={columns.length + 1}
                  className="bg-background"
                >
                  <ExchangeOfferCards
                    request={req}
                    onApprove={onApproveClick!}
                    onReject={onRejectClick!}
                    AutomaticRejection={AutomaticRejection!}
                  />
                </TableCell>
              </TableRow>
            )}
          </>
        ))}
      </TableBody>
    </Table>
  );
}

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

const sentColumns = [
  ...baseColumns.slice(0, 2),
  { key: "owner_name", label: "שם בעל המוצר " },
  ...baseColumns.slice(2),
  { key: "offered", label: "מוצרים שהצעתי להחלפה" },
  
] as const;

const receivedColumns = [
  ...baseColumns.slice(0, 2),
  { key: "requester", label: "שם מבקש" },
  ...baseColumns.slice(2),
] as const;

function openProductPage(productId: number) {
  window.open(`/product/${productId}`, "_self");
}

function renderCell(
  key: string,
  req: IExchangeRequest,
  onImageClick: (imageUrl: string) => void
) {
  const product = req.requested_product;

  console.log(subcategoryMaps[product.category]?.toLabel, product.subcategory, "7777");
  
  const fieldMap: Record<string, string | undefined> = {
    // category: product?.category,
    categort: productCategoryLabels[(product.category)] ?? "-",
    // @ts-ignore
    subcategory: subcategoryMaps[product.category]?.toLabel?.[product.subcategory as string] ?? "-",
    // subcategory: product?.subcategory ?? undefined,
    location: product?.location ?? undefined,
    createdAt: format(new Date(req.created_at), "dd/MM/yyyy"),
    requester: (req as any).requester_name,
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
          className="font-semibold cursor-pointer !min-w-max underline"
          onClick={() => {
            if (product?.product_id) {
              openProductPage(product.product_id);
            }
          }}
        >
          {product?.title ?? "ללא שם"}
        </span>
      );
      case "category":
        return product?.category ? productCategoryLabels[(product.category) as ProductCategory] : "-";
    case "availability":
      return getAvailabilityBadge(product?.availability);
    case "status":
      return getStatusBadge(req.status);
    case "offered":
      return req.offered_products.length
        ? req.offered_products.map((p, idx) => (
            <div
              key={idx}
              className="text-blue-500 cursor-pointer underline min-w-max"
              onClick={() => openProductPage(p.product_id)}
            >
              {p.title}
            </div>
          ))
        : "-";
    case "owner_name":
      return req.type === "sent" ? <div>{req.owner_name || "-"}</div> : null;
    default:
      return null;
  }
}
