import { Databases } from "@/lib/components/databases/databases.component";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Databases - Compooss",
  description: "Browse all databases on your MongoDB server.",
};

export default function DatabasesPage() {
  return <Databases />;
}
