import { Suspense } from "react";
import { DatabaseView } from "@/components/database-view";
import { DatabasePageSkeleton } from "@/components/skeletons/database-page-skeleton";

type Props = {
  params: Promise<{ dbName: string }>;
};

export default async function DatabasePage({ params }: Props) {
  const { dbName } = await params;
  return (
    <Suspense fallback={<DatabasePageSkeleton />}>
      <DatabaseView dbName={dbName} />
    </Suspense>
  );
}
