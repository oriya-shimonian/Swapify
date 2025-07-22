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
import { useEffect, useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import {
  ProductCategory,
  productCategoryLabels,
  subcategoryMaps,
} from "@/types/products";
import React from "react";

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
   []
  );

  useEffect(() => {
    const hash = window.location.hash;
    if (hash && hash.startsWith("#request-")) {
      const el = document.querySelector(hash);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "center" });
        el.classList.add("pulse-highlight");
        setTimeout(() => el.classList.remove("pulse-highlight"), 2000);
      }
    }
  }, [requests]); // חשוב שירוץ כשבקשות נטענות

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
          <React.Fragment key={req.request_id}>
            <RequestRow
              request={req}
              columns={columns}
              onImageClick={onImageClick}
              onEditClick={onEditClick}
              onDeleteClick={onDeleteClick}
              type={type}
              isExpanded={expandedRows.includes(req.request_id)}
              onToggleExpand={() => toggleExpand(req.request_id)}
            />

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
          </React.Fragment>
        ))}
      </TableBody>
    </Table>
  );
}

const RequestRow = React.memo(function RequestRow({
  request,
  columns,
  onImageClick,
  onEditClick,
  onDeleteClick,
  type,
  isExpanded,
  onToggleExpand,
}: {
  request: IExchangeRequest;
  columns: typeof sentColumns | typeof receivedColumns;
  onImageClick: (imageUrl: string) => void;
  onEditClick?: (requestId: number) => void;
  onDeleteClick?: (requestId: number) => void;
  type: "sent" | "received";
  isExpanded: boolean;
  onToggleExpand: () => void;
}) {
  console.log("🔁 render <RequestRow />", request.request_id);

  const product = request.requested_product;
  const parseLocation = (location?: string) => {
     if (!location) return "-";
     if (location.startsWith("{")) {
       return location
         .replace(/[{}\"\\s]/g, "")
         .split(",")
         .join(", ");
     }
     return location;
   };

  return (
    <TableRow
      id={`request-${request.request_id}`}
      className="group transition-colors duration-500"
    >
      {columns.map((col) => {
        const key = col.key;
        switch (key) {
          case "image":
            return (
              <TableCell key={key}>
                {product?.image_url ? (
                  <img
                    loading="lazy"
                    src={product.image_url}
                    alt={product.title || "מוצר"}
                    className="w-14 h-14 object-cover rounded cursor-pointer"
                    onClick={() => onImageClick(product.image_url || "")}
                  />
                ) : (
                  <div className="w-14 h-14 bg-gray-200 rounded flex items-center justify-center">
                    אין תמונה
                  </div>
                )}
              </TableCell>
            );
          case "title":
            return (
              <TableCell key={key}>
                <span
                  className="font-semibold cursor-pointer !min-w-max underline"
                  onClick={() => {
                    if (product?.product_id) {
                      window.open(`/product/${product.product_id}`, "_self");
                    }
                  }}
                >
                  {product?.title ?? "ללא שם"}
                </span>
              </TableCell>
            );
          case "category":
            return (
              <TableCell key={key}>
                {product?.category
                  ? productCategoryLabels[product.category as ProductCategory]
                  : "-"}
              </TableCell>
            );
          case "subcategory":
            return (
              <TableCell key={key}>
                {/* @ts-ignore */}
                {subcategoryMaps[product.category]?.toLabel?.[
                  product.subcategory as string
                ] ?? "-"}
              </TableCell>
            );
          case "location":
            return <TableCell key={key}>{product?.location ? parseLocation(product?.location) : "-"}</TableCell>;
          case "availability":
            return (
              <TableCell key={key}>
                {getAvailabilityBadge(product?.availability)}
              </TableCell>
            );
          case "status":
            return (
              <TableCell key={key}>{getStatusBadge(request.status)}</TableCell>
            );
          case "createdAt":
            return (
              <TableCell key={key}>
                {format(new Date(request.created_at), "dd/MM/yyyy")}
              </TableCell>
            );
          case "requester":
            return (
              <TableCell key={key}>{(request as any).requester_name}</TableCell>
            );
          case "owner_name":
            return request.type === "sent" ? (
              <TableCell key={key}>{request.owner_name || "-"}</TableCell>
            ) : null;
          case "offered":
            return (
              <TableCell key={key}>
                {request.offered_products.length
                  ? request.offered_products.map((p) => (
                      <div
                        key={p.product_id}
                        className="text-blue-500 cursor-pointer underline min-w-max"
                        onClick={() =>
                          window.open(`/product/${p.product_id}`, "_self")
                        }
                      >
                        {p.title}
                      </div>
                    ))
                  : "-"}
              </TableCell>
            );
          default:
            return <TableCell key={key}>-</TableCell>;
        }
      })}
      <TableCell className="flex items-center gap-2">
        {type === "sent" && (
          <>
            <FaEdit
              className="cursor-pointer text-blue-500"
              title="ערוך"
              size={18}
              onClick={() => onEditClick?.(request.request_id)}
            />
            <GoTrash
              className="cursor-pointer text-red-500"
              title="בטל בקשה"
              size={18}
              onClick={() => onDeleteClick?.(request.request_id)}
            />
          </>
        )}
        {type === "received" && (
          <button className="ml-auto" onClick={onToggleExpand}>
            {isExpanded ? (
              <ChevronUp className="w-4 h-4" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
          </button>
        )}
      </TableCell>
    </TableRow>
  );
});

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
