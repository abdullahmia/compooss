import { NewConnection } from "@/components/new-connection/new-connection";
import { Suspense } from "react";

export default async function NewConnectionPage() {
  return (
    <Suspense fallback={<div className="p-8 text-muted-foreground">Loading…</div>}>
      <NewConnection />
    </Suspense>
  );
}
