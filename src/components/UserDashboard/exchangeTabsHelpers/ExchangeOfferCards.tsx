// 📁 components/exchangeTabsHelpers/ExchangeOfferCards.tsx
import { useEffect, useState } from "react";
import { IExchangeRequest, IOfferedProductPreview } from "@/types/exchangeRequest";
import { getAvailabilityBadge } from "@/utils/BadgeUtils";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface Props {
  request: IExchangeRequest;
  onApprove: (request: IExchangeRequest, productId: number) => void;
  onReject: (request: IExchangeRequest) => void;
  AutomaticRejection: (request: IExchangeRequest) => void;
}

export function ExchangeOfferCards({ request, onApprove, onReject, AutomaticRejection }: Props) {
  const [selectedId, setSelectedId] = useState<number | null>(null);

  const handleApprove = () => {
    if (selectedId) {
      onApprove(request, selectedId);
    }
  };

  useEffect(() => {
    if(request.offered_products.filter((p) => p.availability != "Pending").length === 0) {
      setSelectedId(null);
      AutomaticRejection(request);
    }
  }, [request.offered_products]);
  
console.log(request.status);

  return (
    <div className="border-t pt-4 mt-2">
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        {request.offered_products.map((product: IOfferedProductPreview) => {
          const isSelected = selectedId === product.product_id;
          return (
            <Card
              key={product.product_id}
              className={`p-4 cursor-pointer border-2 transition rounded-xl ${
                ((product.availability === "Exchange" || product.availability === "Pending") && (request.status=== "Pending" || request.status === "Rejected")) ? "cursor-not-allowed border-gray-300 dark:border-gray-700 dark:text-black bg-gray-200" :
                (isSelected || product.availability === "Exchange" || product.availability === "Pending")
                  ? "border-green-600 bg-green-50 dark:bg-green-900"
                  : "hover:border-gray-400"
              }`}
              onClick={() => request.status === "Pending" && setSelectedId(product.product_id)}
            >
                {(product.availability === "Exchange" || product.availability === "Pending") && (request.status=== "Pending" || request.status === "Rejected") && <p className="text-red-500 text-xs">המוצר הזה מוחלף בבקשה אחרת</p>}
                {product.image_url && (
                <img
                loading="lazy"
                  src={product.image_url}
                  alt={product.title}
                  className="w-64 h-32 object-cover rounded"
                />
              )}
              <div className="text-lg font-semibold mb-1">{product.title}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                {product.category} / {product.subcategory}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                {product.location}
              </div>
              <div className="mb-2">{getAvailabilityBadge(product.availability)}</div>
              
            </Card>
          );
        })}
      </div>

      <div className="flex justify-end gap-4 mt-4">
        <Button
          variant="destructive"
          onClick={() => onReject(request)}
          disabled={request.status !== "Pending" || request.offered_products.filter((p) => p.availability != "Pending").length === 0}
        >
          דחה הצעה
        </Button>
        <Button
          onClick={handleApprove}
          className="bg-green-300 text-green-600 hover:bg-green-400"
          disabled={selectedId === null || request.status !== "Pending"}
        >
          אשר החלפה
        </Button>
      </div>
    </div>
  );
}
