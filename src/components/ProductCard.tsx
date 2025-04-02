import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getProductCategoryLabel, getProductConditionLabel, IProduct } from "@/types/products";
import { useNavigate } from "react-router-dom";


export default function ProductCard({ product }: {product: IProduct;}) {
  const navigate = useNavigate();

  return (
    <Card
      className="shadow-md hover:shadow-xl transition cursor-pointer"
      onClick={() => navigate(`/product/${product.product_id}`)}
      key={product.product_id}
    >
      <CardHeader>
        {product.image_url ? (
          <img
            src={product.image_url}
            alt={product.title}
            className="w-full h-40 object-cover rounded-t-md"
          />
        ) : (
          <div className="w-full h-40 bg-gray-300 flex items-center justify-center rounded-t-md">
            <span className="text-gray-600">No Image</span>
          </div>
        )}
      </CardHeader>
      <CardContent className="p-4">
        <CardTitle className="text-lg font-semibold">{product.title}</CardTitle>
        <p className="text-sm text-gray-600">{product.description}</p>
        <div className="mt-3 flex gap-2">
          <span className="bg-blue-500 text-white px-2 py-1 text-xs rounded">{getProductCategoryLabel(product.category)}</span>
          <span className="bg-gray-200 text-gray-800 px-2 py-1 text-xs rounded">{getProductConditionLabel(product.condition)}</span>
        </div>
      </CardContent>
    </Card>
  );
}
