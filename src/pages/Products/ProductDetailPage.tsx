// // import { useNavigate, useParams } from "react-router-dom";
// // import { useEffect, useState } from "react";
// // import {
// //   getProductCategoryLabel,
// //   getProductConditionLabel,
// //   getSubcategoryLabel,
// //   IProduct,
// //   IProductWithOwnerName,
// //   ProductCategory,
// //   ProductCondition,
// // } from "@/types/products";
// // import { Info } from "lucide-react";
// // import {
// //   Tooltip,
// //   TooltipTrigger,
// //   TooltipContent,
// // } from "@/components/ui/tooltip";
// // import { Input } from "@/components/ui/input";
// // import { Button } from "@/components/ui/button";
// // import { useAuth } from "@/context/AuthContext";
// // import axios from "axios";
// // import { productRoutes } from "@/settings";
// // import LocationPicker from "@/components/LocationPicker";
// // import toast from "react-hot-toast";
// // import AppDialog from "@/components/AppDialog";
// // import LocationBubbles from "@/components/LocationBubbles";
// // import ExchangeRequestDialog from "@/components/dialogs/ExchangeRequestDialog";
// // import ImageUploader from "@/components/ImageUploader";
// // import useProducts from "@/hooks/useProducts";
// // import { getFormattedDateWithRelative } from "@/utils/FormatAndRelativeDate";
// // import { useChatMessages } from "@/hooks/useChatMessages";
// // import { useChat } from "@/hooks/useChat";
// // import { useExchangeRequest } from "@/hooks/useExchangeRequest";
// // import { getAvailabilityBadge } from "@/utils/BadgeUtils";

// // export default function ProductDetailPage() {
// //   const conditionOptions = Object.values(ProductCondition);
// //   const categoryOptions = Object.values(ProductCategory);
// //   const { productId } = useParams();
// //   const [product, setProduct] = useState<IProductWithOwnerName>(
// //     {} as IProductWithOwnerName
// //   );
// //   const [isEditing, setIsEditing] = useState(false);
// //   const [editedProduct, setEditedProduct] = useState<IProduct>({} as IProduct);
// //   const { user } = useAuth();
// //   const [showDeleteDialog, setShowDeleteDialog] = useState(false);
// //   const [isDeleting, setIsDeleting] = useState(false);
// //   const [showExchangeDialog, setShowExchangeDialog] = useState(false);
// //   const { updateProduct, deleteProduct } = useProducts();
// //   const navigate = useNavigate();
// //   const { getExistingRequest } = useExchangeRequest();

// //   useEffect(() => {
// //     console.log("useEffect running for productId:", productId);
// //     const fetchProduct = async () => {
// //       try {
// //         const res = await axios.get(
// //           productRoutes.getProductById(Number(productId))
// //         );
// //         console.log("Fetched product:", res.data);
// //         setProduct(res.data);
// //         setEditedProduct(res.data);
// //       } catch (err) {
// //         console.error("Failed to fetch product", err);
// //       }
// //     };
// //     fetchProduct();
// //   }, [productId]);

// //   if (!product.product_id)
// //     return <p className="text-center mt-20">Loading...</p>;

// //   console.log(
// //     "Product data:",
// //     product.product_id,
// //     product.user_id,
// //     user?.user_id
// //   );

// //   const isOwner = !!product.product_id && user?.user_id === product.user_id;

// //   const handleOpenChat = async () => {
// //     if (!user || !product.product_id) return;

// //     try {
// //       const existing = await getExistingRequest(
// //         user.user_id,
// //         product.product_id
// //       );

// //       console.log("Existing exchange request:", existing);
// //       if (!existing?.request_id) {
// //         toast.error("אין בקשת החלפה קיימת מול מוצר זה");
// //         return;
// //       }
// //       console.log(666666);

// //       // const result = await startChat(existing.request_id);
// //       // console.log(result, "result of startChat");

