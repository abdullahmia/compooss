"use client";

import { Sidebar } from "@/components/sidebar/sidebar";
import { TopBar } from "@/components/top-bar";
import { useRouter } from "next/navigation";

interface IPlaygroundShellProps {
  children: React.ReactNode;
}

export function PlaygroundShell({ children }: IPlaygroundShellProps) {
  const router = useRouter();

  const handleRefreshConnection = () => {
    router.refresh();
  };

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      <TopBar onRefreshConnection={handleRefreshConnection} />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
          {children}
        </main>
      </div>
    </div>
  );
}
