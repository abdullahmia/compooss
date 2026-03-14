import { DatabaseView } from "@/components/database-view";

type Props = {
  params: Promise<{ dbName: string }>;
};

export default async function DatabasePage({ params }: Props) {
  const { dbName } = await params;
  return <DatabaseView dbName={dbName} />;
}
