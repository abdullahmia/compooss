"use client";

import { Sidebar } from "@/components/sidebar/sidebar";
import { ShellPanel } from "@/components/shell/shell-panel";
import { TopBar } from "@/components/top-bar";
import { useRouter } from "next/navigation";

interface WorkspaceShellProps {
  children: React.ReactNode;
  connectionString?: string;
}

export function WorkspaceShell({ children, connectionString }: WorkspaceShellProps) {
  const router = useRouter();

  const handleRefreshConnection = () => {
    router.refresh();
  };

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      <TopBar
        connectionString={connectionString}
        onRefreshConnection={handleRefreshConnection}
      />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
          <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
            {children}
          </main>
          <ShellPanel />
        </div>
      </div>
    </div>
  );
}
