import { ERDiagram } from "@/lib/components/databases/diagram/er-diagram.component";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "ER Diagram - Compooss",
  description: "Visualize collection relationships in this database.",
};

export default function ERDiagramPage() {
  return <ERDiagram />;
}
