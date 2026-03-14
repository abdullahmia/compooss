import { CollectionView } from "@/components/collection-view";
import { Suspense } from "react";

type Props = {
  params: Promise<{ dbName: string; collectionName: string }>;
};

async function CollectionPageContent({ params }: Props) {
  const { dbName, collectionName } = await params;
  return <CollectionView dbName={dbName} collectionName={collectionName} />;
}

export default function CollectionPage({ params }: Props) {
  return (
    <Suspense>
      <CollectionPageContent params={params} />
    </Suspense>
  );
}
