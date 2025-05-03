// // // import { useEffect, useState } from "react";
// // // import { useAuth } from "@/context/AuthContext";
// // // import { useExchangeRequest } from "@/hooks/useExchangeRequest";
// // // import { Input } from "@/components/ui/input";
// // // import {
// // //   Select,
// // //   SelectContent,
// // //   SelectItem,
// // //   SelectTrigger,
// // //   SelectValue,
// // // } from "@/components/ui/select";
// // // import {
// // //   Table,
// // //   TableBody,
// // //   TableCell,
// // //   TableHead,
// // //   TableHeader,
// // //   TableRow,
// // // } from "@/components/ui/table";
// // // import { Skeleton } from "@/components/ui/skeleton";
// // // import { Button } from "@/components/ui/button";
// // // import { format } from "date-fns";
// // // import toast from "react-hot-toast";
// // // import { IExchangeRequest } from "@/types/exchangeRequest";
// // // import ImageDialog from "../dialogs/ImageDialog";
// // // import { FaEdit } from "react-icons/fa";
// // // import { GoTrash } from "react-icons/go";

// // // export default function MySentRequestsTab() {
// // //   const { user } = useAuth();
// // //   const { getUserRequests } = useExchangeRequest();

// // //   const [requests, setRequests] = useState<IExchangeRequest[]>([]);
// // //   const [loading, setLoading] = useState(true);
// // //   const [searchTerm, setSearchTerm] = useState("");
// // //   const [categoryFilter, setCategoryFilter] = useState<string | null>(null);
// // //   const [subcategoryFilter, setSubcategoryFilter] = useState<string | null>(null);
// // //   const [locationFilter, setLocationFilter] = useState<string>("");
// // //   const [availabilityFilter, setAvailabilityFilter] = useState<string | null>(null);
// // //   const [offeredProductFilter, setOfferedProductFilter] = useState<string>("");
// // //   const [currentPage, setCurrentPage] = useState(1);
// // //   const [modalImage, setModalImage] = useState<string | null>(null);

// // //   const ITEMS_PER_PAGE = 12;

// // //   useEffect(() => {
// // //     if (!user?.user_id) return;

// // //     setLoading(true);
// // //     getUserRequests(user.user_id)
// // //       .then((data) => setRequests(data))
// // //       .catch(() => toast.error("\u05e9\u05d2\u05d9\u05d0\u05d4 \u05d1\u05d8\u05e2\u05d9\u05e0\u05ea \u05d4\u05d1\u05e7\u05e9\u05d5\u05ea"))
// // //       .finally(() => setLoading(false));
// // //   }, [user?.user_id]);

// // //   const filteredRequests = requests.filter((req) => {
// // //     const matchesSearch = req.requested_product?.title?.toLowerCase().includes(searchTerm.toLowerCase());
// // //     const matchesCategory = categoryFilter ? req.requested_product?.category === categoryFilter : true;
// // //     const matchesSubcategory = subcategoryFilter ? req.requested_product?.subcategory === subcategoryFilter : true;
// // //     const matchesLocation = locationFilter ? req.requested_product?.location?.toLowerCase().includes(locationFilter.toLowerCase()) : true;
// // //     const matchesAvailability = availabilityFilter ? req.requested_product?.availability === availabilityFilter : true;
// // //     const matchesOffered = offeredProductFilter
// // //       ? req.offered_products.some((p) => p.title.toLowerCase().includes(offeredProductFilter.toLowerCase()))
// // //       : true;
// // //     return matchesSearch && matchesCategory && matchesSubcategory && matchesLocation && matchesAvailability && matchesOffered;
// // //   });

// // //   const totalPages = Math.ceil(filteredRequests.length / ITEMS_PER_PAGE);
// // //   const paginatedRequests = filteredRequests.slice(
// // //     (currentPage - 1) * ITEMS_PER_PAGE,
// // //     currentPage * ITEMS_PER_PAGE
// // //   );

// // //   return (
// // //     <div className="p-6">
// // //       <h1 className="text-2xl font-bold mb-4">\u05d1\u05e7\u05e9\u05d5\u05ea \u05e9\u05e9\u05dc\u05d7\u05ea\u05d9</h1>

// // //       {/* סינונים */}
// // //       <div className="flex flex-wrap gap-4 mb-6">
// // //         <Input
// // //           placeholder="חפש לפי שם מוצר..."
// // //           value={searchTerm}
// // //           onChange={(e) => {
// // //             setSearchTerm(e.target.value);
// // //             setCurrentPage(1);
// // //           }}
// // //           className="w-full md:w-1/4"
// // //         />

// // //         <Input
// // //           placeholder="חפש לפי מיקום..."
// // //           value={locationFilter}
// // //           onChange={(e) => {
// // //             setLocationFilter(e.target.value);
// // //             setCurrentPage(1);
// // //           }}
// // //           className="w-full md:w-1/4"
// // //         />