// //       // if (result) {
// //       navigate(`/chat?exchangeRequestId=${existing.request_id}`);
// //       // } else {
// //       //   toast.error("שגיאה בפתיחת הצ'אט");
// //       // }
// //     } catch (err) {
// //       console.error("שגיאה בפתיחת הצ'אט:", err);
// //       toast.error("לא ניתן לפתוח צ'אט");
// //     }
// //   };

// //   const handleDeleteProduct = async () => {
// //     try {
// //       setIsDeleting(true);
// //       const result = await deleteProduct({
// //         category: product.category,
// //         id: product.product_id.toString(),
// //       });
// //       if (result) {
// //         toast.success("המוצר נמחק בהצלחה");
// //         navigate("/all-products");
// //       } else {
// //         toast.error("אירעה שגיאה בעת המחיקה");
// //       }
// //     } catch (error) {
// //       console.error("Error deleting product:", error);
// //       toast.error("אירעה שגיאה בעת המחיקה");
// //     } finally {
// //       setIsDeleting(false);
// //       setShowDeleteDialog(false);
// //     }
// //   };

// //   const handleUpdateProduct = async () => {
// //     try {
// //       const updated = await updateProduct({
// //         category: editedProduct.category,
// //         id: String(product.product_id),
// //         data: editedProduct,
// //       });
// //       setProduct(updated.product);
// //       setIsEditing(false);
// //       toast.success("המוצר עודכן בהצלחה!");
// //     } catch (err) {
// //       console.error(err);
// //       toast.error("אירעה שגיאה בעת עדכון המוצר");
// //     } finally {
// //       product.product_id = editedProduct.product_id;
// //     }
// //   };

// //   return (
// //     <div className="max-w-3xl mx-auto mt-24 p-6 shadow rounded bg-white dark:bg-gray-800">
// //       {isEditing ? (
// //         <ImageUploader
// //           initialImage={product.image_url!}
// //           onSelect={(base64) =>
// //             setEditedProduct((prev) => ({ ...prev, image_url: base64 }))
// //           }
// //         />
// //       ) : (
// //         <img
// //           src={product.image_url!}
// //           alt={product.title}
// //           className="w-64 h-64 object-cover rounded mb-4"
// //         />
// //       )}

// //       {isEditing ? (
// //         <>
// //           <Input
// //             value={editedProduct?.title || ""}
// //             onChange={(e) =>
// //               setEditedProduct((prev) => ({ ...prev!, title: e.target.value }))
// //             }
// //             className="mb-3"
// //           />
// //           <Input
// //             value={editedProduct?.description || ""}
// //             onChange={(e) =>
// //               setEditedProduct((prev) => ({
// //                 ...prev!,
// //                 description: e.target.value,
// //               }))
// //             }
// //             className="mb-3"
// //           />
// //           <select
// //             value={editedProduct?.condition || ""}
// //             onChange={(e) =>
// //               setEditedProduct((prev) => ({
// //                 ...prev!,
// //                 condition: e.target.value as ProductCondition,
// //               }))
// //             }
// //             className="mb-3 w-full border rounded p-2"
// //           >
// //             {conditionOptions.map((option) => (
// //               <option key={option} value={option}>
// //                 {option}
// //               </option>
// //             ))}
// //           </select>

// //           <select
// //             value={editedProduct?.category || ""}
// //             onChange={(e) =>
// //               setEditedProduct((prev: any) => ({
// //                 ...prev,
// //                 category: e.target.value as ProductCategory,
// //               }))
// //             }
// //             className="mb-3 w-full border rounded p-2"
// //           >
// //             {categoryOptions.map((option) => (
// //               <option key={option} value={option}>
// //                 {option}
// //               </option>
// //             ))}
// //           </select>

