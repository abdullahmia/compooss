import { checkConnectionHealth } from "@/lib/services/connection/connection.service";
import { WelcomeView } from "@/components/welcome-view";
import { headers } from "next/headers";
import { Suspense } from "react";

async function HomeContent() {
  await headers();

  try {
    const health = await checkConnectionHealth();
    if (health.ok) {
      // Connected
    } else {
      // Not connected
    }
  } catch {
    // Connection check failed
  }
  return <WelcomeView />;
}

function HomeFallback() {
  return (
    <div className="flex-1 flex items-center justify-center bg-background">
      <div className="text-center max-w-md animate-pulse">
        <div className="w-16 h-16 rounded-2xl bg-muted mx-auto mb-6" />
        <div className="h-6 bg-muted rounded w-32 mx-auto mb-2" />
        <div className="h-4 bg-muted rounded w-64 mx-auto" />
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <Suspense fallback={<HomeFallback />}>
      <HomeContent />
    </Suspense>
  );
}