// // //         <Select
// // //           value={categoryFilter ?? undefined}
// // //           onValueChange={(val) => {
// // //             setCategoryFilter(val === "all" ? null : val);
// // //             setCurrentPage(1);
// // //           }}
// // //         >
// // //           <SelectTrigger className="w-full md:w-1/4">
// // //             <SelectValue placeholder="סנן לפי קטגוריה" />
// // //           </SelectTrigger>
// // //           <SelectContent>
// // //             <SelectItem value="all">כל הקטגוריות</SelectItem>
// // //             <SelectItem value="Puzzle">פאזל</SelectItem>
// // //             <SelectItem value="Book">ספר</SelectItem>
// // //             <SelectItem value="Board Game">משחק קופסה</SelectItem>
// // //           </SelectContent>
// // //         </Select>

// // //         <Input
// // //           placeholder="חפש לפי תת קטגוריה..."
// // //           value={subcategoryFilter ?? ""}
// // //           onChange={(e) => {
// // //             setSubcategoryFilter(e.target.value || null);
// // //             setCurrentPage(1);
// // //           }}
// // //           className="w-full md:w-1/4"
// // //         />

// // //         <Select
// // //           value={availabilityFilter ?? undefined}
// // //           onValueChange={(val) => {
// // //             setAvailabilityFilter(val === "all" ? null : val);
// // //             setCurrentPage(1);
// // //           }}
// // //         >
// // //           <SelectTrigger className="w-full md:w-1/4">
// // //             <SelectValue placeholder="סנן לפי זמינות" />
// // //           </SelectTrigger>
// // //           <SelectContent>
// // //             <SelectItem value="all">כל המצבים</SelectItem>
// // //             <SelectItem value="Available">זמין</SelectItem>
// // //             <SelectItem value="Interested">מעוניינים</SelectItem>
// // //             <SelectItem value="Pending">בהמתנה</SelectItem>
// // //             <SelectItem value="Exchanged">הוחלף</SelectItem>
// // //           </SelectContent>
// // //         </Select>

// // //         <Input
// // //           placeholder="חפש לפי מוצר שהצעת..."
// // //           value={offeredProductFilter}
// // //           onChange={(e) => {
// // //             setOfferedProductFilter(e.target.value);
// // //             setCurrentPage(1);
// // //           }}
// // //           className="w-full md:w-1/4"
// // //         />
// // //       </div>

// // //       {/* טבלה */}
// // //       {loading ? (
// // //         <SkeletonTable />
// // //       ) : filteredRequests.length === 0 ? (
// // //         <p className="text-center text-gray-500">לא נמצאו בקשות תואמות.</p>
// // //       ) : (
// // //         <Table className="text-sm">
// // //           <TableHeader>
// // //             <TableRow>
// // //               <TableHead>תמונה</TableHead>
// // //               <TableHead>שם מוצר</TableHead>
// // //               <TableHead>קטגוריה</TableHead>
// // //               <TableHead>תת קטגוריה</TableHead>
// // //               <TableHead>מיקום</TableHead>
// // //               <TableHead>זמינות</TableHead>
// // //               <TableHead>סטטוס</TableHead>
// // //               <TableHead>הצעות שלך</TableHead>
// // //               <TableHead>תאריך בקשה</TableHead>
// // //               <TableHead>פעולות</TableHead>
// // //             </TableRow>
// // //           </TableHeader>
// // //           <TableBody>
// // //             {paginatedRequests.map((req) => (
// // //               <TableRow key={req.request_id}>
// // //                 <TableCell>
// // //                   {req.requested_product?.image_url ? (
// // //                     <img
// // //                       src={req.requested_product.image_url}
// // //                       alt={req.requested_product.title}
// // //                       className="w-14 h-14 object-cover rounded cursor-pointer"
// // //                       onClick={() => setModalImage(req.requested_product?.image_url || "")}
// // //                     />
// // //                   ) : (
// // //                     <div className="w-14 h-14 bg-gray-200 rounded flex items-center justify-center">
// // //                       אין תמונה
// // //                     </div>
// // //                   )}
// // //                 </TableCell>
// // //                 <TableCell>
// // //                   <span
// // //                     className="font-semibold cursor-pointer"
// // //                     onClick={() => window.open(`/product/${req.requested_product?.product_id}`, "_blank")}
// // //                   >
// // //                     {req.requested_product?.title}
// // //                   </span>
// // //                 </TableCell>
// // //                 <TableCell>{req.requested_product?.category}</TableCell>
// // //                 <TableCell>{req.requested_product?.subcategory}</TableCell>
// // //                 <TableCell>{req.requested_product?.location}</TableCell>
// // //                 <TableCell>{req.requested_product?.availability}</TableCell>
// // //                 <TableCell>{req.status}</TableCell>
// // //                 <TableCell>
// // //                   {req.offered_products.map((p, index) => (
// // //                     <div key={index} className="text-blue-500 cursor-pointer underline" onClick={() => window.open(`/product/${p.product_id}`, "_blank")}>{p.title}</div>
// // //                   ))}
// // //                 </TableCell>
// // //                 <TableCell>{format(new Date(req.created_at), "dd/MM/yyyy")}</TableCell>
// // //                 <TableCell className="flex gap-2">
// // //                   <FaEdit className="cursor-pointer text-blue-500" title="ערוך" size={18} />
// // //                   <GoTrash className="cursor-pointer text-red-500" title="בטל בקשה" size={18} />
// // //                 </TableCell>
// // //               </TableRow>
// // //             ))}
// // //           </TableBody>
// // //         </Table>
// // //       )}