// //           <Input
// //             value={editedProduct?.subcategory || ""}
// //             onChange={(e) =>
// //               setEditedProduct((prev: any) => ({
// //                 ...prev!,
// //                 subcategory: e.target.value,
// //               }))
// //             }
// //             placeholder="תת קטגוריה"
// //             className="mb-3"
// //           />
// //         </>
// //       ) : (
// //         <>
// //           <h2 className="text-2xl font-bold">{product.title}</h2>
// //           <p className="text-gray-600 mt-2">{product.description}</p>
// //           <p className="mt-2">
// //             <strong>מצב:</strong> {getProductConditionLabel(product.condition)}
// //           </p>
// //           <p>
// //             <strong>בעל המוצר:</strong> {product.name}
// //           </p>
// //           <p>
// //             <strong>תאריך יצירת המוצר:</strong>{" "}
// //             {getFormattedDateWithRelative(new Date(product.created_at))}
// //           </p>
// //           <p>
// //             <strong>קטגוריה:</strong>{" "}
// //             {getProductCategoryLabel(product.category)}
// //           </p>
// //           {product.subcategory && (
// //             <p>
// //               <strong>תת קטגוריה:</strong>{" "}
// //               {getSubcategoryLabel(product.category, product.subcategory)}
// //             </p>
// //           )}
// //           <div>
// //             <strong>זמינות:</strong> {getAvailabilityBadge(product.availability)}
// //           </div>
// //         </>
// //       )}

// //       <div className="mt-2 flex items-center gap-2">
// //         <strong>מיקום:</strong>
// //         <LocationBubbles
// //           locations={
// //             product.location
// //               ? product.location
// //                   .replace(/[{}"]/g, "")
// //                   .split(",")
// //                   .map((s) => s.trim())
// //               : []
// //           }
// //         />
// //         {isOwner && (
// //           <Tooltip>
// //             <TooltipTrigger asChild>
// //               <Info
// //                 size={16}
// //                 className="text-muted-foreground cursor-pointer"
// //               />
// //             </TooltipTrigger>
// //             <TooltipContent>
// //               ניתן לשנות מיקומים רק דרך עמוד הפרופיל
// //             </TooltipContent>
// //           </Tooltip>
// //         )}
// //       </div>

// //       <div className="mt-4 space-x-2">
// //         {!isOwner && (
// //           <>
// //             <Button onClick={() => setShowExchangeDialog(true)}>
// //               שלח בקשת החלפה
// //             </Button>
// //             <Button variant="secondary" onClick={handleOpenChat}>
// //               פתח צ׳אט
// //             </Button>
// //           </>
// //         )}

// //         {isOwner && !isEditing && (
// //           <>
// //             <Button
// //               onClick={() => setIsEditing(true)}
// //               className="bg-yellow-500 text-white"
// //             >
// //               ערוך
// //             </Button>
// //             <Button
// //               variant="destructive"
// //               onClick={() => setShowDeleteDialog(true)}
// //             >
// //               מחק
// //             </Button>
// //           </>
// //         )}

// //         {isEditing && (
// //           <div className="flex gap-2">
// //             <Button
// //               onClick={() => {
// //                 setEditedProduct(product); // מחזיר לערכים המקוריים
// //                 setIsEditing(false);
// //               }}
// //               variant="secondary"
// //             >
// //               ביטול
// //             </Button>
// //             <Button
// //               onClick={() => handleUpdateProduct()}
// //               className="bg-blue-500 text-white"
// //             >
// //               סיום עריכה
// //             </Button>
// //           </div>
// //         )}
// //       </div>

// //       <AppDialog
// //         open={showDeleteDialog}
// //         title="האם למחוק את המוצר?"
// //         description={`המוצר "${product.title}" יימחק לצמיתות. לא ניתן לשחזר.`}
// //         confirmText="מחק"
// //         cancelText="ביטול"
// //         confirmVariant="destructive"
// //         onConfirm={handleDeleteProduct}
// //         onCancel={() => setShowDeleteDialog(false)}
// //         loading={isDeleting}
// //       />

// //       <ExchangeRequestDialog
// //         open={showExchangeDialog}
// //         productId={product.product_id}
// //         onClose={() => setShowExchangeDialog(false)}
// //         onSuccess={() => toast.success("הבקשה נשלחה בהצלחה!")}
// //       />
// //     </div>
// //   );
// // }
// import React, { useState } from "react";
// import {
//   Edit3,
//   Trash2,
//   MessageCircle,
//   Send,
//   Save,
//   X,
//   MapPin,
//   Calendar,
//   User,
//   Tag,
//   Info,
//   Heart,
//   Share2,
//   Camera
// } from "lucide-react";

