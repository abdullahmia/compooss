"use client";

import { CollectionView } from "@/components/collection-view";
import { Sidebar } from "@/components/sidebar/sidebar";
import { TopBar } from "@/components/top-bar";
import { WelcomeView } from "@/components/welcome-view";
import { useRouter, useSearchParams } from "next/navigation";

interface IPlaygroundShellProps {
  // initialConnectionString: string;
  // initialConnectionError: string | null;
}

export function PlaygroundShell(
  {
    // initialConnectionString,
    // initialConnectionError,
  }: IPlaygroundShellProps,
) {
  const searchParams = useSearchParams();
  // const [connectionString, setConnectionString] = useState(
  //   initialConnectionString,
  // );
  // const [connectionError, setConnectionError] = useState<string | null>(
  //   initialConnectionError,
  // );

  const router = useRouter();

  const dbName = searchParams.get("db");
  const collectionName = searchParams.get("collection");

  const handleRefreshConnection = () => {
    router.refresh();
  };

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      <TopBar
        // connectionString={connectionString}
        // onDisconnect={handleDisconnect}
        onRefreshConnection={handleRefreshConnection}
      />
      {/* {connectionError && (
        <div className="px-4 py-2 bg-destructive/10 border-b border-destructive/30 text-xs text-destructive">
          {connectionError}
        </div>
      )} */}
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />

        {dbName && collectionName ? (
          <CollectionView dbName={dbName} collectionName={collectionName} />
        ) : (
          <WelcomeView />
        )}
      </div>
    </div>
  );
}
