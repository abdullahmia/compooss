"use client";

import React, { Suspense, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useConnection } from "@/lib/providers/connection-provider";
import { WorkspaceShell } from "@/lib/components/workspace/workspace-shell.component";
import { FullPageLoader } from "@/lib/components/common/full-page-loader.component";

export default function WorkspaceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isConnected, isLoading } = useConnection();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isConnected) {
      router.replace("/connect");
    }
  }, [isLoading, isConnected, router]);

  if (isLoading) {
    return <FullPageLoader />;
  }

  if (!isConnected) {
    return null;
  }

  return (
    <Suspense>
      <WorkspaceShell>{children}</WorkspaceShell>
    </Suspense>
  );
}