// // //       {/* פאגינציה */}
// // //       {totalPages > 1 && (
// // //         <div className="flex justify-center gap-2 mt-6">
// // //           <Button
// // //             variant="outline"
// // //             size="sm"
// // //             onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
// // //             disabled={currentPage === 1}
// // //           >
// // //             הקודם
// // //           </Button>
// // //           <span className="px-3 py-1">
// // //             {currentPage} מתוך {totalPages}
// // //           </span>
// // //           <Button
// // //             variant="outline"
// // //             size="sm"
// // //             onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
// // //             disabled={currentPage === totalPages}
// // //           >
// // //             הבא
// // //           </Button>
// // //         </div>
// // //       )}

// // //       {/* מודאל תמונה מוגדלת */}
// // //       {modalImage && (
// // //         <ImageDialog imageUrl={modalImage} onClose={() => setModalImage(null)} />
// // //       )}
// // //     </div>
// // //   );
// // // }

// // // function SkeletonTable() {
// // //   return (
// // //     <div className="space-y-4">
// // //       {Array.from({ length: 5 }).map((_, i) => (
// // //         <div key={i} className="flex gap-4">
// // //           <Skeleton className="w-14 h-14 rounded" />
// // //           <Skeleton className="h-6 w-1/4 rounded" />
// // //           <Skeleton className="h-6 w-1/4 rounded" />
// // //           <Skeleton className="h-6 w-1/4 rounded" />
// // //           <Skeleton className="h-6 w-1/4 rounded" />
// // //         </div>
// // //       ))}
// // //     </div>
// // //   );
// // // }

// // // // import { useState, useEffect } from "react";
// // // // import { Input } from "@/components/ui/input";
// // // // import {
// // // //   Select,
// // // //   SelectContent,
// // // //   SelectGroup,
// // // //   SelectItem,
// // // //   SelectTrigger,
// // // //   SelectValue,
// // // // } from "@/components/ui/select";
// // // // import { Badge } from "@/components/ui/badge";
// // // // import { useExchangeRequest } from "@/hooks/useExchangeRequest";
// // // // import { useAuth } from "@/context/AuthContext";
// // // // import { Dialog, DialogContent } from "@/components/ui/dialog";
// // // // import { formatDate } from "@/lib/formatDate";
// // // // import { IProduct } from "@/types/products";
// // // // import { IExchangeRequest } from "@/types/exchangeRequest";

// // // // export default function SentRequestsTab() {
// // // //   const { user } = useAuth();
// // // //   const { getUserRequests } = useExchangeRequest();

// // // //   const [requests, setRequests] = useState<IExchangeRequest[]>([]);
// // // //   const [loading, setLoading] = useState(true);
// // // //   const [error, setError] = useState<string | null>(null);
// // // //   const [selectedImage, setSelectedImage] = useState<string | null>(null);

// // // //   const [searchTerm, setSearchTerm] = useState("");
// // // //   const [category, setCategory] = useState<string>("all");
// // // //   const [subcategory, setSubcategory] = useState<string>("");
// // // //   const [location, setLocation] = useState<string>("");
// // // //   const [condition, setCondition] = useState<string>("");
// // // //   const [status, setStatus] = useState<string>("all");

// // // //   useEffect(() => {
// // // //     if (!user?.user_id) return;
// // // //     getUserRequests(user.user_id)
// // // //       .then(setRequests)
// // // //       .catch(() => setError("שגיאה בטעינת הבקשות"))
// // // //       .finally(() => setLoading(false));
// // // //   }, [user?.user_id]);

// // // //   const filteredRequests = requests.filter((r) => {
// // // //     const matchesSearch = r.requested_product?.title
// // // //       ?.toLowerCase()
// // // //       .includes(searchTerm.toLowerCase());
// // // //     const matchesCategory = category === "all" || r.requested_product?.category === category;
// // // //     const matchesSubcategory = !subcategory || r.requested_product?.subcategory?.includes(subcategory);
// // // //     const matchesLocation = !location || r.requested_product?.location?.includes(location);
// // // //     const matchesCondition = !condition || r.requested_product?.condition === condition;
// // // //     const matchesStatus = status === "all" || r.status === status;

// // // //     return (
// // // //       matchesSearch &&
// // // //       matchesCategory &&
// // // //       matchesSubcategory &&
// // // //       matchesLocation &&
// // // //       matchesCondition &&
// // // //       matchesStatus
// // // //     );
// // // //   });

// // // //   if (loading) return <p className="text-center">טוען בקשות...</p>;
// // // //   if (error) return <p className="text-center text-red-500">{error}</p>;

