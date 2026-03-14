import { checkConnectionHealth } from "@/lib/services/connection/connection.service";
import { WelcomeView } from "@/components/welcome-view";

export default async function Home() {
  try {
    const health = await checkConnectionHealth();
    if (health.ok) {
    } else {
    }
  } catch {
    // Connection check failed
  }

  return <WelcomeView />;
}
