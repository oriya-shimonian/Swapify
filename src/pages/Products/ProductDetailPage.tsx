import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  getProductCategoryLabel,
  getProductConditionLabel,
  getSubcategoryLabel,
  IProduct,
  IProductWithOwnerName,
  ProductCategory,
  ProductCondition,
} from "@/types/products";
import { Info } from "lucide-react";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import axios from "axios";
import { productRoutes } from "@/settings";
import LocationPicker from "@/components/LocationPicker";
import toast from "react-hot-toast";
import AppDialog from "@/components/AppDialog";
import LocationBubbles from "@/components/LocationBubbles";
import ExchangeRequestDialog from "@/components/dialogs/ExchangeRequestDialog";
import ImageUploader from "@/components/ImageUploader";
import useProducts from "@/hooks/useProducts";
import { getFormattedDateWithRelative } from "@/utils/FormatAndRelativeDate";
import { useChatMessages } from "@/hooks/useChatMessages";
import { useStartChat } from "@/hooks/useStartChat";
import { useExchangeRequest } from "@/hooks/useExchangeRequest";

export default function ProductDetailPage() {
  const conditionOptions = Object.values(ProductCondition);
  const categoryOptions = Object.values(ProductCategory);
  const { productId } = useParams();
  const [product, setProduct] = useState<IProductWithOwnerName>(
    {} as IProductWithOwnerName
  );
  const [isEditing, setIsEditing] = useState(false);
  const [editedProduct, setEditedProduct] = useState<IProduct>({} as IProduct);
  const { user } = useAuth();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showExchangeDialog, setShowExchangeDialog] = useState(false);
  const { updateProduct, deleteProduct } = useProducts();
  const navigate = useNavigate();
  const { startChat } = useStartChat();
  const { getExistingRequest } = useExchangeRequest();

  useEffect(() => {
    console.log("useEffect running for productId:", productId);
    const fetchProduct = async () => {
      try {
        const res = await axios.get(
          productRoutes.getProductById(Number(productId))
        );
        console.log("Fetched product:", res.data);
        setProduct(res.data);
        setEditedProduct(res.data);
      } catch (err) {
        console.error("Failed to fetch product", err);
      }
    };
    fetchProduct();
  }, [productId]);

  if (!product.product_id)
    return <p className="text-center mt-20">Loading...</p>;

  console.log(
    "Product data:",
    product.product_id,
    product.user_id,
    user?.user_id
  );

  const isOwner = !!product.product_id && user?.user_id === product.user_id;

  const handleOpenChat = async () => {
    if (!user || !product.product_id) return;

    try {
      const existing = await getExistingRequest(
        user.user_id,
        product.product_id
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

  const handleDeleteProduct = async () => {
    try {
      setIsDeleting(true);
      const result = await deleteProduct({
        category: product.category,
        id: product.product_id.toString(),
      });
      if (result) {
        toast.success("המוצר נמחק בהצלחה");
        navigate("/all-products");
      } else {
        toast.error("אירעה שגיאה בעת המחיקה");
      }
    } catch (error) {
      console.error("Error deleting product:", error);
      toast.error("אירעה שגיאה בעת המחיקה");
    } finally {
      setIsDeleting(false);
      setShowDeleteDialog(false);
    }
  };

  const handleUpdateProduct = async () => {
    try {
      const updated = await updateProduct({
        category: editedProduct.category,
        id: String(product.product_id),
        data: editedProduct,
      });
      setProduct(updated.product);
      setIsEditing(false);
      toast.success("המוצר עודכן בהצלחה!");
    } catch (err) {
      console.error(err);
      toast.error("אירעה שגיאה בעת עדכון המוצר");
    } finally {
      product.product_id = editedProduct.product_id;
    }
  };

  return (
    <div className="max-w-3xl mx-auto mt-24 p-6 shadow rounded bg-white dark:bg-gray-800">
      {isEditing ? (
        <ImageUploader
          initialImage={product.image_url!}
          onSelect={(base64) =>
            setEditedProduct((prev) => ({ ...prev, image_url: base64 }))
          }
        />
      ) : (
        <img
          src={product.image_url!}
          alt={product.title}
          className="w-64 h-64 object-cover rounded mb-4"
        />
      )}

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
              setEditedProduct((prev: any) => ({
                ...prev,
                category: e.target.value as ProductCategory,
              }))
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
        </>
      ) : (
        <>
          <h2 className="text-2xl font-bold">{product.title}</h2>
          <p className="text-gray-600 mt-2">{product.description}</p>
          <p className="mt-2">
            <strong>מצב:</strong> {getProductConditionLabel(product.condition)}
          </p>
          <p>
            <strong>בעל המוצר:</strong> {product.name}
          </p>
          <p>
            <strong>תאריך יצירת המוצר:</strong>{" "}
            {getFormattedDateWithRelative(new Date(product.created_at))}
          </p>
          <p>
            <strong>קטגוריה:</strong>{" "}
            {getProductCategoryLabel(product.category)}
          </p>
          {product.subcategory && (
            <p>
              <strong>תת קטגוריה:</strong>{" "}
              {getSubcategoryLabel(product.category, product.subcategory)}
            </p>
          )}
        </>
      )}

      <div className="mt-2 flex items-center gap-2">
        <strong>מיקום:</strong>
        <LocationBubbles
          locations={
            product.location
              ? product.location
                  .replace(/[{}"]/g, "")
                  .split(",")
                  .map((s) => s.trim())
              : []
          }
        />
        <Tooltip>
          <TooltipTrigger asChild>
            <Info size={16} className="text-muted-foreground cursor-pointer" />
          </TooltipTrigger>
          <TooltipContent>
            ניתן לשנות מיקומים רק דרך עמוד הפרופיל
          </TooltipContent>
        </Tooltip>
      </div>

      <div className="mt-4 space-x-2">
        {!isOwner && (
          <>
            <Button onClick={() => setShowExchangeDialog(true)}>
              שלח בקשת החלפה
            </Button>
            <Button variant="secondary" onClick={handleOpenChat}>
              פתח צ׳אט
            </Button>
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
            <Button
              variant="destructive"
              onClick={() => setShowDeleteDialog(true)}
            >
              מחק
            </Button>
          </>
        )}

        {isEditing && (
          <div className="flex gap-2">
            <Button
              onClick={() => {
                setEditedProduct(product); // מחזיר לערכים המקוריים
                setIsEditing(false);
              }}
              variant="secondary"
            >
              ביטול
            </Button>
            <Button
              onClick={() => handleUpdateProduct()}
              className="bg-blue-500 text-white"
            >
              סיום עריכה
            </Button>
          </div>
        )}
      </div>

      <AppDialog
        open={showDeleteDialog}
        title="האם למחוק את המוצר?"
        description={`המוצר "${product.title}" יימחק לצמיתות. לא ניתן לשחזר.`}
        confirmText="מחק"
        cancelText="ביטול"
        confirmVariant="destructive"
        onConfirm={handleDeleteProduct}
        onCancel={() => setShowDeleteDialog(false)}
        loading={isDeleting}
      />

      <ExchangeRequestDialog
        open={showExchangeDialog}
        productId={product.product_id}
        onClose={() => setShowExchangeDialog(false)}
        onSuccess={() => toast.success("הבקשה נשלחה בהצלחה!")}
      />
    </div>
  );
}
