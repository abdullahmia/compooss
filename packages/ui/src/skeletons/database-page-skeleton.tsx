export function DatabasePageSkeleton() {
  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden bg-background">
      <div className="px-4 py-3 border-b border-border bg-card/50">
        <div className="h-6 w-32 bg-muted/50 rounded animate-pulse" />
      </div>
      <div className="flex-1 p-4 space-y-3">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-12 bg-muted/30 rounded-lg animate-pulse" />
        ))}
      </div>
    </div>
  );
}