// // Mock data for demonstration
// const mockProduct = {
//   product_id: 1,
//   title: "MacBook Pro 13 אינץ'",
//   description: "מחשב נייד במצב מעולה, נקנה לפני שנה. כולל מטען מקורי ותיק נשיאה.",
//   condition: "Like New",
//   category: "Electronics",
//   subcategory: "Laptops",
//   image_url: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&h=600&fit=crop",
//   name: "דוד כהן",
//   created_at: "2024-01-15T10:30:00Z",
//   availability: "Available",
//   location: "תל אביב, רמת גן, פתח תקווה",
//   user_id: 2
// };

// const mockUser = { user_id: 1 };

// // Utility functions
// const getProductConditionLabel = (condition) => {
//   const labels = {
//     "New": "חדש",
//     "Like New": "כמו חדש",
//     "Good": "טוב",
//     "Fair": "בינוני",
//     "Poor": "ירוד"
//   };
//   return labels[condition] || condition;
// };

// const getProductCategoryLabel = (category) => {
//   const labels = {
//     "Electronics": "אלקטרוניקה",
//     "Clothing": "ביגוד",
//     "Books": "ספרים",
//     "Sports": "ספורט"
//   };
//   return labels[category] || category;
// };

// const getSubcategoryLabel = (category, subcategory) => {
//   return subcategory;
// };

// const getFormattedDateWithRelative = (date) => {
//   return new Intl.DateTimeFormat('he-IL', {
//     year: 'numeric',
//     month: 'long',
//     day: 'numeric'
//   }).format(date);
// };

// const getAvailabilityBadge = (availability) => {
//   const badges = {
//     "Available": { text: "זמין", color: "bg-emerald-500", glow: "shadow-emerald-500/25" },
//     "Interested": { text: "מעוניינים", color: "bg-amber-500", glow: "shadow-amber-500/25" },
//     "Pending": { text: "בתהליך החלפה", color: "bg-orange-500", glow: "shadow-orange-500/25" },
//     "Exchanged": { text: "הוחלף", color: "bg-red-500", glow: "shadow-red-500/25" }
//   };

//   const badge = badges[availability] || { text: "לא ידוע", color: "bg-gray-500", glow: "shadow-gray-500/25" };

//   return (
//     <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium text-white ${badge.color} shadow-lg ${badge.glow}`}>
//       {badge.text}
//     </span>
//   );
// };

// export default function ProductDetailPage() {
//   const [product, setProduct] = useState(mockProduct);
//   const [isEditing, setIsEditing] = useState(false);
//   const [editedProduct, setEditedProduct] = useState(mockProduct);
//   const [showDeleteDialog, setShowDeleteDialog] = useState(false);
//   const [isDeleting, setIsDeleting] = useState(false);
//   const [showExchangeDialog, setShowExchangeDialog] = useState(false);
//   const [isLiked, setIsLiked] = useState(false);

//   const user = mockUser;
//   const isOwner = user?.user_id === product.user_id;

//   const conditionOptions = ["New", "Like New", "Good", "Fair", "Poor"];
//   const categoryOptions = ["Electronics", "Clothing", "Books", "Sports"];

//   const handleUpdateProduct = () => {
//     setProduct(editedProduct);
//     setIsEditing(false);
//   };

//   const handleDeleteProduct = () => {
//     setIsDeleting(true);
//     setTimeout(() => {
//       setIsDeleting(false);
//       setShowDeleteDialog(false);
//     }, 2000);
//   };

//   const locations = product.location ? product.location.split(', ') : [];

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 py-8 px-4 mt-[4.5rem]">
//       <div className="max-w-6xl mx-auto">