// // // //   return (
// // // //     <div className="p-4">
// // // //       <div className="flex flex-col md:flex-row gap-4 mb-6">
// // // //         <Input
// // // //           placeholder="חיפוש לפי שם מוצר..."
// // // //           value={searchTerm}
// // // //           onChange={(e) => setSearchTerm(e.target.value)}
// // // //           className="w-full md:w-1/3"
// // // //         />
// // // //         <Select onValueChange={setCategory}>
// // // //           <SelectTrigger className="w-full md:w-1/4">
// // // //             <SelectValue placeholder="קטגוריה" />
// // // //           </SelectTrigger>
// // // //           <SelectContent>
// // // //             <SelectGroup>
// // // //               <SelectItem value="all">הכל</SelectItem>
// // // //               <SelectItem value="Puzzle">פאזלים</SelectItem>
// // // //               <SelectItem value="Book">ספרים</SelectItem>
// // // //               <SelectItem value="Board Game">משחקי קופסה</SelectItem>
// // // //             </SelectGroup>
// // // //           </SelectContent>
// // // //         </Select>
// // // //         <Input
// // // //           placeholder="תת קטגוריה"
// // // //           value={subcategory}
// // // //           onChange={(e) => setSubcategory(e.target.value)}
// // // //           className="w-full md:w-1/4"
// // // //         />
// // // //         <Input
// // // //           placeholder="מיקום"
// // // //           value={location}
// // // //           onChange={(e) => setLocation(e.target.value)}
// // // //           className="w-full md:w-1/4"
// // // //         />
// // // //         <Select onValueChange={setCondition}>
// // // //           <SelectTrigger className="w-full md:w-1/4">
// // // //             <SelectValue placeholder="מצב מוצר" />
// // // //           </SelectTrigger>
// // // //           <SelectContent>
// // // //             <SelectGroup>
// // // //               <SelectItem value="New">חדש</SelectItem>
// // // //               <SelectItem value="Used">משומש</SelectItem>
// // // //               <SelectItem value="Good Condition">מצב טוב</SelectItem>
// // // //             </SelectGroup>
// // // //           </SelectContent>
// // // //         </Select>
// // // //         <Select onValueChange={setStatus}>
// // // //           <SelectTrigger className="w-full md:w-1/4">
// // // //             <SelectValue placeholder="סטטוס בקשה" />
// // // //           </SelectTrigger>
// // // //           <SelectContent>
// // // //             <SelectGroup>
// // // //               <SelectItem value="all">הכל</SelectItem>
// // // //               <SelectItem value="Pending">ממתין</SelectItem>
// // // //               <SelectItem value="Approved">מאושר</SelectItem>
// // // //               <SelectItem value="Rejected">נדחה</SelectItem>
// // // //               <SelectItem value="Completed">הושלם</SelectItem>
// // // //             </SelectGroup>
// // // //           </SelectContent>
// // // //         </Select>
// // // //       </div>

// // // //       {filteredRequests.length === 0 ? (
// // // //         <p className="text-center text-gray-500">אין בקשות מתאימות.</p>
// // // //       ) : (
// // // //         <div className="overflow-x-auto">
// // // //           <table className="w-full text-sm">
// // // //             <thead>
// // // //               <tr className="border-b">
// // // //                 <th>תמונה</th>
// // // //                 <th>שם מוצר</th>
// // // //                 <th>קטגוריה</th>
// // // //                 <th>תת קטגוריה</th>
// // // //                 <th>מיקום</th>
// // // //                 <th>תאריך בקשה</th>
// // // //                 <th>סטטוס בקשה</th>
// // // //                 <th>זמינות מוצר</th>
// // // //                 <th>הצעות שלך</th>
// // // //               </tr>
// // // //             </thead>
// // // //             <tbody>
// // // //               {filteredRequests.map((r) => (
// // // //                 <tr key={r.request_id} className="border-b hover:bg-gray-50 dark:hover:bg-gray-800">
// // // //                   <td>
// // // //                     {r.requested_product?.image_url && (
// // // //                       <img
// // // //                         src={r.requested_product.image_url}
// // // //                         alt="Product"
// // // //                         className="w-12 h-12 object-cover rounded cursor-pointer"
// // // //                         onClick={() => setSelectedImage(r.requested_product.image_url!)}
// // // //                       />
// // // //                     )}
// // // //                   </td>
// // // //                   <td>
// // // //                     <a href={`/product/${r.requested_product?.product_id}`} className="text-blue-600 hover:underline">
// // // //                       {r.requested_product?.title}
// // // //                     </a>
// // // //                   </td>
// // // //                   <td>{r.requested_product?.category}</td>
// // // //                   <td>{r.requested_product?.subcategory}</td>
// // // //                   <td>{r.requested_product?.location}</td>
// // // //                   <td>{formatDate(r.created_at)}</td>
// // // //                   <td>
// // // //                     <Badge>{r.status}</Badge>
// // // //                   </td>
// // // //                   <td>
// // // //                     <Badge variant={r.requested_product?.availability === "Available" ? "default" : "destructive"}>
// // // //                       {r.requested_product?.availability}
// // // //                     </Badge>
// // // //                   </td>
// // // //                   <td>
// // // //                     {r.offered_products?.map((p: any) => (
// // // //                       <div key={p.product_id}>
// // // //                         <a
// // // //                           href={`/product/${p.product_id}`}
// // // //                           className="text-sm text-blue-600 hover:underline"
// // // //                         >
// // // //                           {p.title}
// // // //                         </a>
// // // //                       </div>
// // // //                     ))}
// // // //                   </td>
// // // //                 </tr>
// // // //               ))}
// // // //             </tbody>
// // // //           </table>
// // // //         </div>
// // // //       )}

