import { EmptyState } from "@compooss/ui";
import { DatabaseBackupIcon } from "lucide-react";

export default function DatabaseNotFound() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center bg-background p-6">
      <div className="flex flex-col items-center text-center">
        <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-destructive/10 text-destructive">
          <span className="text-4xl font-bold tabular-nums">404</span>
        </div>
        <EmptyState
          icon={<DatabaseBackupIcon className="h-12 w-12 text-muted-foreground" />}
          title="Database not found"
          description="This database doesn't exist or has been removed. Check the name or go back to the database list."
          primaryAction={{
            label: "View all databases",
            href: "/databases",
          }}
          secondaryAction={{
            label: "Go to workspace",
            href: "/",
          }}
        />
      </div>
    </div>
  );
}