//         <div className="grid lg:grid-cols-2 gap-8">
//           {/* Image Section */}
//           <div className="space-y-4">
//             <div className="relative group">
//               <div className="aspect-square bg-white rounded-3xl shadow-2xl overflow-hidden">
//                 {isEditing ? (
//                   <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 cursor-pointer hover:from-blue-100 hover:to-indigo-200 transition-all duration-300">
//                     <div className="text-center">
//                       <Camera size={48} className="mx-auto text-gray-400 mb-4" />
//                       <p className="text-gray-600 font-medium">לחץ לשינוי תמונה</p>
//                     </div>
//                   </div>
//                 ) : (
//                   <img
//                     src={product.image_url}
//                     alt={product.title}
//                     className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
//                   />
//                 )}
//               </div>

//               {/* Availability Badge Overlay */}
//               <div className="absolute top-6 right-6">
//                 {getAvailabilityBadge(product.availability)}
//               </div>
//             </div>
//           </div>

//           {/* Content Section */}
//           <div className="space-y-6">
//             <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/20">
//               {isEditing ? (
//                 <div className="space-y-6">
//                   <input
//                     value={editedProduct.title}
//                     onChange={(e) => setEditedProduct(prev => ({ ...prev, title: e.target.value }))}
//                     className="w-full text-3xl font-bold bg-transparent border-none outline-none focus:bg-white/50 rounded-xl p-3 transition-all duration-300"
//                     placeholder="כותרת המוצר"
//                   />

//                   <textarea
//                     value={editedProduct.description}
//                     onChange={(e) => setEditedProduct(prev => ({ ...prev, description: e.target.value }))}
//                     className="w-full bg-transparent border-none outline-none focus:bg-white/50 rounded-xl p-3 transition-all duration-300 resize-none h-32"
//                     placeholder="תיאור המוצר"
//                   />

//                   <div className="grid grid-cols-2 gap-4">
//                     <select
//                       value={editedProduct.condition}
//                       onChange={(e) => setEditedProduct(prev => ({ ...prev, condition: e.target.value }))}
//                       className="bg-white/80 border border-gray-200 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
//                     >
//                       {conditionOptions.map(option => (
//                         <option key={option} value={option}>
//                           {getProductConditionLabel(option)}
//                         </option>
//                       ))}
//                     </select>

//                     <select
//                       value={editedProduct.category}
//                       onChange={(e) => setEditedProduct(prev => ({ ...prev, category: e.target.value }))}
//                       className="bg-white/80 border border-gray-200 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
//                     >
//                       {categoryOptions.map(option => (
//                         <option key={option} value={option}>
//                           {getProductCategoryLabel(option)}
//                         </option>
//                       ))}
//                     </select>
//                   </div>

//                   <input
//                     value={editedProduct.subcategory}
//                     onChange={(e) => setEditedProduct(prev => ({ ...prev, subcategory: e.target.value }))}
//                     className="w-full bg-white/80 border border-gray-200 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
//                     placeholder="תת קטגוריה"
//                   />
//                 </div>
//               ) : (
//                 <div className="space-y-6">
//                   <h1 className="text-4xl font-bold text-gray-800 leading-tight">
//                     {product.title}
//                   </h1>

//                   <p className="text-gray-600 text-lg leading-relaxed">
//                     {product.description}
//                   </p>

//                   <div className="grid grid-cols-2 gap-6">
//                     <div className="flex items-center gap-3">
//                       <div className="p-2 bg-blue-100 rounded-lg">
//                         <Tag size={18} className="text-blue-600" />
//                       </div>
//                       <div>
//                         <p className="text-sm text-gray-500">מצב</p>
//                         <p className="font-semibold text-gray-800">
//                           {getProductConditionLabel(product.condition)}
//                         </p>
//                       </div>
//                     </div>

//                     <div className="flex items-center gap-3">
//                       <div className="p-2 bg-purple-100 rounded-lg">
//                         <User size={18} className="text-purple-600" />
//                       </div>
//                       <div>
//                         <p className="text-sm text-gray-500">בעל המוצר</p>
//                         <p className="font-semibold text-gray-800">{product.name}</p>
//                       </div>
//                     </div>

