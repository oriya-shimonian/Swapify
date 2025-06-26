import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  getProductCategoryLabel,
  getProductConditionLabel,
  getSubcategoryLabel,
  IProduct,
  IProductWithOwnerName,
  IPuzzleProduct,
  ProductCategory,
  ProductCondition,
} from "@/types/products";
import {
  Calendar,
  Edit3,
  Info,
  MapPin,
  MessageCircle,
  Save,
  Send,
  Tag,
  Trash2,
  User,
  X,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import axios from "axios";
import { productRoutes } from "@/settings";
import toast from "react-hot-toast";
import AppDialog from "@/components/AppDialog";
import LocationBubbles from "@/components/LocationBubbles";
import ExchangeRequestDialog from "@/components/dialogs/ExchangeRequestDialog";
import ImageUploader from "@/components/ImageUploader";
import useProducts from "@/hooks/useProducts";
import { getFormattedDateWithRelative } from "@/utils/FormatAndRelativeDate";
import { useExchangeRequest } from "@/hooks/useExchangeRequest";
import { getAvailabilityBadge } from "@/utils/BadgeUtils";
import AppButton from "@/components/Buttons/AppButton";
import IconAndBgWithText from "@/components/ProductDetails/IconAndBgWithText";

export default function ProductDetailPage() {
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
  const { getExistingRequest } = useExchangeRequest();

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

  const isOwner = !!product.product_id && user?.user_id === product.user_id;
  const conditionOptions = Object.values(ProductCondition);
  const categoryOptions = Object.values(ProductCategory);
  const locations = product.location
    ? product.location
        .replace(/[{}\"]/g, "")
        .split(",")
        .map((s) => s.trim())
    : [];

  const handleOpenChat = async () => {
    if (!user || !product.product_id) return;
    try {
      const existing = await getExistingRequest(
        user.user_id,
        product.product_id
      );
      if (!existing?.request_id) {
        toast.error("אין בקשת החלפה קיימת מול מוצר זה");
        return;
      }
      navigate(`/chat?exchangeRequestId=${existing.request_id}`);
    } catch (err) {
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
      toast.error("אירעה שגיאה בעת עדכון המוצר");
    }
  };

  if (!product.product_id)
    return <p className="text-center mt-20">טוען מידע...</p>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 py-10 px-4 mt-[4.5rem]">
      <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-8">
        <div className="relative group">
          <div className="aspect-square bg-white rounded-3xl shadow-2xl overflow-hidden">
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
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
            )}
          </div>
          <div className="absolute top-6 right-6">
            {getAvailabilityBadge(product.availability)}
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-4 shadow-xl border border-white/20 lg:min-h[333px]">
            {isEditing ? (
              <>
                <input
                  value={editedProduct.title}
                  onChange={(e) =>
                    setEditedProduct((prev) => ({
                      ...prev,
                      title: e.target.value,
                    }))
                  }
                  className="w-full text-3xl font-bold bg-transparent border-none outline-none focus:bg-white/50 rounded-xl p-3"
                />
                <textarea
                  value={editedProduct.description}
                  onChange={(e) =>
                    setEditedProduct((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                  className="w-full bg-transparent border-none outline-none focus:bg-white/50 rounded-xl p-3 resize-none h-32"
                />
                <div className="grid grid-cols-2 gap-4">
                  <select
                    value={editedProduct.condition}
                    onChange={(e) =>
                      setEditedProduct((prev) => ({
                        ...prev,
                        condition: e.target.value as ProductCondition,
                      }))
                    }
                    className="bg-white/80 border rounded-xl p-3"
                  >
                    {conditionOptions.map((option) => (
                      <option key={option} value={option}>
                        {getProductConditionLabel(option)}
                      </option>
                    ))}
                  </select>
                  <select
                    value={editedProduct.category}
                    onChange={(e) =>
                      setEditedProduct(
                        (prev) =>
                          ({
                            ...prev,
                            category: e.target.value as ProductCategory,
                          } as IPuzzleProduct)
                      )
                    }
                    className="bg-white/80 border rounded-xl p-3"
                  >
                    {categoryOptions.map((option) => (
                      <option key={option} value={option}>
                        {getProductCategoryLabel(option)}
                      </option>
                    ))}
                  </select>
                </div>
                <input
                  value={editedProduct.subcategory || ""}
                  onChange={(e) =>
                    setEditedProduct(
                      (prev) =>
                        ({
                          ...prev,
                          subcategory: e.target.value,
                        } as IPuzzleProduct)
                    )
                  }
                  className="w-full bg-white/80 border rounded-xl p-3"
                  placeholder="תת קטגוריה"
                />
              </>
            ) : (
              <>
                <h1 className="text-4xl font-bold text-gray-800">
                  {product.title}
                </h1>
                <p className="text-gray-600 text-md my-3 leading-relaxed max-h-[83px] overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-blue-200 dark:scrollbar-thumb-blue-400">
                  {product.description}
                </p>

                <div className="grid grid-cols-2 gap-6">
                  <IconAndBgWithText
                    Icon={Tag}
                    color="blue"
                    label="מצב"
                    value={getProductConditionLabel(product.condition)}
                  />
                  <IconAndBgWithText
                    Icon={User}
                    color="purple"
                    label="בעל המוצר"
                    value={product.name}
                  />
                  <IconAndBgWithText
                    Icon={Calendar}
                    color="green"
                    label="תאריך יצירה"
                    value={getFormattedDateWithRelative(
                      new Date(product.created_at)
                    )}
                  />
                  <IconAndBgWithText
                    Icon={Tag}
                    color="orange"
                    label="קטגוריה"
                    value={
                      <>
                        {getProductCategoryLabel(product.category)}
                        {product.subcategory &&
                          ` - ${getSubcategoryLabel(
                            product.category,
                            product.subcategory
                          )}`}
                      </>
                    }
                  />
                </div>
              </>
            )}
          </div>

          {/* מיקום */}
          <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-6 shadow-xl border border-white/20">
            <div className="flex items-center gap-3 mb-4">
              <IconAndBgWithText
                    Icon={MapPin}
                    color="red"
                    label="מיקומים זמינים"
                    value={""}
                    design="!text-lg font-semibold text-gray-800"
                  />
              {isOwner && <Info size={14} className="text-blue-600" />}
            </div>
            <LocationBubbles locations={locations} />
          </div>

          {/* כפתורים */}
          <div className="space-y-4">
            {!isOwner && (
              <div className="grid grid-cols-2 gap-4">
                <AppButton
                  onClick={() => setShowExchangeDialog(true)}
                  className="inline-flex items-center justify-center"
                >
                  <>
                    <Send size={20} />
                    שלח בקשת החלפה
                  </>
                </AppButton>
                <button
                  onClick={handleOpenChat}
                  className="flex items-center justify-center gap-3 bg-white text-gray-700 font-semibold py-4 px-6 rounded-2xl shadow border"
                >
                  <MessageCircle size={20} />
                  פתח צ'אט
                </button>
              </div>
            )}

            {isOwner && !isEditing && (
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => setIsEditing(true)}
                  className="flex items-center justify-center gap-3 bg-yellow-400 text-white font-semibold py-4 px-6 rounded-2xl shadow"
                >
                  <Edit3 size={20} />
                  ערוך מוצר
                </button>
                <button
                  onClick={() => setShowDeleteDialog(true)}
                  className="flex items-center justify-center gap-3 bg-red-500 text-white font-semibold py-4 px-6 rounded-2xl shadow"
                >
                  <Trash2 size={20} />
                  מחק מוצר
                </button>
              </div>
            )}

            {isEditing && (
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => {
                    setEditedProduct(product);
                    setIsEditing(false);
                  }}
                  className="flex items-center justify-center gap-3 bg-gray-100 text-gray-700 font-semibold py-4 px-6 rounded-2xl shadow border"
                >
                  <X size={20} />
                  ביטול
                </button>
                <button
                  onClick={handleUpdateProduct}
                  className="flex items-center justify-center gap-3 bg-green-500 text-white font-semibold py-4 px-6 rounded-2xl shadow"
                >
                  <Save size={20} />
                  שמור שינויים
                </button>
              </div>
            )}
          </div>
        </div>
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
