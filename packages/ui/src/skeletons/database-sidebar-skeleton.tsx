interface DatabaseSidebarSkeletonProps {
  /** Number of database item skeletons. Defaults to 4. */
  itemCount?: number;
}

export function DatabaseSidebarSkeleton({
  itemCount = 4,
}: DatabaseSidebarSkeletonProps) {
  return (
    <div className="px-2 py-1 space-y-0.5 animate-pulse">
      {Array.from({ length: itemCount }).map((_, i) => (
        <div
          key={i}
          className="flex items-center w-full rounded-sm py-1.5"
          aria-hidden
        >
          <div className="flex items-center justify-center p-1.5 shrink-0">
            <div className="h-3.5 w-3.5 bg-muted rounded" />
          </div>
          <div className="flex-1 flex items-center gap-1.5 px-1 min-w-0">
            <div className="h-3.5 w-3.5 bg-muted rounded shrink-0" />
            <div className="h-3.5 w-24 bg-muted rounded flex-1 max-w-[140px]" />
          </div>
          <div className="shrink-0 pr-1">
            <div className="h-4 w-12 bg-muted rounded" />
          </div>
        </div>
      ))}
    </div>
  );
}