// // // //       {/* תמונה מוגדלת */}
// // // //       <Dialog open={!!selectedImage} onOpenChange={() => setSelectedImage(null)}>
// // // //         <DialogContent className="flex justify-center items-center">
// // // //           {selectedImage && (
// // // //             <img src={selectedImage} alt="Preview" className="max-h-[80vh] rounded" />
// // // //           )}
// // // //         </DialogContent>
// // // //       </Dialog>
// // // //     </div>
// // // //   );
// // // // }

// // import { useEffect, useState } from "react";
// // import { useAuth } from "@/context/AuthContext";
// // import { useExchangeRequest } from "@/hooks/useExchangeRequest";
// // import { Input } from "@/components/ui/input";
// // import {
// //   Select,
// //   SelectContent,
// //   SelectItem,
// //   SelectTrigger,
// //   SelectValue,
// // } from "@/components/ui/select";
// // import {
// //   Table,
// //   TableBody,
// //   TableCell,
// //   TableHead,
// //   TableHeader,
// //   TableRow,
// // } from "@/components/ui/table";
// // import { Skeleton } from "@/components/ui/skeleton";
// // import { Button } from "@/components/ui/button";
// // import { Badge } from "@/components/ui/badge";
// // import { format } from "date-fns";
// // import toast from "react-hot-toast";
// // import { IExchangeRequest } from "@/types/exchangeRequest";
// // import ImageDialog from "../../dialogs/ImageDialog";
// // import { FaEdit } from "react-icons/fa";
// // import { GoTrash } from "react-icons/go";

// // export default function MySentRequestsTab() {
// //   const { user } = useAuth();
// //   const { getUserRequests } = useExchangeRequest();

// //   const [requests, setRequests] = useState<IExchangeRequest[]>([]);
// //   const [loading, setLoading] = useState(true);
// //   const [searchTerm, setSearchTerm] = useState("");
// //   const [categoryFilter, setCategoryFilter] = useState<string | null>(null);
// //   const [subcategoryFilter, setSubcategoryFilter] = useState<string | null>(
// //     null
// //   );
// //   const [locationFilter, setLocationFilter] = useState<string>("");
// //   const [availabilityFilter, setAvailabilityFilter] = useState<string | null>(
// //     null
// //   );
// //   const [statusFilter, setStatusFilter] = useState<string | null>(null);
// //   const [offeredProductFilter, setOfferedProductFilter] = useState<string>("");
// //   const [currentPage, setCurrentPage] = useState(1);
// //   const [modalImage, setModalImage] = useState<string | null>(null);

// //   const ITEMS_PER_PAGE = 12;

// //   useEffect(() => {
// //     if (!user?.user_id) return;

// //     setLoading(true);
// //     getUserRequests(user.user_id)
// //       .then((data) => setRequests(data))
// //       .catch(() => toast.error("שגיאה בטעינת הבקשות"))
// //       .finally(() => setLoading(false));
// //   }, [user?.user_id]);

// //   const filteredRequests = requests.filter((req) => {
// //     const matchesSearch = req.requested_product?.title
// //       ?.toLowerCase()
// //       .includes(searchTerm.toLowerCase());
// //     const matchesCategory = categoryFilter
// //       ? req.requested_product?.category === categoryFilter
// //       : true;
// //     const matchesSubcategory = subcategoryFilter
// //       ? req.requested_product?.subcategory === subcategoryFilter
// //       : true;
// //     const matchesLocation = locationFilter
// //       ? req.requested_product?.location
// //           ?.toLowerCase()
// //           .includes(locationFilter.toLowerCase())
// //       : true;
// //     const matchesAvailability = availabilityFilter
// //       ? req.requested_product?.availability === availabilityFilter
// //       : true;
// //     const matchesStatus = statusFilter ? req.status === statusFilter : true;
// //     const matchesOffered = offeredProductFilter
// //       ? req.offered_products.some((p) =>
// //           p.title.toLowerCase().includes(offeredProductFilter.toLowerCase())
// //         )
// //       : true;
// //     return (
// //       matchesSearch &&
// //       matchesCategory &&
// //       matchesSubcategory &&
// //       matchesLocation &&
// //       matchesAvailability &&
// //       matchesStatus &&
// //       matchesOffered
// //     );
// //   });

// //   const totalPages = Math.ceil(filteredRequests.length / ITEMS_PER_PAGE);
// //   const paginatedRequests = filteredRequests.slice(
// //     (currentPage - 1) * ITEMS_PER_PAGE,
// //     currentPage * ITEMS_PER_PAGE
// //   );

// //   function getStatusBadge(status: string) {
// //     const baseClasses = "text-white px-2 py-1 rounded-full text-xs font-bold";
// //     switch (status) {
// //       case "Pending":
// //         return (
// //           <Badge variant="secondary" className={`${baseClasses} bg-yellow-500`}>
// //             ממתין
// //           </Badge>
// //         );
// //       case "Approved":
// //         return (
// //           <Badge variant="secondary" className={`${baseClasses} bg-green-500`}>
// //             אושר
// //           </Badge>
// //         );
// //       case "Rejected":
// //         return (
// //           <Badge variant="destructive" className={`${baseClasses} bg-red-500`}>
// //             נדחה
// //           </Badge>
// //         );
// //       case "Completed":
// //         return (
// //           <Badge variant="secondary" className={`${baseClasses} bg-blue-500`}>
// //             הושלם
// //           </Badge>
// //         );
// //       default:
// //         return (
// //           <Badge variant="default" className={baseClasses}>
// //             לא ידוע
// //           </Badge>
// //         );
// //     }
// //   }

