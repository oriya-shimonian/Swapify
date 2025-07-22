import { Skeleton } from "@/components/ui/skeleton";

interface SkeletonTableProps {
  rows?: number;
  columns?: number;
}

function RowSkeleton({ columns }: { columns: number }) {
  return (
    <div className="flex gap-4">
      {Array.from({ length: columns }).map((_, colIdx) => (
        <Skeleton
          key={colIdx}
          className={colIdx === 0 ? "w-14 h-14 rounded" : "h-6 w-1/4 rounded"}
        />
      ))}
    </div>
  );
}

export function SkeletonTable({ rows = 5, columns = 9 }: SkeletonTableProps) {
  return (
    <div className="space-y-4">
      {Array.from({ length: rows }).map((_, rowIdx) => (
        <RowSkeleton key={rowIdx} columns={columns} />
      ))}
    </div>
  );
}
