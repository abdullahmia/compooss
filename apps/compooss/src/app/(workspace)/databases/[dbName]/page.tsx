import { DatabasePageSkeleton } from "@compooss/ui";
import { databaseRepository } from "@/lib/core-modules/database/database.repository";
import { DatabaseView } from "@/components/database-view";
import { notFound } from "next/navigation";
import { Suspense } from "react";

type Props = {
  params: Promise<{ dbName: string }>;
};

export default async function DatabasePage({ params }: Props) {
  const { dbName } = await params;
  const database = await databaseRepository.getDatabase(dbName);
  if (!database) notFound();
  return (
    <Suspense fallback={<DatabasePageSkeleton />}>
      <DatabaseView dbName={dbName} />
    </Suspense>
  );
}