// //   function getAvailabilityBadge(availability: string) {
// //     const baseClasses = "text-white px-2 py-1 rounded-full text-xs font-bold";
// //     switch (availability) {
// //       case "Available":
// //         return (
// //           <Badge variant="secondary" className={`${baseClasses} bg-green-500`}>
// //             זמין
// //           </Badge>
// //         );
// //       case "Interested":
// //         return (
// //           <Badge variant="secondary" className={`${baseClasses} bg-yellow-500`}>
// //             מעוניינים
// //           </Badge>
// //         );
// //       case "Pending":
// //         return (
// //           <Badge variant="secondary" className={`${baseClasses} bg-orange-500`}>
// //             בהמתנה
// //           </Badge>
// //         );
// //       case "Exchanged":
// //         return (
// //           <Badge variant="destructive" className={`${baseClasses} bg-red-500`}>
// //             הוחלף
// //           </Badge>
// //         );
// //       default:
// //         return (
// //           <Badge variant="default" className={baseClasses}>
// //             לא ידוע
// //           </Badge>
// //         );
// //     }
// //   }

// //   return (
// //     <div className="p-6 min-w-96">
// //       <h1 className="text-2xl font-bold mb-4">בקשות ששלחתי</h1>

// //       {/* סינונים */}
// //       <div className="flex flex-nowrap gap-4 mb-6">
// //         <Input
// //           placeholder="שם מוצר..."
// //           value={searchTerm}
// //           onChange={(e) => {
// //             setSearchTerm(e.target.value);
// //             setCurrentPage(1);
// //           }}
// //           className="w-full md:w-1/4"
// //         />

// //         <Input
// //           placeholder="מיקום..."
// //           value={locationFilter}
// //           onChange={(e) => {
// //             setLocationFilter(e.target.value);
// //             setCurrentPage(1);
// //           }}
// //           className="w-full md:w-1/4"
// //         />

// //         <Select
// //           value={categoryFilter ?? undefined}
// //           onValueChange={(val) => {
// //             setCategoryFilter(val === "all" ? null : val);
// //             setCurrentPage(1);
// //           }}
// //         >
// //           <SelectTrigger className="w-full md:w-1/4">
// //             <SelectValue placeholder="קטגוריה" />
// //           </SelectTrigger>
// //           <SelectContent>
// //             <SelectItem value="all">כל הקטגוריות</SelectItem>
// //             <SelectItem value="Puzzle">פאזל</SelectItem>
// //             <SelectItem value="Book">ספר</SelectItem>
// //             <SelectItem value="Board Game">משחק קופסה</SelectItem>
// //           </SelectContent>
// //         </Select>

// //         <Input
// //           placeholder="תת קטגוריה..."
// //           value={subcategoryFilter ?? ""}
// //           onChange={(e) => {
// //             setSubcategoryFilter(e.target.value || null);
// //             setCurrentPage(1);
// //           }}
// //           className="w-full md:w-1/4"
// //         />

// //         <Select
// //           value={availabilityFilter ?? undefined}
// //           onValueChange={(val) => {
// //             setAvailabilityFilter(val === "all" ? null : val);
// //             setCurrentPage(1);
// //           }}
// //         >
// //           <SelectTrigger className="w-full md:w-1/4">
// //             <SelectValue placeholder="זמינות" />
// //           </SelectTrigger>
// //           <SelectContent>
// //             <SelectItem value="all">כל המצבים</SelectItem>
// //             <SelectItem value="Available">זמין</SelectItem>
// //             <SelectItem value="Interested">מעוניינים</SelectItem>
// //             <SelectItem value="Pending">בהמתנה</SelectItem>
// //             <SelectItem value="Exchanged">הוחלף</SelectItem>
// //           </SelectContent>
// //         </Select>

// //         <Select
// //           value={statusFilter ?? undefined}
// //           onValueChange={(val) => {
// //             setStatusFilter(val === "all" ? null : val);
// //             setCurrentPage(1);
// //           }}
// //         >
// //           <SelectTrigger className="w-full md:w-1/4">
// //             <SelectValue placeholder="סטטוס" />
// //           </SelectTrigger>
// //           <SelectContent>
// //             <SelectItem value="all">כל הסטטוסים</SelectItem>
// //             <SelectItem value="Pending">ממתין</SelectItem>
// //             <SelectItem value="Approved">מאושר</SelectItem>
// //             <SelectItem value="Rejected">נדחה</SelectItem>
// //             <SelectItem value="Completed">הושלם</SelectItem>
// //           </SelectContent>
// //         </Select>

// //         <Input
// //           placeholder="שם מוצר שהצעת"
// //           value={offeredProductFilter}
// //           onChange={(e) => {
// //             setOfferedProductFilter(e.target.value);
// //             setCurrentPage(1);
// //           }}
// //           className="min-w-fit md:w-1/4"
// //         />
// //       </div>

