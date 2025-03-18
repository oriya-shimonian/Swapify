// // // import { useState, useEffect } from "react";
// // // import { Input } from "@/components/ui/input";
// // // import {
// // //   Select,
// // //   SelectContent,
// // //   SelectGroup,
// // //   SelectItem,
// // //   SelectTrigger,
// // //   SelectValue,
// // // } from "@/components/ui/select";
// // // import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// // // import useProducts from "@/hooks/useProducts";
// // // import { IProduct } from "@/types/type";


// // // export default function HomePage() {
// // //   const { products, loading, error } = useProducts();
// // //   const [filteredProducts, setFilteredProducts] = useState<IProduct[]>([]);
// // //   const [searchTerm, setSearchTerm] = useState("");
// // //   const [category, setCategory] = useState<string | null>(null);
// // //   const [condition, setCondition] = useState<string | null>(null);

// // //   // Handle filtering
// // //   useEffect(() => {
// // //     let filtered = products;
// // //     if (searchTerm) {
// // //       filtered = filtered.filter(p => p.title.toLowerCase().includes(searchTerm.toLowerCase()));
// // //     }
// // //     if (category) {
// // //       filtered = filtered.filter(p => p.category === category);
// // //     }
// // //     if (condition) {
// // //       filtered = filtered.filter(p => p.condition === condition);
// // //     }
// // //     setFilteredProducts(filtered);
// // //   }, [searchTerm, category, condition, products]);

// // //   if (loading) return <p className="text-center text-gray-500">Loading products...</p>;
// // //   if (error) return <p className="text-center text-red-500">Error: {error}</p>;

// // //   return (
// // //     <div className="container mx-auto px-4 py-6 mt-14">
// // //       <h1 className="text-3xl font-bold text-center mb-6">Discover & Swap Items</h1>

// // //       {/* Search Bar */}
// // //       <div className="flex flex-col md:flex-row gap-4 justify-center items-center mb-6">
// // //         <Input
// // //           placeholder="Search products..."
// // //           value={searchTerm}
// // //           onChange={e => setSearchTerm(e.target.value)}
// // //           className="w-full md:w-1/2"
// // //         />
        
// // //         <Select onValueChange={setCategory}>
// // //           <SelectTrigger className="w-full md:w-1/3">
// // //             <SelectValue placeholder="Filter by Category" />
// // //           </SelectTrigger>
// // //           <SelectContent>
// // //             <SelectGroup>
// // //               <SelectItem value="Puzzle">Puzzle</SelectItem>
// // //               <SelectItem value="Book">Book</SelectItem>
// // //               <SelectItem value="Board Game">Board Game</SelectItem>
// // //             </SelectGroup>
// // //           </SelectContent>
// // //         </Select>
        
// // //         <Select onValueChange={setCondition}>
// // //           <SelectTrigger className="w-full md:w-1/3">
// // //             <SelectValue placeholder="Filter by Condition" />
// // //           </SelectTrigger>
// // //           <SelectContent>
// // //             <SelectGroup>
// // //               <SelectItem value="New">New</SelectItem>
// // //               <SelectItem value="Used">Used</SelectItem>
// // //               <SelectItem value="Good Condition">Good Condition</SelectItem>
// // //             </SelectGroup>
// // //           </SelectContent>
// // //         </Select>
// // //       </div>

// // //       {/* Products Grid */}
// // //       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
// // //         {filteredProducts.length > 0 ? (
// // //           filteredProducts.map(product => (
// // //             <Card key={product.id} className="shadow-md hover:shadow-xl transition">
// // //               <CardHeader>
// // //                 {product.image_url ? (
// // //                   <img
// // //                     src={product.image_url}
// // //                     alt={product.title}
// // //                     className="w-full h-40 object-cover rounded-t-md"
// // //                   />
// // //                 ) : (
// // //                   <div className="w-full h-40 bg-gray-300 flex items-center justify-center rounded-t-md">
// // //                     <span className="text-gray-600">No Image</span>
// // //                   </div>
// // //                 )}
// // //               </CardHeader>
// // //               <CardContent className="p-4">
// // //                 <CardTitle className="text-lg font-semibold">{product.title}</CardTitle>
// // //                 <p className="text-sm text-gray-600">{product.description}</p>
// // //                 <div className="mt-3">
// // //                   <span className="bg-blue-500 text-white px-2 py-1 text-xs rounded">{product.category}</span>
// // //                   <span className="bg-gray-200 text-gray-800 px-2 py-1 text-xs rounded ml-2">{product.condition}</span>
// // //                 </div>
// // //               </CardContent>
// // //             </Card>
// // //           ))
// // //         ) : (
// // //           <p className="text-center col-span-full text-gray-500">No products found.</p>
// // //         )}
// // //       </div>
// // //     </div>
// // //   );
// // // }
// // import { useState, useEffect } from "react";
// // import { Input } from "@/components/ui/input";
// // import {
// //   Select,
// //   SelectContent,
// //   SelectGroup,
// //   SelectItem,
// //   SelectTrigger,
// //   SelectValue,
// // } from "@/components/ui/select";
// // import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// // import useProducts from "@/hooks/useProducts";
// // import { IProduct } from "@/types/products";

