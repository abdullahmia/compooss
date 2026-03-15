import { CollectionView } from "@/components/collection-view";
import { Suspense } from "react";

type Props = {
  params: Promise<{ dbName: string; collectionName: string }>;
  searchParams: Promise<{ tab?: string }>;
};

export default async function CollectionPage({ params, searchParams }: Props) {
  const { dbName, collectionName } = await params;
  const { tab } = await searchParams;
  return (
    <Suspense>
      <CollectionView
        dbName={dbName}
        collectionName={collectionName}
        initialTab={tab}
      />
    </Suspense>
  );
}
