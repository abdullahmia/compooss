import { CollectionsSkeleton } from "@compooss/ui";

export default function Loading() {
  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden bg-background">
      <div className="px-4 py-3 border-b border-border bg-card/50">
        <div className="h-5 w-48 bg-muted/50 rounded animate-pulse" />
      </div>
      <div className="p-4">
        <CollectionsSkeleton />
      </div>
    </div>
  );
}