// // export default function HomePage() {
// //   const { products, loading, error } = useProducts();
// //   const [filteredProducts, setFilteredProducts] = useState<IProduct[]>([]);
// //   const [searchTerm, setSearchTerm] = useState("");
// //   const [category, setCategory] = useState<string | null>(null);
// //   const [condition, setCondition] = useState<string | null>(null);
// //   const [location, setLocation] = useState<string | null>(null);
// //   const [subcategory, setSubcategory] = useState<string | null>(null);
// //   const [sortBy, setSortBy] = useState<string>("newest"); // ברירת מחדל - תאריך חדש ביותר

// //   // Handle filtering
// //   useEffect(() => {
// //     let filtered = products;

// //     if (searchTerm) {
// //       filtered = filtered.filter(p => p.title.toLowerCase().includes(searchTerm.toLowerCase()));
// //     }
// //     if (category) {
// //       filtered = filtered.filter(p => p.category === category);
// //     }
// //     if (condition) {
// //       filtered = filtered.filter(p => p.condition === condition);
// //     }
// //     if (location) {
// //       filtered = filtered.filter(p => p.location === location);
// //     }
// //     if (subcategory) {
// //       filtered = filtered.filter(p => p.subcategory === subcategory);
// //     }

// //     // Sorting
// //     if (sortBy === "newest") {
// //       filtered = filtered.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
// //     } else if (sortBy === "oldest") {
// //       filtered = filtered.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
// //     } else if (sortBy === "title") {
// //       filtered = filtered.sort((a, b) => a.title.localeCompare(b.title));
// //     }

// //     setFilteredProducts(filtered);
// //   }, [searchTerm, category, condition, location, subcategory, sortBy, products]);

// //   if (loading) return <p className="text-center text-gray-500">Loading products...</p>;
// //   if (error) return <p className="text-center text-red-500">Error: {error}</p>;

// //   return (
// //     <div className="container mx-auto px-4 py-6 mt-20">
// //       <h1 className="text-3xl font-bold text-center mb-6">Discover & Swap Items</h1>

// //       {/* Search & Filters */}
// //       <div className="flex flex-col md:flex-row gap-4 justify-center items-center mb-6">
// //         <Input
// //           placeholder="Search products..."
// //           value={searchTerm}
// //           onChange={e => setSearchTerm(e.target.value)}
// //           className="w-full md:w-1/3"
// //         />
        
// //         <Select onValueChange={setCategory}>
// //           <SelectTrigger className="w-full md:w-1/4">
// //             <SelectValue placeholder="Category" />
// //           </SelectTrigger>
// //           <SelectContent>
// //             <SelectGroup>
// //               <SelectItem value="Puzzle">Puzzle</SelectItem>
// //               <SelectItem value="Book">Book</SelectItem>
// //               <SelectItem value="Board Game">Board Game</SelectItem>
// //             </SelectGroup>
// //           </SelectContent>
// //         </Select>

// //         <Select onValueChange={setSubcategory}>
// //           <SelectTrigger className="w-full md:w-1/4">
// //             <SelectValue placeholder="Subcategory" />
// //           </SelectTrigger>
// //           <SelectContent>
// //             <SelectGroup>
// //               <SelectItem value="Fantasy">Fantasy</SelectItem>
// //               <SelectItem value="Thriller">Thriller</SelectItem>
// //               <SelectItem value="Strategy">Strategy</SelectItem>
// //             </SelectGroup>
// //           </SelectContent>
// //         </Select>

// //         <Select onValueChange={setCondition}>
// //           <SelectTrigger className="w-full md:w-1/4">
// //             <SelectValue placeholder="Condition" />
// //           </SelectTrigger>
// //           <SelectContent>
// //             <SelectGroup>
// //               <SelectItem value="New">New</SelectItem>
// //               <SelectItem value="Used">Used</SelectItem>
// //               <SelectItem value="Good Condition">Good Condition</SelectItem>
// //             </SelectGroup>
// //           </SelectContent>
// //         </Select>

