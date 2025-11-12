// // import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// // import { getProductCategoryLabel, getProductConditionLabel, IProduct } from "@/types/products";
// // import { useNavigate } from "react-router-dom";

// // export default function ProductCard({ product }: { product: IProduct }) {
// //   const navigate = useNavigate();

// //   return (
// //     <Card
// //       className="shadow-md hover:shadow-xl transition cursor-pointer bg-white dark:bg-gray-800 dark:border-gray-700"
// //       onClick={() => navigate(`/product/${product.product_id}`)}
// //       key={product.product_id}
// //     >
// //       <CardHeader className="p-0">
// //         {product.image_url ? (
// //           <img
// //             src={product.image_url}
// //             alt={product.title}
// //             className="w-full h-40 object-cover rounded-t-md"
// //           />
// //         ) : (
// //           <div className="w-full h-40 bg-gray-300 dark:bg-gray-700 flex items-center justify-center rounded-t-md">
// //             <span className="text-gray-600 dark:text-gray-400">No Image</span>
// //           </div>
// //         )}
// //       </CardHeader>
// //       <CardContent className="p-4">
// //         <CardTitle className="text-lg font-semibold dark:text-white">
// //           {product.title}
// //         </CardTitle>
// //         <p className="text-sm text-gray-600 dark:text-gray-300">
// //           {product.description}
// //         </p>
// //         <div className="mt-3 flex gap-2">
// //           <span className="bg-blue-500 text-white px-2 py-1 text-xs rounded">
// //             {getProductCategoryLabel(product.category)}
// //           </span>
// //           <span className="bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-100 px-2 py-1 text-xs rounded">
// //             {getProductConditionLabel(product.condition)}
// //           </span>
// //         </div>
// //       </CardContent>
// //     </Card>
// //   );
// // }

// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { getProductCategoryLabel, getProductConditionLabel, IProduct } from "@/types/products";
// import { useNavigate } from "react-router-dom";

// export default function ProductCard({
//   product,
//   actionButtons,
// }: {
//   product: IProduct;
//   actionButtons?: React.ReactNode;
// }) {
//   const navigate = useNavigate();

//   return (
//     <Card
//       className="relative shadow-md hover:shadow-xl transition cursor-pointer"
//       onClick={() => navigate(`/product/${product.product_id}`)}
//       key={product.product_id}
//     >
//       {actionButtons && (
//         <div className="absolute top-2 right-2 flex gap-2 z-10">
//           {actionButtons}
//         </div>
//       )}

//       <CardHeader>
//         {product.image_url ? (
//           <img
//             src={product.image_url}
//             alt={product.title}
//             className="w-full h-40 object-cover rounded-t-md"
//           />
//         ) : (
//           <div className="w-full h-40 bg-gray-300 flex items-center justify-center rounded-t-md">
//             <span className="text-gray-600">No Image</span>
//           </div>
//         )}
//       </CardHeader>

//       <CardContent className="p-4">
//         <CardTitle className="text-lg font-semibold">{product.title}</CardTitle>
//         <div className="text-sm text-gray-600 dark:text-gray-300 mt-1">
//           {getProductCategoryLabel(product.category)}
//           {product.subcategory && ` / ${product.subcategory}`}
//         </div>
//       </CardContent>
//     </Card>
//   );
// }


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
}: // actionButtons,
{
  product: IProduct;
  actionButtons?: React.ReactNode;
}) {
  const navigate = useNavigate();

  return (
    <Card
    //   className="w-full max-w-xs sm:max-w-sm mx-auto
    // relative overflow-hidden text-center rounded-2xl p-7 transition-all duration-300 ease-in-out
    // bg-white/5 backdrop-blur-md border border-white/10 hover:-translate-y-2 hover:bg-white/10
    // hover:before:opacity-100 before:absolute before:inset-[-2px] before:rounded-2xl before:transition-opacity before:duration-300
    // before:bg-gradient-to-br before:from-transparent before:via-indigo-500/10 before:to-transparent
    // cursor-pointer flex flex-col gap-4"
    className="w-full max-w-xs sm:max-w-sm mx-auto
    relative overflow-hidden text-center rounded-2xl p-7 transition-all duration-300 ease-in-out
    bg-white dark:bg-white/5 dark:backdrop-blur-md border border-white/10
    hover:-translate-y-2 hover:dark:bg-white/10
    hover:before:opacity-100 before:absolute before:inset-[-2px] before:rounded-2xl before:transition-opacity before:duration-300
    before:bg-gradient-to-br before:from-transparent before:via-indigo-500/10 before:to-transparent
    cursor-pointer flex flex-col gap-4"
      onClick={() => navigate(`/product/${product.product_id}`)}
      // className="rounded-lg border bg-card p-4 shadow-sm hover:shadow-md transition dark:bg-white/5 dark:backdrop-blur-md cursor-pointer relative flex flex-col gap-4"
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
          {product.subcategory &&
            ` / ${getSubcategoryLabel(product.category, product.subcategory)}`}
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
