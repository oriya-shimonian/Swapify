import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  BoardGameSubcategory,
  BookSubcategory,
  getProductCategoryLabel,
  getProductConditionLabel,
  getSubcategoryLabel,
  IProduct,
  IProductWithOwnerName,
  ProductCategory,
  ProductCondition,
  PuzzleSubcategory,
  subcategoryMaps,
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
import CategorySpecificFields from "@/components/CategorySpecificFields";

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
        console.log("Fetched product:", res.data);

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
        navigate("/dashboard/my-products");
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

      setProduct(updated);
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
                className="w-full h-full object-fit transition-transform duration-700 group-hover:scale-105"
              />
            )}
          </div>
          <div className="absolute top-6 right-6">
            {getAvailabilityBadge(product.availability)}
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-4 shadow-xl border border-white/20">
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
                  className="text-3xl font-boldw-full bg-white/80 border rounded-xl p-3"
                />
                <textarea
                  value={editedProduct.description}
                  onChange={(e) =>
                    setEditedProduct((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                  className="w-full bg-white/80 border rounded-xl p-3 resize-none h-32"
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
                    onChange={(e) => {
                      const newCategory = e.target.value as ProductCategory;

                      setEditedProduct((prev) => {
                        return {
                          ...prev,
                          category: newCategory,
                          // איפוס שדות שאינם רלוונטיים לקטגוריה החדשה
                          subcategory: undefined,
                          author: undefined,
                          publisher: undefined,
                          publish_year: undefined,
                          page_count: undefined,
                          manufacturer: undefined,
                          piecesCount: undefined,
                          game_name: undefined,
                          min_players: undefined,
                          max_players: undefined,
                          duration: undefined,
                        };
                      });
                    }}
                    className="bg-white/80 border rounded-xl p-3"
                  >
                    {categoryOptions.map((option) => (
                      <option key={option} value={option}>
                        {getProductCategoryLabel(option)}
                      </option>
                    ))}
                  </select>
                </div>
                {editedProduct.category && (
                  <select
                    value={editedProduct.subcategory || ""}
                    onChange={(e) => {
                      const value = e.target.value;

                      setEditedProduct((prev) => {
                        if (prev.category === ProductCategory.PUZZLE) {
                          return {
                            ...prev,
                            subcategory: value as PuzzleSubcategory,
                          };
                        } else if (prev.category === ProductCategory.BOOK) {
                          return {
                            ...prev,
                            subcategory: value as BookSubcategory,
                          };
                        } else if (
                          prev.category === ProductCategory.BOARD_GAME
                        ) {
                          return {
                            ...prev,
                            subcategory: value as BoardGameSubcategory,
                          };
                        } else {
                          return prev; // fallback בטוח
                        }
                      });
                    }}
                    className="w-full bg-white/80 border rounded-xl p-3"
                  >
                    <option value="">בחר תת קטגוריה</option>
                    {Object.entries(
                      subcategoryMaps[editedProduct.category]?.toLabel || {}
                    ).map(([value, label]) => (
                      <option key={value} value={value}>
                        {label}
                      </option>
                    ))}
                  </select>
                )}

                <CategorySpecificFields
                  product={editedProduct}
                  isEditing={true}
                  onChange={(key, value) =>
                    setEditedProduct((prev) => ({ ...prev, [key]: value }))
                  }
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

                <CategorySpecificFields product={product} isEditing={false} />
              </>
            )}
          </div>

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

          {!user && (
            // <div className="">
              <p className="text-gray-800 text-md p-2">
                כדי לשלוח בקשת החלפה, יש להתחבר לחשבון שלך.
              </p>
            // </div>
          )}

          <div className="space-y-4">
            {!isOwner && user && (
              <div className="grid grid-cols-2 gap-4">
                <AppButton
                  onClick={() => setShowExchangeDialog(true)}
                  className="inline-flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-current"
                  disabled={
                    !product.availability ||
                    product.availability === "Pending" ||
                    product.availability === "Exchanged"
                  }
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

            {(isOwner || user?.role_name === "Admin") && !isEditing && (
              <div className="grid grid-cols-2 gap-4">
                {isOwner && !isEditing && (
                  <AppButton
                    onClick={() => setIsEditing(true)}
                    className="inline-flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={
                      !product.availability ||
                      product.availability === "Pending" ||
                      product.availability === "Exchanged"
                    }
                  >
                    <>
                      <Edit3 size={20} />
                      ערוך מוצר
                    </>
                  </AppButton>
                )}
                <button
                  onClick={() => setShowDeleteDialog(true)}
                  className="flex items-center justify-center gap-3 bg-white text-red-700 font-semibold py-4 px-6 rounded-2xl shadow border disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={
                    !product.availability ||
                    product.availability === "Pending" ||
                    product.availability === "Exchanged"
                  }
                >
                  <Trash2 size={20} />
                  מחק מוצר
                </button>
              </div>
            )}

            {isEditing && (
              <div className="grid grid-cols-2 gap-4">
                <AppButton
                  onClick={handleUpdateProduct}
                  className="flex items-center justify-center gap-3 bg-green-500 text-white font-semibold py-4 px-6 rounded-2xl shadow"
                >
                  <Save size={20} />
                  שמור שינויים
                </AppButton>
                                <button
                  onClick={() => {
                    setEditedProduct(product);
                    setIsEditing(false);
                  }}
                  className="flex items-center justify-center gap-3 bg-white text-red-700 font-semibold py-4 px-6 rounded-2xl shadow border disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <X size={20} />
                  ביטול
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