// //         <Select onValueChange={setLocation}>
// //           <SelectTrigger className="w-full md:w-1/4">
// //             <SelectValue placeholder="Location" />
// //           </SelectTrigger>
// //           <SelectContent>
// //             <SelectGroup>
// //               <SelectItem value="Tel Aviv">Tel Aviv</SelectItem>
// //               <SelectItem value="Jerusalem">Jerusalem</SelectItem>
// //               <SelectItem value="Haifa">Haifa</SelectItem>
// //             </SelectGroup>
// //           </SelectContent>
// //         </Select>

// //         <Select onValueChange={setSortBy}>
// //           <SelectTrigger className="w-full md:w-1/4">
// //             <SelectValue placeholder="Sort by" />
// //           </SelectTrigger>
// //           <SelectContent>
// //             <SelectGroup>
// //               <SelectItem value="newest">Newest</SelectItem>
// //               <SelectItem value="oldest">Oldest</SelectItem>
// //               <SelectItem value="title">Title</SelectItem>
// //             </SelectGroup>
// //           </SelectContent>
// //         </Select>
// //       </div>

// //       {/* Products Grid */}
// //       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
// //         {filteredProducts.length > 0 ? (
// //           filteredProducts.map(product => (
// //             <Card key={product.id} className="shadow-md hover:shadow-xl transition">
// //               <CardHeader>
// //                 {product.image_url ? (
// //                   <img
// //                     src={product.image_url}
// //                     alt={product.title}
// //                     className="w-full h-40 object-cover rounded-t-md"
// //                   />
// //                 ) : (
// //                   <div className="w-full h-40 bg-gray-300 flex items-center justify-center rounded-t-md">
// //                     <span className="text-gray-600">No Image</span>
// //                   </div>
// //                 )}
// //               </CardHeader>
// //               <CardContent className="p-4">
// //                 <CardTitle className="text-lg font-semibold">{product.title}</CardTitle>
// //                 <p className="text-sm text-gray-600">{product.description}</p>
// //                 <div className="mt-3">
// //                   <span className="bg-blue-500 text-white px-2 py-1 text-xs rounded">{product.category}</span>
// //                   <span className="bg-gray-200 text-gray-800 px-2 py-1 text-xs rounded ml-2">{product.condition}</span>
// //                 </div>
// //               </CardContent>
// //             </Card>
// //           ))
// //         ) : (
// //           <p className="text-center col-span-full text-gray-500">No products found.</p>
// //         )}
// //       </div>
// //     </div>
// //   );
// // }


// import { useState, useEffect } from "react";
// import { Input } from "@/components/ui/input";
// import {
//   Select,
//   SelectContent,
//   SelectGroup,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import useProducts from "@/hooks/useProducts";
// import { IProduct, ProductCategory } from "@/types/products";

// export default function HomePage() {
//   const { products, loading, error } = useProducts();
//   const [filteredProducts, setFilteredProducts] = useState<IProduct[]>([]);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [category, setCategory] = useState<string>("all");
//   const [condition, setCondition] = useState<string | null>(null);
//   const [location, setLocation] = useState<string | null>(null);
//   const [subcategory, setSubcategory] = useState<string | null>(null);
//   const [sortBy, setSortBy] = useState<string>("newest");

//   // תתי קטגוריות לפי קטגוריה שנבחרה
//   const subcategoriesByCategory: Record<string, string[]> = {
//     Puzzle: ["Nature", "3D", "Scenic", "Challenge"],
//     Book: ["Fiction", "Non-Fiction", "Thriller", "Science Fiction"],
//     "Board Game": ["Strategy", "Family", "Classic"],
//   };

//   const availableSubcategories = category !== "all" ? subcategoriesByCategory[category] || [] : [];

//   // Handle filtering
//   useEffect(() => {
//     let filtered = products;

//     if (searchTerm) {
//       filtered = filtered.filter((p) => p.title.toLowerCase().includes(searchTerm.toLowerCase()));
//     }
//     if (category !== "all") {
//       filtered = filtered.filter((p) => p.category === category);
//     }
//     if (condition) {
//       filtered = filtered.filter((p) => p.condition === condition);
//     }
//     if (location) {
//       filtered = filtered.filter((p) => p.location.toLowerCase() === location.toLowerCase());
//     }
//     if (subcategory) {
//       filtered = filtered.filter((p) => p.subcategory === subcategory);
//     }

