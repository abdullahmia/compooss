import { CollectionView } from "@/components/collection-view";
import { Suspense } from "react";

type Props = {
  params: Promise<{ dbName: string; collectionName: string }>;
};

async function CollectionPageContent({ params }: Props) {
  const { dbName, collectionName } = await params;
  return <CollectionView dbName={dbName} collectionName={collectionName} />;
}

function CollectionPageFallback() {
  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden">
      <div className="px-4 py-3 border-b border-border bg-card/50">
        <div className="h-6 w-48 bg-muted/50 rounded animate-pulse" />
      </div>
      <div className="flex-1 flex items-center justify-center text-muted-foreground text-sm">
        Loading collection…
      </div>
    </div>
  );
}

export default function CollectionPage({ params }: Props) {
  return (
    <Suspense fallback={<CollectionPageFallback />}>
      <CollectionPageContent params={params} />
    </Suspense>
  );
}