// //       {/* טבלה */}
// //       {loading ? (
// //         <SkeletonTable />
// //       ) : filteredRequests.length === 0 ? (
// //         <p className="text-center text-gray-500">לא נמצאו בקשות תואמות.</p>
// //       ) : (
// //         <Table className="text-sm">
// //           <TableHeader>
// //             <TableRow>
// //               <TableHead>תמונה</TableHead>
// //               <TableHead>שם מוצר</TableHead>
// //               <TableHead>קטגוריה</TableHead>
// //               <TableHead>תת קטגוריה</TableHead>
// //               <TableHead>מיקום</TableHead>
// //               <TableHead>זמינות</TableHead>
// //               <TableHead>סטטוס</TableHead>
// //               <TableHead>הצעות שלך</TableHead>
// //               <TableHead>תאריך בקשה</TableHead>
// //               <TableHead>פעולות</TableHead>
// //             </TableRow>
// //           </TableHeader>
// //           <TableBody>
// //             {paginatedRequests.map((req) => (
// //               <TableRow key={req.request_id}>
// //                 <TableCell>
// //                   {req.requested_product?.image_url ? (
// //                     <img
// //                       src={req.requested_product.image_url}
// //                       alt={req.requested_product.title}
// //                       className="w-14 h-14 object-cover rounded cursor-pointer"
// //                       onClick={() =>
// //                         setModalImage(req.requested_product?.image_url || "")
// //                       }
// //                     />
// //                   ) : (
// //                     <div className="w-14 h-14 bg-gray-200 rounded flex items-center justify-center">
// //                       אין תמונה
// //                     </div>
// //                   )}
// //                 </TableCell>
// //                 <TableCell>
// //                   <span
// //                     className="font-semibold cursor-pointer"
// //                     onClick={() =>
// //                       window.open(
// //                         `/product/${req.requested_product?.product_id}`,
// //                         "_blank"
// //                       )
// //                     }
// //                   >
// //                     {req.requested_product?.title}
// //                   </span>
// //                 </TableCell>
// //                 <TableCell>{req.requested_product?.category}</TableCell>
// //                 <TableCell>{req.requested_product?.subcategory}</TableCell>
// //                 <TableCell>{req.requested_product?.location}</TableCell>
// //                 <TableCell>
// //                   {getAvailabilityBadge(
// //                     req.requested_product?.availability || ""
// //                   )}
// //                 </TableCell>
// //                 <TableCell>{getStatusBadge(req.status)}</TableCell>

// //                 <TableCell>
// //                   {req.offered_products.map((p, index) => (
// //                     <div
// //                       key={index}
// //                       className="text-blue-500 cursor-pointer underline"
// //                       onClick={() =>
// //                         window.open(`/product/${p.product_id}`, "_blank")
// //                       }
// //                     >
// //                       {p.title}
// //                     </div>
// //                   ))}
// //                 </TableCell>
// //                 <TableCell>
// //                   {format(new Date(req.created_at), "dd/MM/yyyy")}
// //                 </TableCell>
// //                 <TableCell className="flex gap-2">
// //                   <FaEdit
// //                     className="cursor-pointer text-blue-500"
// //                     title="ערוך"
// //                     size={18}
// //                   />
// //                   <GoTrash
// //                     className="cursor-pointer text-red-500"
// //                     title="בטל בקשה"
// //                     size={18}
// //                   />
// //                 </TableCell>
// //               </TableRow>
// //             ))}
// //           </TableBody>
// //         </Table>
// //       )}

// //       {/* פאגינציה */}
// //       {totalPages > 1 && (
// //         <div className="flex justify-center gap-2 mt-6">
// //           <Button
// //             variant="outline"
// //             size="sm"
// //             onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
// //             disabled={currentPage === 1}
// //           >
// //             הקודם
// //           </Button>
// //           <span className="px-3 py-1">
// //             {currentPage} מתוך {totalPages}
// //           </span>
// //           <Button
// //             variant="outline"
// //             size="sm"
// //             onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
// //             disabled={currentPage === totalPages}
// //           >
// //             הבא
// //           </Button>
// //         </div>
// //       )}

// //       {/* מודאל תמונה מוגדלת */}
// //       {modalImage && (
// //         <ImageDialog
// //           imageUrl={modalImage}
// //           onClose={() => setModalImage(null)}
// //         />
// //       )}
// //     </div>
// //   );
// // }

// // function SkeletonTable() {
// //   return (
// //     <div className="space-y-4">
// //       {Array.from({ length: 5 }).map((_, i) => (
// //         <div key={i} className="flex gap-4">
// //           <Skeleton className="w-14 h-14 rounded" />
// //           <Skeleton className="h-6 w-1/4 rounded" />
// //           <Skeleton className="h-6 w-1/4 rounded" />
// //           <Skeleton className="h-6 w-1/4 rounded" />
// //           <Skeleton className="h-6 w-1/4 rounded" />
// //         </div>
// //       ))}
// //     </div>
// //   );
// // }

// // function getAvailabilityVariant(availability?: string) {
// //   switch (availability) {
// //     case "Available":
// //       return "success";
// //     case "Interested":
// //       return "warning";
// //     case "Pending":
// //       return "warning";
// //     case "Exchanged":
// //       return "destructive";
// //     default:
// //       return "default";
// //   }
// // }

// // function getStatusVariant(status?: string) {
// //   switch (status) {
// //     case "Pending":
// //       return "warning";
// //     case "Approved":
// //       return "success";
// //     case "Completed":
// //       return "success";
// //     case "Rejected":
// //       return "destructive";
// //     default:
// //       return "default";
// //   }
// // }