//     // Sorting
//     if (sortBy === "newest") {
//       filtered = filtered.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
//     } else if (sortBy === "oldest") {
//       filtered = filtered.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
//     } else if (sortBy === "title") {
//       filtered = filtered.sort((a, b) => a.title.localeCompare(b.title));
//     }

//     setFilteredProducts(filtered);
//   }, [searchTerm, category, condition, location, subcategory, sortBy, products]);

//   // כאשר מחליפים קטגוריה - ננקה את תת-הקטגוריה
//   useEffect(() => {
//     setSubcategory(null);
//   }, [category]);

//   if (loading) return <p className="text-center text-gray-500">Loading products...</p>;
//   if (error) return <p className="text-center text-red-500">Error: {error}</p>;

//   return (
//     <div className="container mx-auto px-4 py-6 mt-14">
//       <h1 className="text-3xl font-bold text-center mb-6">Discover & Swap Items</h1>

//       {/* Search & Filters */}
//       <div className="flex flex-col md:flex-row gap-4 justify-center items-center mb-6">
//         <Input
//           placeholder="Search products..."
//           value={searchTerm}
//           onChange={(e) => setSearchTerm(e.target.value)}
//           className="w-full md:w-1/3"
//         />

//         {/* Filter by Category */}
//         <Select onValueChange={setCategory}>
//           <SelectTrigger className="w-full md:w-1/4">
//             <SelectValue placeholder="Filter by Category" />
//           </SelectTrigger>
//           <SelectContent>
//             <SelectGroup>
//               <SelectItem value="all">All Categories</SelectItem>
//               <SelectItem value="Puzzle">Puzzle</SelectItem>
//               <SelectItem value="Book">Book</SelectItem>
//               <SelectItem value="Board Game">Board Game</SelectItem>
//             </SelectGroup>
//           </SelectContent>
//         </Select>

//         {/* Filter by Subcategory (Dynamic) */}
//         <Select onValueChange={setSubcategory} disabled={category === "all" || availableSubcategories.length === 0}>
//           <SelectTrigger className="w-full md:w-1/4">
//             <SelectValue placeholder={availableSubcategories.length > 0 ? "Filter by Subcategory" : "No Subcategories"} />
//           </SelectTrigger>
//           <SelectContent>
//             <SelectGroup>
//               {availableSubcategories.map((sub) => (
//                 <SelectItem key={sub} value={sub}>
//                   {sub}
//                 </SelectItem>
//               ))}
//             </SelectGroup>
//           </SelectContent>
//         </Select>

//         {/* Filter by Condition */}
//         <Select onValueChange={setCondition}>
//           <SelectTrigger className="w-full md:w-1/4">
//             <SelectValue placeholder="Filter by Condition" />
//           </SelectTrigger>
//           <SelectContent>
//             <SelectGroup>
//               <SelectItem value="New">New</SelectItem>
//               <SelectItem value="Used">Used</SelectItem>
//               <SelectItem value="Good Condition">Good Condition</SelectItem>
//             </SelectGroup>
//           </SelectContent>
//         </Select>

//         {/* Filter by Location */}
//         <Select onValueChange={setLocation}>
//           <SelectTrigger className="w-full md:w-1/4">
//             <SelectValue placeholder="Filter by Location" />
//           </SelectTrigger>
//           <SelectContent>
//             <SelectGroup>
//               <SelectItem value="Tel Aviv">Tel Aviv</SelectItem>
//               <SelectItem value="Jerusalem">Jerusalem</SelectItem>
//               <SelectItem value="Haifa">Haifa</SelectItem>
//               <SelectItem value="New York">New York</SelectItem>
//               <SelectItem value="Los Angeles">Los Angeles</SelectItem>
//               <SelectItem value="Chicago">Chicago</SelectItem>
//             </SelectGroup>
//           </SelectContent>
//         </Select>

//         {/* Sorting Options */}
//         <Select onValueChange={setSortBy}>
//           <SelectTrigger className="w-full md:w-1/4">
//             <SelectValue placeholder="Sort by" />
//           </SelectTrigger>
//           <SelectContent>
//             <SelectGroup>
//               <SelectItem value="newest">Newest</SelectItem>
//               <SelectItem value="oldest">Oldest</SelectItem>
//               <SelectItem value="title">Title</SelectItem>
//             </SelectGroup>
//           </SelectContent>
//         </Select>
//       </div>

