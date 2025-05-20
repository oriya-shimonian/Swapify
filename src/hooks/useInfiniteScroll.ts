import { useCallback, useRef } from "react";

export function useInfiniteScroll({
  isFetching,
  hasMore,
  onLoadMore,
}: {
  isFetching: boolean;
  hasMore: boolean;
  onLoadMore: () => void;
}) {
  const observer = useRef<IntersectionObserver | null>(null);

  const ref = useCallback(
    (node: HTMLElement | null) => {
      if (isFetching) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          onLoadMore();
        }
      });
      if (node) observer.current.observe(node);
    },
    [isFetching, hasMore, onLoadMore]
  );

  return ref;
}