// import { useEffect, useState } from "react";
// import { useAuth } from "@/context/AuthContext";
// import { useExchangeRequest } from "@/hooks/useExchangeRequest";
// import { IExchangeRequest } from "@/types/exchangeRequest";
// import toast from "react-hot-toast";
// import { filterRequests } from "@/utils/filterRequests";
// import { SkeletonTable } from "./SkeletonTable";
// import { Filters } from "./Filters";
// import { RequestsTable } from "./RequestsTable";
// import { Pagination } from "./Pagination";
// import ImageDialog from "@/components/dialogs/ImageDialog";


// export default function MySentRequestsTab() {
//   const { user } = useAuth();
//   const { getUserRequests } = useExchangeRequest();

//   const [requests, setRequests] = useState<IExchangeRequest[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [modalImage, setModalImage] = useState<string | null>(null);
//   const [filters, setFilters] = useState({
//     searchTerm: "",
//     category: null as string | null,
//     subcategory: null as string | null,
//     location: "",
//     availability: null as string | null,
//     status: null as string | null,
//     offeredProduct: "",
//   });

//   const ITEMS_PER_PAGE = 12;

//   useEffect(() => {
//     if (!user?.user_id) return;
//     setLoading(true);
//     getUserRequests(user.user_id)
//       .then((data) => setRequests(data))
//       .catch(() => toast.error("שגיאה בטעינת הבקשות"))
//       .finally(() => setLoading(false));
//   }, [user?.user_id]);

//   const filteredRequests = filterRequests(requests, filters);
//   const totalPages = Math.ceil(filteredRequests.length / ITEMS_PER_PAGE);
//   const paginatedRequests = filteredRequests.slice(
//     (currentPage - 1) * ITEMS_PER_PAGE,
//     currentPage * ITEMS_PER_PAGE
//   );

//   return (
//     <div className="p-6 min-w-96">
//       <h1 className="text-2xl font-bold mb-4">בקשות ששלחתי</h1>

//       <Filters filters={filters} setFilters={setFilters} resetPage={() => setCurrentPage(1)} />

//       {loading ? (
//         <SkeletonTable />
//       ) : filteredRequests.length === 0 ? (
//         <p className="text-center text-gray-500">לא נמצאו בקשות תואמות.</p>
//       ) : (
//         <RequestsTable requests={paginatedRequests} onImageClick={setModalImage} type="sent"/>
//       )}

//       <Pagination
//         currentPage={currentPage}
//         totalPages={totalPages}
//         onPageChange={setCurrentPage}
//       />

//       {modalImage && <ImageDialog imageUrl={modalImage} onClose={() => setModalImage(null)} />}
//     </div>
//   );
// }


import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useExchangeRequest } from "@/hooks/useExchangeRequest";
import { IExchangeRequest } from "@/types/exchangeRequest";
import { sentRequestFilters } from "@/lib/filters/exchangeRequestFilters";
import { filterRequests } from "@/utils/filterRequests";
import toast from "react-hot-toast";
import { SkeletonTable } from "./exchangeTabsHelpers/SkeletonTable";
import { Filters } from "./exchangeTabsHelpers/Filters";
import { RequestsTable } from "./exchangeTabsHelpers/RequestsTable";
import { Pagination } from "./exchangeTabsHelpers/Pagination";
import ImageDialog from "@/components/dialogs/ImageDialog";

const ITEMS_PER_PAGE = 12;

export default function MySentRequestsTab() {
  const { user } = useAuth();
  const { getUserRequests } = useExchangeRequest();

  const [requests, setRequests] = useState<IExchangeRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [modalImage, setModalImage] = useState<string | null>(null);
  const [filters, setFilters] = useState({
    searchTerm: "",
    category: null as string | null,
    subcategory: null as string | null,
    location: "",
    availability: null as string | null,
    status: null as string | null,
    offeredProduct: "",
    ownerName: "",
  });

  useEffect(() => {
    if (!user?.user_id) return;
    setLoading(true);
    getUserRequests(user.user_id)
      .then((data) => setRequests(data))
      .catch(() => toast.error("שגיאה בטעינת הבקשות"))
      .finally(() => setLoading(false));
  }, [user?.user_id]);

  const filteredRequests = filterRequests(requests, filters);
  const totalPages = Math.ceil(filteredRequests.length / ITEMS_PER_PAGE);
  const paginatedRequests = filteredRequests.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <div className="p-6 min-w-96">
      <h1 className="text-2xl font-bold mb-4">בקשות ששלחתי</h1>

      <Filters
        filters={filters}
        setFilters={setFilters}
        resetPage={() => setCurrentPage(1)}
        fields={sentRequestFilters}
      />


      {loading ? (
        <SkeletonTable />
      ) : filteredRequests.length === 0 ? (
        <p className="text-center text-gray-500">לא נמצאו בקשות תואמות.</p>
      ) : (
        <RequestsTable
          requests={paginatedRequests}
          onImageClick={setModalImage}
          type="sent"
        />
      )}

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />

      {modalImage && (
        <ImageDialog imageUrl={modalImage} onClose={() => setModalImage(null)} />
      )}
    </div>
  );
}
