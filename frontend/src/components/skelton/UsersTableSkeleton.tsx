import { Skeleton } from "@/components/ui/skeleton";

const UsersTableSkeleton = () => (
  <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-x-auto w-full">
    {/* Header */}
    <div className="grid grid-cols-10 gap-4 items-center px-6 py-4 text-sm font-medium text-gray-600 bg-gray-50 border-b">
      <div className="col-span-1"><Skeleton className="h-4 w-4" /></div>
      <div className="col-span-2"><Skeleton className="h-4 w-20" /></div>
      <div className="col-span-1"><Skeleton className="h-4 w-12" /></div>
      <div className="col-span-1"><Skeleton className="h-4 w-12" /></div>
      <div className="col-span-1"><Skeleton className="h-4 w-12" /></div>
      <div className="col-span-1"><Skeleton className="h-4 w-12" /></div>
      <div className="col-span-2"><Skeleton className="h-4 w-20" /></div>
      <div className="col-span-1"><Skeleton className="h-4 w-12" /></div>
    </div>

    {/* Body */}
    <div className="divide-y divide-gray-200">
      {Array.from({ length: 3 }).map((_, i) => (
        <div
          key={i}
          className="grid grid-cols-10 gap-4 justify-items-start px-6 py-4"
        >
          <div className="col-span-1">
            <Skeleton className="w-4 h-4 rounded" />
          </div>

          <div className="col-span-2 flex items-center gap-3">
            <Skeleton className="w-10 h-10 rounded-full" />
            <div>
              <Skeleton className="h-4 w-24 mb-1" />
              <Skeleton className="h-3 w-32" />
            </div>
          </div>

          <div className="col-span-1"><Skeleton className="h-6 w-16 rounded-full" /></div>
          <div className="col-span-1"><Skeleton className="h-5 w-5 rounded" /></div>
          <div className="col-span-1"><Skeleton className="h-4 w-20" /></div>
          <div className="col-span-1"><Skeleton className="h-6 w-16 rounded-full" /></div>
          <div className="col-span-2"><Skeleton className="h-4 w-28" /></div>
          <div className="col-span-1"><Skeleton className="h-8 w-16 rounded-lg" /></div>
        </div>
      ))}
    </div>
  </div>
);

export default UsersTableSkeleton;
