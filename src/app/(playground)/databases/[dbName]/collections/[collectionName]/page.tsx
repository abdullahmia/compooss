import { CollectionView } from "@/components/collection-view";

type Props = {
  params: Promise<{ dbName: string; collectionName: string }>;
};

export default async function CollectionPage({ params }: Props) {
  const { dbName, collectionName } = await params;
  return <CollectionView dbName={dbName} collectionName={collectionName} />;
}
