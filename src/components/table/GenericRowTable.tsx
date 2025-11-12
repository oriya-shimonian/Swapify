// import type { Column } from "./GenericTable";

// interface GenericRowTableProps<T> {
//   item: T;
//   columns: Column<T>[];
//   gridCols?: string;
// }

// const GenericRowTable = <T,>({ item, columns, gridCols = "grid-cols-10" }: GenericRowTableProps<T>) => {
//   return (
//     <div className={`grid ${gridCols} gap-4 px-6 py-4 hover:bg-gray-50 transition-colors`}>
//       {columns.map((col, i) => (
//         <div key={i} className={col.width ?? "col-span-1"}>
//           {col.renderCell(item)}
//         </div>
//       ))}
//     </div>
//   );
// };

// export default GenericRowTable;

import type { Column } from "./GenericTable";

interface GenericRowTableProps<T> {
  item: T;
  columns: Column<T>[];
  gridCols?: string;
}

const GenericRowTable = <T,>({
  item,
  columns,
  gridCols = "grid-cols-10",
}: GenericRowTableProps<T>) => {
  return (
    <div
      className={`grid ${gridCols} gap-4 px-6 py-4 transition-colors hover:bg-gray-50 dark:hover:bg-gray-800`}
    >
      {columns.map((col, i) => (
        <div key={i} className={col.width ?? "col-span-1"}>
          {col.renderCell(item)}
        </div>
      ))}
    </div>
  );
};

export default GenericRowTable;

