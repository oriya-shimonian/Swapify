// 📁 components/exchangeTabsHelpers/ExchangeOfferCards.tsx
import { useEffect, useState } from "react";
import {
  IExchangeRequest,
  IOfferedProductPreview,
} from "@/types/exchangeRequest";
import { getAvailabilityBadge } from "@/utils/BadgeUtils";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";
import { useExchangeRequest } from "@/hooks/useExchangeRequest";

interface Props {
  request: IExchangeRequest;
  onApprove: (request: IExchangeRequest, productId: number) => void;
  onReject: (request: IExchangeRequest) => void;
  AutomaticRejection: (request: IExchangeRequest) => void;
}

export function ExchangeOfferCards({
  request,
  onApprove,
  onReject,
  AutomaticRejection,
}: Props) {
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const navigate = useNavigate();
  const { getExistingRequest } = useExchangeRequest();
  const { user } = useAuth();
  const handleApprove = () => {
    if (selectedId) {
      onApprove(request, selectedId);
    }
  };

  useEffect(() => {
    if (
      request.status === "Pending" &&
      request.offered_products.filter((p) => p.availability !== "Pending")
        .length === 0
    ) {
      setSelectedId(null);
      AutomaticRejection(request);
    }
  }, [request.offered_products, request.status]);

  console.log(request.status);

  const handleOpenChat = async () => {
    if (!user || !request.product_id) return;

    try {
      const existing = await getExistingRequest(
        user.user_id,
        request.product_id
      );

      console.log("Existing exchange request:", existing);
      if (!existing?.request_id) {
        toast.error("אין בקשת החלפה קיימת מול מוצר זה");
        return;
      }
      console.log(666666);

      // const result = await startChat(existing.request_id);
      // console.log(result, "result of startChat");

      // if (result) {
      navigate(`/chat?exchangeRequestId=${existing.request_id}`);
      // } else {
      //   toast.error("שגיאה בפתיחת הצ'אט");
      // }
    } catch (err) {
      console.error("שגיאה בפתיחת הצ'אט:", err);
      toast.error("לא ניתן לפתוח צ'אט");
    }
  };

  return (
    <div className="mt-2">
      <h5 className="pb-2">המוצרים שהוצעו לך להחליף בתמורה למוצר שלך:</h5>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        {request.offered_products.map((product: IOfferedProductPreview) => {
          const isSelected = selectedId === product.product_id;
          console.log(
            `Product ID: ${product.product_id}, Selected ID: ${selectedId}, Is Selected: ${isSelected}, Availability: ${product.availability}, Request Status: ${request.status}`
          );

          return (
            <Card
              key={product.product_id}
              // className={`p-4 cursor-pointer border-2 transition rounded-xl ${
              //   ((product.availability === "Exchanged" || product.availability === "Pending") && (request.status=== "Pending" || request.status === "Rejected") && (((product.availability === "Exchanged" || product.availability === "Pending") && request.chosen_product_id != product.product_id) && (product))) ? "cursor-not-allowed border-gray-300 dark:border-gray-700 dark:text-black bg-gray-200" :
              //   (isSelected || product.availability === "Exchanged" || product.availability === "Pending")
              //     ? "border-green-600 bg-green-50 dark:bg-green-900"
              //     : "hover:border-gray-400"
              // }`}
              className={`p-4 cursor-pointer border-2 transition rounded-xl ${
                (product.availability === "Exchanged" ||
                  product.availability === "Pending") &&
                request.chosen_product_id != product.product_id &&
                product
                  ? "cursor-not-allowed border-gray-300 dark:border-gray-700 dark:text-black bg-gray-200"
                  : isSelected ||
                    product.availability === "Exchanged" ||
                    product.availability === "Pending"
                  ? "border-green-600 bg-green-50 dark:bg-green-900"
                  : "hover:border-gray-400"
              }`}
              onClick={() =>
                request.status === "Pending" &&
                setSelectedId(product.product_id)
              }
            >
              {(product.availability === "Exchanged" ||
                product.availability === "Pending") &&
                request.chosen_product_id != product.product_id &&
                product && (
                  <p className="text-red-500 text-xs">
                    המוצר הזה מוחלף בבקשה אחרת
                  </p>
                )}
              {product.image_url && (
                <img
                  loading="lazy"
                  src={product.image_url}
                  alt={product.title}
                  className="w-64 h-32 object-cover rounded"
                />
              )}
              <a
                className="text-lg font-semibold mb-1 underline"
                href={`/product/${product.product_id}`}
              >
                {product.title}
              </a>
              <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                {product.category} / {product.subcategory}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                {product.location}
              </div>
              <div className="mb-2">
                {getAvailabilityBadge(product.availability)}
              </div>
            </Card>
          );
        })}
      </div>

      <div className="flex justify-end gap-4 mt-4">
        {request.status === "Approved" || request.status === "Completed" ||
        request.offered_products.filter((p) => p.availability != "Pending")
          .length === 0 ? (
          <Button variant="secondary" onClick={handleOpenChat}>
            פתח צ׳אט
          </Button>
        ) : (
          <>
            <Button
              variant="destructive"
              onClick={() => onReject(request)}
              disabled={
                request.status !== "Pending" ||
                selectedId === null ||
                request.offered_products.filter(
                  (p) => p.availability != "Pending"
                ).length === 0
              }
              className="!disabled:hover:cursor-not-allowed"
            >
              דחה הצעה
            </Button>
            <Button
              onClick={handleApprove}
              className="bg-green-300 text-green-600 hover:bg-green-400 disabled:hover:cursor-not-allowed"
              disabled={
                request.status !== "Pending" ||
                selectedId === null ||
                request.offered_products.filter(
                  (p) => p.availability != "Pending"
                ).length === 0
              }
            >
              אשר החלפה
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
