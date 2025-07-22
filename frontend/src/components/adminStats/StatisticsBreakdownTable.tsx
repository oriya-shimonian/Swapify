// // // import GenericTable, { Column } from "@/components/table/GenericTable";
// // // import { getProductCategoryLabel, getSubcategoryLabel, ProductCategory } from "@/types/products";
// // // import { ProductBreakdownItem } from "@/types/statistics";

// // // interface Props {
// // //   data: ProductBreakdownItem[];
// // // }

// // // // const columns: Column<ProductBreakdownItem>[] = [
// // // //   {
// // // //     label: "תת קטגוריה",
// // // //     renderCell: (item) => item.subcategory || "לא מוגדרת",
// // // //   },
// // // //   {
// // // //     label: "סה״כ מוצרים",
// // // //     renderCell: (item) => item.total,
// // // //   },
// // // //   {
// // // //     label: "מוצרים זמינים",
// // // //     renderCell: (item) => item.available,
// // // //   },
// // // //   {
// // // //     label: "הוחלפו / ממתינים",
// // // //     renderCell: (item) => item.exchanged,
// // // //   },
// // // //   {
// // // //     label: "אחוז זמינות",
// // // //     renderCell: (item) =>
// // // //       item.total > 0
// // // //         ? `${Math.round((item.available / item.total) * 100)}%`
// // // //         : "—",
// // // //   },
// // // // ];
// // // const StatisticsBreakdownTable = ({ data }: Props) => {
// // //   const grouped = data.reduce((acc, item) => {
// // //     if (!acc[item.category]) acc[item.category] = [];
// // //     acc[item.category].push(item);
// // //     return acc;
// // //   }, {} as Record<string, ProductBreakdownItem[]>);

// // //   return (
// // //     <div className="overflow-x-auto border rounded-lg mt-6">
// // //       <table className="min-w-full divide-y divide-gray-200 text-sm">
// // //         <thead className="bg-gray-100 dark:bg-zinc-800">
// // //           <tr>
// // //             <th className="px-4 py-2 text-right font-semibold">קטגוריה</th>
// // //             <th className="px-4 py-2 text-right font-semibold">תת־קטגוריה</th>
// // //             <th className="px-4 py-2 text-center font-semibold">סה״כ</th>
// // //             <th className="px-4 py-2 text-center font-semibold">זמינים</th>
// // //             <th className="px-4 py-2 text-center font-semibold">מוחלפים</th>
// // //           </tr>
// // //         </thead>
// // //         <tbody className="divide-y divide-gray-100 dark:divide-zinc-700">
// // //           {Object.entries(grouped).map(([category, items]) =>
// // //             items.map((item, idx) => {
// // //               const categoryLabel = getProductCategoryLabel(
// // //                 item.category as ProductCategory
// // //               );
// // //               const subcategoryLabel = getSubcategoryLabel(
// // //                 item.category as ProductCategory,
// // //                 item.subcategory
// // //               );

// // //               return (
// // //                 <tr key={`${item.category}-${item.subcategory}`}>
// // //                   <td className="px-4 py-2 text-right">
// // //                     {idx === 0 ? categoryLabel : ""}
// // //                   </td>
// // //                   <td className="px-4 py-2 text-right">{subcategoryLabel}</td>
// // //                   <td className="px-4 py-2 text-center">{item.total}</td>
// // //                   <td className="px-4 py-2 text-center">{item.available}</td>
// // //                   <td className="px-4 py-2 text-center">{item.exchanged}</td>
// // //                 </tr>
// // //               );
// // //             })
// // //           )}
// // //         </tbody>
// // //       </table>
// // //     </div>
// // //   );
// // // };

// // // export default StatisticsBreakdownTable;


// // import GenericTable, { Column } from "@/components/table/GenericTable";
// // import { getProductCategoryLabel, getSubcategoryLabel, ProductCategory } from "@/types/products";
// // import { ProductBreakdownItem } from "@/types/statistics";



// // interface Props {
// //   data: ProductBreakdownItem[];
// // }


// // const StatisticsBreakdownTable = ({ data }: Props) => {
// //   const columns: Column<ProductBreakdownItem>[] = [
// //     {
// //       label: "קטגוריה",
// //       width: "col-span-2",
// //       renderCell: (item) =>
// //         getProductCategoryLabel(item.category as ProductCategory),
// //     },
// //     {
// //       label: "תת־קטגוריה",
// //       width: "col-span-3",
// //       renderCell: (item) =>
// //         getSubcategoryLabel(
// //           item.category as ProductCategory,
// //           item.subcategory
// //         ),
// //     },
// //     {
// //       label: "סה״כ",
// //       width: "col-span-2",
// //       renderCell: (item) => item.total,
// //     },
// //     {
// //       label: "זמינים",
// //       width: "col-span-2",
// //       renderCell: (item) => item.available,
// //     },
// //     {
// //       label: "הוחלפו",
// //       width: "col-span-1",
// //       renderCell: (item) => item.exchanged,
// //     },
// //   ];

