import { WorkspaceWelcome } from "@/lib/components/workspace/workspace-welcome.component";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Workspace - Compooss",
  description: "Browse your MongoDB databases and collections.",
};

export default function WorkspacePage() {
  return <WorkspaceWelcome />;
}
