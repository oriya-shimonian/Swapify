// // components/ProductDetails/CategorySpecificFields.tsx
// import { InputHTMLAttributes } from "react";
// import { IProduct, ProductCategory } from "@/types/products";
// import { extraFieldsByCategory } from "@/lib/filters/extraFieldsByCategory";
// import IconAndBgWithText from "./ProductDetails/IconAndBgWithText";
// import { LucideIcon, SquareChartGantt } from "lucide-react";

// interface Props {
//   product: IProduct;
//   isEditing: boolean;
//   onChange?: (key: string, value: string | number) => void;
// }

// export default function CategorySpecificFields({
//   product,
//   isEditing,
//   onChange,
// }: Props) {
//   const fields = extraFieldsByCategory[product.category];
//   const COLORS = ["pink", "indigo", "cyan", "yellow", "emerald", "fuchsia"];

//   if (!fields) return null;

//   return (
//     <div className="grid grid-cols-2 gap-4 mt-6">
//       {fields.map((field) => {
//         const key = field.key as keyof IProduct;
//         const value = product[key] ?? "";

//         if (isEditing && onChange) {
//           return (
//             <input
//               key={field.key}
//               type="text"
//               placeholder={field.placeholder}
//               value={value as string | number}
//               onChange={(e) => {
//                 const raw = e.target.value;
//                 const finalValue =
//                   typeof product[key] === "number" ? Number(raw) : raw;
//                 onChange(field.key, finalValue);
//               }}
//               className="w-full bg-white/80 border rounded-xl p-3"
//             />
//           );
//         }

//         return field.icon ? (
//           <IconAndBgWithText
//             key={field.key}
//             Icon={field.icon as LucideIcon}
//             label={field.placeholder}
//             value={value?.toString() || ""}
//             color={COLORS[index & COLORS.length]}
//           />
//         ) : null;
//       })}
//     </div>
//   );
// }

import { IProduct, ProductCategory } from "@/types/products";
import { extraFieldsByCategory } from "@/lib/filters/extraFieldsByCategory";
import IconAndBgWithText from "./ProductDetails/IconAndBgWithText";
import { LucideIcon } from "lucide-react";

interface Props {
  product: IProduct;
  isEditing: boolean;
  onChange?: (key: string, value: string | number) => void;
}

const COLORS = ["pink", "lime", "cyan", "yellow", "emerald", "fuchsia"];

export default function CategorySpecificFields({
  product,
  isEditing,
  onChange,
}: Props) {
  const fields = extraFieldsByCategory[product.category];
  if (!fields) return null;



  return (
    <div className="grid grid-cols-2 gap-4 mt-6">
      {fields.map((field, index) => {
        const key = field.key as keyof IProduct;
        const value = product[key] ?? "";
        // @ts-ignore
          console.log("product.category", key, product["pieces_count"]);
  
        if (isEditing && onChange) {
          return (
            <input
              key={field.key}
              type="text"
              placeholder={field.placeholder}
              value={value as string | number}
              onChange={(e) => {
                const raw = e.target.value;
                const finalValue =
                  typeof product[key] === "number" ? Number(raw) : raw;
                onChange(field.key, finalValue);
              }}
              className="w-full bg-white/80 border rounded-xl p-3"
            />
          );
        }

        return field.icon ? (
          <IconAndBgWithText
            key={field.key}
            Icon={field.icon as LucideIcon}
            label={field.placeholder}
            value={value?.toString() || ""}
            color={COLORS[index % COLORS.length]} // 🎨 צבע משתנה לפי סדר
          />
        ) : null;
      })}
    </div>
  );
}