//       {/* Products Grid */}
//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
//         {filteredProducts.length > 0 ? (
//           filteredProducts.map((product) => (
//             <Card key={product.id} className="shadow-md hover:shadow-xl transition">
//               <CardHeader>
//                 {product.image_url ? (
//                   <img
//                     src={product.image_url}
//                     alt={product.title}
//                     className="w-full h-40 object-cover rounded-t-md"
//                   />
//                 ) : (
//                   <div className="w-full h-40 bg-gray-300 flex items-center justify-center rounded-t-md">
//                     <span className="text-gray-600">No Image</span>
//                   </div>
//                 )}
//               </CardHeader>
//               <CardContent className="p-4">
//                 <CardTitle className="text-lg font-semibold">{product.title}</CardTitle>
//                 <p className="text-sm text-gray-600">{product.description}</p>
//               </CardContent>
//             </Card>
//           ))
//         ) : (
//           <p className="text-center col-span-full text-gray-500">No products found.</p>
//         )}
//       </div>
//     </div>
//   );
// }

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import ProductCard from "@/components/ProductCard";
import useProducts from "@/hooks/useProducts";
import { IProduct } from "@/types/products";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

export default function HomePage() {
  const { products, loading, error } = useProducts();
  const [filteredProducts, setFilteredProducts] = useState<IProduct[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [category, setCategory] = useState<string>("all");
  const [condition, setCondition] = useState<string | null>(null);
  const [location, setLocation] = useState<string | null>(null);
  const [subcategory, setSubcategory] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<string>("newest");
  const navigate = useNavigate();

  useEffect(() => {
    let filtered = products;

    if (searchTerm) {
      filtered = filtered.filter((p) => p.title.toLowerCase().includes(searchTerm.toLowerCase()));
    }
    if (category !== "all") {
      filtered = filtered.filter((p) => p.category === category);
    }
    if (condition) {
      filtered = filtered.filter((p) => p.condition === condition);
    }
    if (location) {
      filtered = filtered.filter((p) => p.location.toLowerCase() === location.toLowerCase());
    }
    if (subcategory) {
      filtered = filtered.filter((p) => p.subcategory === subcategory);
    }

    // Sorting
    if (sortBy === "newest") {
      filtered = filtered.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    } else if (sortBy === "oldest") {
      filtered = filtered.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
    } else if (sortBy === "title") {
      filtered = filtered.sort((a, b) => a.title.localeCompare(b.title));
    }

    setFilteredProducts(filtered);
  }, [searchTerm, category, condition, location, subcategory, sortBy, products]);

  return (
    <div className="container mx-auto px-4 py-6 mt-14">
      <h1 className="text-3xl font-bold text-center mb-6">Discover & Swap Items</h1>

      {/* כפתור הוספת מוצר */}
      <div className="flex justify-end mb-4">
        <Button onClick={() => navigate("/add-product")} className="bg-green-500 text-white">
          + Add Product
        </Button>
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col md:flex-row gap-4 justify-center items-center mb-6">
        <Input
          placeholder="Search products..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full md:w-1/3"
        />

        <Select onValueChange={setCategory}>
          <SelectTrigger className="w-full md:w-1/4">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="Puzzle">Puzzle</SelectItem>
              <SelectItem value="Book">Book</SelectItem>
              <SelectItem value="Board Game">Board Game</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>

        <Select onValueChange={setCondition}>
          <SelectTrigger className="w-full md:w-1/4">
            <SelectValue placeholder="Condition" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="New">New</SelectItem>
              <SelectItem value="Used">Used</SelectItem>
              <SelectItem value="Good Condition">Good Condition</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>

        <Select onValueChange={setLocation}>
          <SelectTrigger className="w-full md:w-1/4">
            <SelectValue placeholder="Location" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="Tel Aviv">Tel Aviv</SelectItem>
              <SelectItem value="Jerusalem">Jerusalem</SelectItem>
              <SelectItem value="Haifa">Haifa</SelectItem>
              <SelectItem value="New York">New York</SelectItem>
              <SelectItem value="Los Angeles">Los Angeles</SelectItem>
              <SelectItem value="Chicago">Chicago</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProducts.length > 0 ? (
          filteredProducts.map((product) => <ProductCard key={product.product_id} product={product} />)
        ) : (
          <p className="text-center col-span-full text-gray-500">No products found.</p>
        )}
      </div>
    </div>
  );
}
