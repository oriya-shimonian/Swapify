import { Card } from "@/components/ui/card";
import {
  getProductCategoryLabel,
  getProductConditionLabel,
  getSubcategoryLabel,
  IProduct,
} from "@/types/products";
import { getAvailabilityBadge } from "@/utils/BadgeUtils";
import { useNavigate } from "react-router-dom";

export default function ProductCard({
  product,
}: {
  product: IProduct;
}) {
  const navigate = useNavigate();

  return (
    <Card
      onClick={() => navigate(`/product/${product.product_id}`)}
      className="rounded-lg border bg-card p-4 shadow-sm hover:shadow-md transition cursor-pointer relative flex flex-col gap-4"
    >

      <div className="w-full h-48 bg-muted rounded-md overflow-hidden">
        {product.image_url ? (
          <img
            src={product.image_url}
            alt={product.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-500 text-sm">
            אין תמונה
          </div>
        )}
      </div>

      <div className="flex flex-col gap-2 px-1 pb-1">
        <h3 className="text-lg font-semibold truncate">{product.title}</h3>
        <p className="text-sm text-muted-foreground truncate">
          {getProductCategoryLabel(product.category)}
          {product.subcategory && ` / ${getSubcategoryLabel(product.category, product.subcategory) }`}
        </p>

        {/* כפתורים (אם רלוונטי) */}
        {/* {actionButtons && (
          <div className="flex gap-2 mt-2">
            {actionButtons}
          </div>
        )} */}
        
        <div className="flex gap-2 mt-2">
          <div>{getAvailabilityBadge(product.availability)}</div>
          <p>{getProductConditionLabel(product.condition)}</p>
        </div>
      </div>
    </Card>
  );
}
