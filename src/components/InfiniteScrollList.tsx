import { ReactNode } from "react";

export function InfiniteScrollList({
  items,
  renderItem,
  isFetching,
  hasMore,
  bottomRef,
}: {
  items: any[];
  renderItem: (item: any, isLast: boolean) => ReactNode;
  isFetching: boolean;
  hasMore: boolean;
  bottomRef: (node: HTMLElement | null) => void;
}) {
  return (
    <div className="space-y-4">
      {items.map((item, i) => renderItem(item, i === items.length - 1))}

      {hasMore && (
        <div className="flex justify-center py-6 min-h-[40px]">
          {isFetching && (
            <div className="animate-spin rounded-full h-6 w-6 border-2 border-t-transparent border-blue-500" />
          )}
        </div>
      )}
    </div>
  );
}
