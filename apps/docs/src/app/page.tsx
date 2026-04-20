import { LandingPage } from "@/components/landing/landing-page.component";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Compooss | Open-Source MongoDB GUI for Docker Compose",
  description:
    "A free, self-hosted MongoDB admin panel that runs as a single Docker container. Browse databases, query documents, manage indexes — no signup, no cloud, no config.",
};

export default function Page() {
  return <LandingPage />;
}
