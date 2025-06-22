import { Skeleton } from "@/components/ui/skeleton";

const FiltersSkeleton = () => (
  <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 pb-0 mb-8">
    <div className="flex flex-wrap justify-around items-center !gap-0 gap-4">
      <Skeleton className="h-10 w-56 mb-4" />
      <Skeleton className="h-10 w-56 mb-4" />
      <Skeleton className="h-10 w-56 mb-4" />
    </div>
  </div>
);

export default FiltersSkeleton;
