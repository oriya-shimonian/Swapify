import { Skeleton } from "@/components/ui/skeleton";

export function SkeletonProductCard() {
  return (
    <div className="rounded-lg border bg-card p-4 shadow-sm space-y-4">
      <Skeleton className="w-full h-48 rounded-md" />
      <Skeleton className="h-6 w-2/3" />
      <Skeleton className="h-4 w-1/3" />
      <div className="flex gap-2">
        <Skeleton className="h-8 w-24 rounded" />
        <Skeleton className="h-8 w-24 rounded" />
      </div>
    </div>
  );
}