// //   return (
// //     <div className="mt-6">
// //       <GenericTable
// //         items={data}
// //         columns={columns}
// //         rowKey={(item) => `${item.category}-${item.subcategory}`}
// //         gridCols="grid-cols-10"
// //       />
// //     </div>
// //   );
// // };

// // export default StatisticsBreakdownTable;


// import GenericTable, { Column } from "@/components/table/GenericTable";
// import { getProductCategoryLabel, getSubcategoryLabel, ProductCategory } from "@/types/products";
// import { ProductBreakdownItem } from "@/types/statistics";

// interface Props {
//   data: ProductBreakdownItem[];
// }

// const TableGroupedByCategory = ({ data }: Props) => {
//   const grouped = data.reduce<Record<string, ProductBreakdownItem[]>>((acc, item) => {
//     if (!acc[item.category]) acc[item.category] = [];
//     acc[item.category].push(item);
//     return acc;
//   }, {});

//   const columns: Column<ProductBreakdownItem>[] = [
//     {
//       label: "תת־קטגוריה",
//       width: "col-span-3",
//       renderCell: (item) =>
//         getSubcategoryLabel(item.category as ProductCategory, item.subcategory),
//     },
//     {
//       label: "סה״כ כמות",
//       width: "col-span-2",
//       renderCell: (item) => item.total,
//     },
//     {
//       label: "זמינים",
//       width: "col-span-2",
//       renderCell: (item) => item.available,
//     },
//     {
//       label: "הוחלפו",
//       width: "col-span-2",
//       renderCell: (item) => item.exchanged,
//     },
//     {
//       label: "שיעור ההחלפה",
//       width: "col-span-1",
//       renderCell: (item) =>
//         item.total > 0 ? `${Math.round((item.exchanged / item.total) * 100)}%` : "0%",
//     },
//   ];

//   return (
//     <div className="space-y-10 mt-6">
//       {Object.entries(grouped).map(([category, items]) => (
//         <div key={category}>
//           <h3 className="text-lg font-semibold mb-3 text-gray-700">
//             {getProductCategoryLabel(category as ProductCategory)}
//           </h3>
//           <GenericTable
//             items={items}
//             columns={columns}
//             rowKey={(item) => `${item.category}-${item.subcategory}`}
//             gridCols="grid-cols-10"
//           />
//         </div>
//       ))}
//     </div>
//   );
// };

// export default TableGroupedByCategory;

import GenericTable, { Column } from "@/components/table/GenericTable";
import {
  getProductCategoryLabel,
  getSubcategoryLabel,
  ProductCategory,
  subcategoryMaps,
} from "@/types/products";
import { ProductBreakdownItem } from "@/types/statistics";

interface Props {
  data: ProductBreakdownItem[];
}

const TableGroupedByCategory = ({ data }: Props) => {
  const grouped = data.reduce<Record<string, Record<string, ProductBreakdownItem>>>((acc, item) => {
    if (!acc[item.category]) acc[item.category] = {};
    acc[item.category][item.subcategory] = item;
    return acc;
  }, {});

  const columns: Column<ProductBreakdownItem>[] = [
    {
      label: "תת־קטגוריה",
      width: "col-span-3",
      renderCell: (item) =>
        getSubcategoryLabel(item.category as ProductCategory, item.subcategory),
    },
    {
      label: "סה״כ כמות",
      width: "col-span-2",
      renderCell: (item) => item.total,
    },
    {
      label: "זמינים",
      width: "col-span-2",
      renderCell: (item) => item.available,
    },
    {
      label: "הוחלפו",
      width: "col-span-2",
      renderCell: (item) => item.exchanged,
    },
    {
      label: "שיעור ההחלפה",
      width: "col-span-1",
      renderCell: (item) =>
        item.total > 0 ? `${Math.round((item.exchanged / item.total) * 100)}%` : "0%",
    },
  ];

  return (
    <div className="space-y-10 mt-6">
      {Object.entries(subcategoryMaps).map(([category, map]) => {
        const fullList: ProductBreakdownItem[] = Object.entries(map.toLabel).map(
          // @ts-ignore
          ([subcategoryValue, label]) => {
            const item =
              grouped[category]?.[subcategoryValue] ??
              ({
                category,
                subcategory: subcategoryValue,
                total: 0,
                available: 0,
                exchanged: 0,
              } as ProductBreakdownItem);
            return item;
          }
        );

        return (
          <div key={category}>
            <h3 className="text-lg font-semibold mb-3 text-gray-700">
              {getProductCategoryLabel(category as ProductCategory)}
            </h3>
            <GenericTable
              items={fullList}
              columns={columns}
              rowKey={(item) => `${item.category}-${item.subcategory}`}
              gridCols="grid-cols-10"
            />
          </div>
        );
      })}
    </div>
  );
};

export default TableGroupedByCategory;
