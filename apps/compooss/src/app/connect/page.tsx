import { ConnectionPage } from "@/lib/components/connection/connection-page.component";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Connect - Compooss",
  description: "Connect to your MongoDB deployment.",
};

export default function ConnectRoute() {
  return <ConnectionPage />;
}