//                     <div className="flex items-center gap-3">
//                       <div className="p-2 bg-green-100 rounded-lg">
//                         <Calendar size={18} className="text-green-600" />
//                       </div>
//                       <div>
//                         <p className="text-sm text-gray-500">תאריך יצירה</p>
//                         <p className="font-semibold text-gray-800">
//                           {getFormattedDateWithRelative(new Date(product.created_at))}
//                         </p>
//                       </div>
//                     </div>

//                     <div className="flex items-center gap-3">
//                       <div className="p-2 bg-orange-100 rounded-lg">
//                         <Tag size={18} className="text-orange-600" />
//                       </div>
//                       <div>
//                         <p className="text-sm text-gray-500">קטגוריה</p>
//                         <p className="font-semibold text-gray-800">
//                           {getProductCategoryLabel(product.category)}
//                           {product.subcategory && ` - ${getSubcategoryLabel(product.category, product.subcategory)}`}
//                         </p>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               )}
//             </div>

//             {/* Location Section */}
//             <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-6 shadow-xl border border-white/20">
//               <div className="flex items-center gap-3 mb-4">
//                 <div className="p-2 bg-red-100 rounded-lg">
//                   <MapPin size={18} className="text-red-600" />
//                 </div>
//                 <h3 className="text-lg font-semibold text-gray-800">מיקומים זמינים</h3>
//                 {isOwner && (
//                   <div className="p-1 bg-blue-100 rounded-full">
//                     <Info size={14} className="text-blue-600" />
//                   </div>
//                 )}
//               </div>

//               <div className="flex flex-wrap gap-2">
//                 {locations.map((location, index) => (
//                   <span
//                     key={index}
//                     className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-full text-sm font-medium shadow-lg shadow-blue-500/25"
//                   >
//                     {location}
//                   </span>
//                 ))}
//               </div>
//             </div>

//             {/* Action Buttons */}
//             <div className="space-y-4">
//               {!isOwner && (
//                 <div className="grid grid-cols-2 gap-4">
//                   <button
//                     onClick={() => setShowExchangeDialog(true)}
//                     className="flex items-center justify-center gap-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold py-4 px-6 rounded-2xl shadow-xl shadow-blue-500/25 hover:shadow-blue-500/40 transform hover:scale-105 transition-all duration-300"
//                   >
//                     <Send size={20} />
//                     <span>שלח בקשת החלפה</span>
//                   </button>

//                   <button className="flex items-center justify-center gap-3 bg-white text-gray-700 font-semibold py-4 px-6 rounded-2xl shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 border border-gray-200">
//                     <MessageCircle size={20} />
//                     <span>פתח צ'אט</span>
//                   </button>
//                 </div>
//               )}

//               {isOwner && !isEditing && (
//                 <div className="grid grid-cols-2 gap-4">
//                   <button
//                     onClick={() => setIsEditing(true)}
//                     className="flex items-center justify-center gap-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-semibold py-4 px-6 rounded-2xl shadow-xl shadow-amber-500/25 hover:shadow-amber-500/40 transform hover:scale-105 transition-all duration-300"
//                   >
//                     <Edit3 size={20} />
//                     <span>ערוך מוצר</span>
//                   </button>

//                   <button
//                     onClick={() => setShowDeleteDialog(true)}
//                     className="flex items-center justify-center gap-3 bg-gradient-to-r from-red-500 to-pink-500 text-white font-semibold py-4 px-6 rounded-2xl shadow-xl shadow-red-500/25 hover:shadow-red-500/40 transform hover:scale-105 transition-all duration-300"
//                   >
//                     <Trash2 size={20} />
//                     <span>מחק מוצר</span>
//                   </button>
//                 </div>
//               )}

//               {isEditing && (
//                 <div className="grid grid-cols-2 gap-4">
//                   <button
//                     onClick={() => {
//                       setEditedProduct(product);
//                       setIsEditing(false);
//                     }}
//                     className="flex items-center justify-center gap-3 bg-white text-gray-700 font-semibold py-4 px-6 rounded-2xl shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 border border-gray-200"
//                   >
//                     <X size={20} />
//                     <span>ביטול</span>
//                   </button>

