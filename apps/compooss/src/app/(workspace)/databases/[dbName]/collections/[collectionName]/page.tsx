import { CollectionView } from "@/components/collection-view";
import { Suspense } from "react";

type Props = {
  params: Promise<{ dbName: string; collectionName: string }>;
};

export default async function CollectionPage({ params }: Props) {
  const { dbName, collectionName } = await params;
  return (
    <Suspense>
      <CollectionView dbName={dbName} collectionName={collectionName} />
    </Suspense>
  );
}
