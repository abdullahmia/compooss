interface DatabasesListSkeletonProps {
  /** Number of database card skeletons. Defaults to 6. */
  cardCount?: number;
}

export function DatabasesListSkeleton({ cardCount = 6 }: DatabasesListSkeletonProps) {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: cardCount }).map((_, i) => (
        <div
          key={i}
          className="rounded-lg border border-border bg-card p-4 animate-pulse"
          aria-hidden
        >
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-center gap-3 min-w-0">
              <div className="h-10 w-10 shrink-0 rounded-lg bg-muted" />
              <div className="min-w-0 flex-1 space-y-2">
                <div className="h-4 w-28 bg-muted rounded" />
                <div className="h-3 w-16 bg-muted rounded" />
              </div>
            </div>
            <div className="h-8 w-8 shrink-0 rounded bg-muted" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function DatabasesListPageSkeleton() {
  return (
    <div className="flex flex-1 flex-col h-full overflow-hidden bg-background p-4">
      <div className="mb-4 h-16 w-64 rounded bg-muted/50 animate-pulse" />
      <DatabasesListSkeleton cardCount={6} />
    </div>
  );
}
