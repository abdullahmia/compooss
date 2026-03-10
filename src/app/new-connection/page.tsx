import { NewConnection } from "@/components/new-connection/new-connection";
import { getConnections } from "@/lib/services/connection";

export default async function NewConnectionPage() {
  const connections = await getConnections();

  return <NewConnection savedConnections={connections} />;
}
