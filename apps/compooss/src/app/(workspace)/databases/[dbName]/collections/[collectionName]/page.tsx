import { CollectionView } from "@/lib/components/collections/collection-view.component";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Collection - Compooss",
  description: "Browse documents and manage this collection.",
};

type Props = {
  params: Promise<{ dbName: string; collectionName: string }>;
  searchParams: Promise<{ tab?: string }>;
};

export default async function CollectionPage({ params, searchParams }: Props) {
  const { dbName, collectionName } = await params;
  const { tab } = await searchParams;
  return (
    <CollectionView dbName={dbName} collectionName={collectionName} initialTab={tab} />
  );
}
