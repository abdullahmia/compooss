import { DatabasesListPageSkeleton } from "@compooss/ui";
import { DatabasesListView } from "@/components/databases-list-view";
import { Suspense } from "react";

export default function DatabasesPage() {
  return (
    <Suspense fallback={<DatabasesListPageSkeleton />}>
      <DatabasesListView />
    </Suspense>
  );
}
