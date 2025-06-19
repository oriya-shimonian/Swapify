import { Skeleton } from "@/components/ui/skeleton";

const StatsCardsSkeleton = () => (
  <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
    {Array.from({ length: 4 }).map((_, i) => (
      <div
        key={i}
        className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
      >
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm text-gray-600 mb-1">
              <Skeleton className="h-4 w-24" />
            </div>
            <div className="text-2xl font-bold text-gray-900">
              <Skeleton className="h-6 w-16" />
            </div>
          </div>
          <div className="p-3 bg-gray-100 rounded-full">
            <Skeleton className="w-6 h-6 rounded-full" />
          </div>
        </div>
      </div>
    ))}
  </div>
);

export default StatsCardsSkeleton;
