import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { IProduct, ProductCategory, ProductCondition } from "@/types/products";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import axios from "axios";
import { productRoutes } from "@/settings";
import LocationPicker from "@/components/LocationPicker";

export default function ProductDetailPage() {
  const conditionOptions = Object.values(ProductCondition);
  const categoryOptions = Object.values(ProductCategory);
  const { productId } = useParams();
  const [product, setProduct] = useState<IProduct>({} as IProduct);
  const [isEditing, setIsEditing] = useState(false);
  const [editedProduct, setEditedProduct] = useState<IProduct>({} as IProduct);
  const { user } = useAuth();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axios.get(
          productRoutes.getProductById(Number(productId))
        );
        setProduct(res.data);
        setEditedProduct(res.data);
      } catch (err) {
        console.error("Failed to fetch product", err);
      }
    };
    fetchProduct();
  }, [productId]);

  if (!product) return <p className="text-center mt-20">Loading...</p>;

  const isOwner = user?.user_id === product.user_id;

  return (
    <div className="max-w-3xl mx-auto mt-24 p-6 shadow rounded bg-white dark:bg-gray-800">
      <img
        src={product.image_url || ""}
        alt={product.title}
        className="w-full h-64 object-cover rounded mb-4"
      />

      {isEditing ? (
        <>
          <Input
            value={editedProduct?.title || ""}
            onChange={(e) =>
              setEditedProduct((prev) => ({ ...prev!, title: e.target.value }))
            }
            className="mb-3"
          />
          <Input
            value={editedProduct?.description || ""}
            onChange={(e) =>
              setEditedProduct((prev) => ({
                ...prev!,
                description: e.target.value,
              }))
            }
            className="mb-3"
          />
          <select
            value={editedProduct?.condition || ""}
            onChange={(e) =>
              setEditedProduct((prev) => ({
                ...prev!,
                condition: e.target.value as ProductCondition,
              }))
            }
            className="mb-3 w-full border rounded p-2"
          >
            {conditionOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>

          <select
            value={editedProduct?.category || ""}
            onChange={(e) =>
              setEditedProduct((prev: any) => {
                if (!prev) return prev;
                return {
                  ...prev,
                  category: e.target.value as ProductCategory,
                };
              })
            }
            className="mb-3 w-full border rounded p-2"
          >
            {categoryOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>

          <Input
            value={editedProduct?.subcategory || ""}
            onChange={(e) =>
              setEditedProduct((prev: any) => ({
                ...prev!,
                subcategory: e.target.value,
              }))
            }
            placeholder="תת קטגוריה"
            className="mb-3"
          />

          <LocationPicker
            selectedLocations={editedProduct.location ? [editedProduct.location] : []}
            onChange={(newLocations) =>
              setEditedProduct((prev) => ({
                ...prev!,
                location: newLocations[0] || "",
              }))
            }
          />
        </>
      ) : (
        <>
          <h2 className="text-2xl font-bold">{product.title}</h2>
          <p className="text-gray-600 mt-2">{product.description}</p>
          <p className="mt-2">
            <strong>מצב:</strong> {product.condition}
          </p>
          <p>
            <strong>קטגוריה:</strong> {product.category}
          </p>
          {product.subcategory && (
            <p>
              <strong>תת קטגוריה:</strong> {product.subcategory}
            </p>
          )}
          <p>
            <strong>מיקום:</strong> {product.location}
          </p>
        </>
      )}

      <div className="mt-4 space-x-2">
        {!isOwner && (
          <>
            <Button variant="default">שלח בקשת החלפה</Button>
            <Button variant="secondary">פתח צ׳אט</Button>
          </>
        )}

        {isOwner && !isEditing && (
          <>
            <Button
              onClick={() => setIsEditing(true)}
              className="bg-yellow-500 text-white"
            >
              ערוך
            </Button>
            <Button variant="destructive">מחק</Button>
          </>
        )}
        {isEditing && (
          <Button
            onClick={() => setIsEditing(false)}
            className="bg-blue-500 text-white"
          >
            סיום עריכה
          </Button>
        )}
      </div>
    </div>
  );
}
