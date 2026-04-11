import { DatabaseView } from "@/lib/components/databases/database-view.component";
import { databaseRepository } from "@/lib/core-modules/database/database.repository";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Database - Compooss",
  description: "Browse collections in this database.",
};

type Props = {
  params: Promise<{ dbName: string }>;
};

export default async function DatabasePage({ params }: Props) {
  const { dbName } = await params;
  const database = await databaseRepository.getDatabase(dbName);
  if (!database) notFound();
  return <DatabaseView dbName={dbName} />;
}