//                   <button
//                     onClick={handleUpdateProduct}
//                     className="flex items-center justify-center gap-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white font-semibold py-4 px-6 rounded-2xl shadow-xl shadow-green-500/25 hover:shadow-green-500/40 transform hover:scale-105 transition-all duration-300"
//                   >
//                     <Save size={20} />
//                     <span>שמור שינויים</span>
//                   </button>
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Delete Confirmation Modal */}
//       {showDeleteDialog && (
//         <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
//           <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl transform transition-all duration-300">
//             <div className="text-center mb-6">
//               <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
//                 <Trash2 size={32} className="text-red-600" />
//               </div>
//               <h3 className="text-2xl font-bold text-gray-800 mb-2">האם למחוק את המוצר?</h3>
//               <p className="text-gray-600">
//                 המוצר "{product.title}" יימחק לצמיתות. לא ניתן לשחזר.
//               </p>
//             </div>

//             <div className="flex gap-4">
//               <button
//                 onClick={() => setShowDeleteDialog(false)}
//                 className="flex-1 py-3 px-6 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-all duration-300"
//                 disabled={isDeleting}
//               >
//                 ביטול
//               </button>
//               <button
//                 onClick={handleDeleteProduct}
//                 disabled={isDeleting}
//                 className="flex-1 py-3 px-6 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-xl font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:transform-none"
//               >
//                 {isDeleting ? "מוחק..." : "מחק"}
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Exchange Request Modal */}
//       {showExchangeDialog && (
//         <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
//           <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl transform transition-all duration-300">
//             <div className="text-center mb-6">
//               <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
//                 <Send size={32} className="text-blue-600" />
//               </div>
//               <h3 className="text-2xl font-bold text-gray-800 mb-2">שלח בקשת החלפה</h3>
//               <p className="text-gray-600">
//                 האם ברצונך לשלוח בקשת החלפה עבור "{product.title}"?
//               </p>
//             </div>

//             <div className="flex gap-4">
//               <button
//                 onClick={() => setShowExchangeDialog(false)}
//                 className="flex-1 py-3 px-6 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-all duration-300"
//               >
//                 ביטול
//               </button>
//               <button
//                 onClick={() => setShowExchangeDialog(false)}
//                 className="flex-1 py-3 px-6 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-300"
//               >
//                 שלח בקשה
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

// ProductDetailPage.tsx
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
                  <div className="flex items-center gap-3">
                    <Tag size={27} className="text-blue-600 bg-blue-100 rounded-lg p-1" />
                    <div>
                      <p className="text-sm text-gray-500 bg-gray-100 rounded-sm">מצב</p>
                      <p className="font-semibold text-gray-800">
                        {getProductConditionLabel(product.condition)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <User size={27} className="text-purple-600 bg-purple-100 rounded-lg p-1" />
                    <div>
                      <p className="text-sm text-gray-500">בעל המוצר</p>
                      <p className="font-semibold text-gray-800">
                        {product.name}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Calendar size={27} className="text-green-600 bg-green-100 rounded-lg p-1" />
                    <div>
                      <p className="text-sm text-gray-500">תאריך יצירה</p>
                      <p className="font-semibold text-gray-800">
                        {getFormattedDateWithRelative(
                          new Date(product.created_at)
                        )}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Tag size={27} className="text-orange-600 bg-orange-100 rounded-lg p-1" />
                    <div>
                      <p className="text-sm text-gray-500">קטגוריה</p>
                      <p className="font-semibold text-gray-800">
                        {getProductCategoryLabel(product.category)}
                        {product.subcategory &&
                          ` - ${getSubcategoryLabel(
                            product.category,
                            product.subcategory
                          )}`}
                      </p>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* מיקום */}
          <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-6 shadow-xl border border-white/20">
            <div className="flex items-center gap-3 mb-4">
              <MapPin size={27} className="text-red-600 bg-red-100 rounded-lg p-1" />
              <h3 className="text-lg font-semibold text-gray-800">
                מיקומים זמינים
              </h3>
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
