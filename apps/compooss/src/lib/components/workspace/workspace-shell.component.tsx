"use client";

import { Sidebar } from "@/lib/components/sidebar/sidebar.component";
import { ShellPanel } from "@/lib/components/shell/shell-panel.component";
import { TopBar } from "@/lib/components/workspace/top-bar.component";

type Props = {
  children: React.ReactNode;
};

export const WorkspaceShell: React.FC<Props> = ({ children }) => {
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
};
