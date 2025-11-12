// // GenericTable.tsx
// import React from "react";
// import GenericRowTable from "./GenericRowTable";

// export interface Column<T> {
//   label: string;
//   width?: string; // Tailwind col-span
//   renderHeader?: () => React.ReactNode;
//   renderCell: (item: T) => React.ReactNode;
// }

// interface GenericTableProps<T> {
//   items: T[];
//   columns: Column<T>[];
//   rowKey: (item: T) => string | number;
//   gridCols?: string;
// }

// const GenericTable = <T,>({
//   items,
//   columns,
//   rowKey,
//   gridCols = "grid-cols-10",
// }: GenericTableProps<T>) => {
//   return (
//     <div className="overflow-x-auto w-full bg-white rounded-xl shadow-sm border border-gray-100">
//       <div
//         className={`grid ${gridCols} gap-4 items-center px-6 py-4 text-sm font-medium text-gray-600 bg-gray-50 border-b`}
//       >
//         {columns.map((col, i) => (
//           <div key={i} className={col.width ?? "col-span-1"}>
//             {col.renderHeader ? col.renderHeader() : col.label}
//           </div>
//         ))}
//       </div>

//       <div className="divide-y divide-gray-200">
//         {items.map((item) => (
//           <GenericRowTable
//             key={rowKey(item)}
//             item={item}
//             columns={columns}
//             gridCols={gridCols}
//           />
//         ))}
//       </div>
//     </div>
//   );
// };

// export default GenericTable;


import React from "react";
import GenericRowTable from "./GenericRowTable";

export interface Column<T> {
  label: string;
  width?: string; // Tailwind col-span
  renderHeader?: () => React.ReactNode;
  renderCell: (item: T) => React.ReactNode;
}

interface GenericTableProps<T> {
  items: T[];
  columns: Column<T>[];
  rowKey: (item: T) => string | number;
  gridCols?: string;
}

const GenericTable = <T,>({
  items,
  columns,
  rowKey,
  gridCols = "grid-cols-10",
}: GenericTableProps<T>) => {
  return (
    <div className="overflow-x-auto w-full bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
      <div
        className={`grid ${gridCols} gap-4 items-center px-6 py-4 text-sm font-medium text-gray-600 dark:text-gray-300 bg-gray-50 dark:bg-gray-800 border-b dark:border-gray-700`}
      >
        {columns.map((col, i) => (
          <div key={i} className={col.width ?? "col-span-1"}>
            {col.renderHeader ? col.renderHeader() : col.label}
          </div>
        ))}
      </div>

      <div className="divide-y divide-gray-200 dark:divide-gray-700">
        {items.map((item) => (
          <GenericRowTable
            key={rowKey(item)}
            item={item}
            columns={columns}
            gridCols={gridCols}
          />
        ))}
      </div>
    </div>
  );
};

export default GenericTable;
