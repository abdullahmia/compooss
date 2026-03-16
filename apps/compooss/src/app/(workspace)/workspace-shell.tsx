"use client";

import { Sidebar } from "@/components/sidebar/sidebar";
import { ShellPanel } from "@/components/shell/shell-panel";
import { TopBar } from "@/components/top-bar";

interface WorkspaceShellProps {
  children: React.ReactNode;
}

export function WorkspaceShell({ children }: WorkspaceShellProps) {
  return (
    <div className="h-screen flex flex-col overflow-hidden">
      <TopBar />
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
