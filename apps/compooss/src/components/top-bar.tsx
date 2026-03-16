"use client";

import { useConnection } from "@/lib/providers/connection-provider";
import {
  Database,
  HelpCircle,
  Leaf,
  LogOut,
  Settings,
  TerminalSquare,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { SettingsModal } from "./settings/settings-modal";
import { IconButton } from "@compooss/ui";
import { useShellPanel } from "@/lib/providers/shell-provider";
import { toast } from "sonner";

export function TopBar() {
  const [settingsOpen, setSettingsOpen] = useState(false);
  const { isOpen: isShellOpen, toggle: toggleShell } = useShellPanel();
  const { activeConnection, maskedUri, disconnect } = useConnection();
  const router = useRouter();

  const handleDisconnect = async () => {
    await disconnect();
    toast.success("Disconnected");
    router.push("/connect");
  };

  return (
    <>
      <div className="h-11 flex items-center gap-2 px-3 bg-topbar border-b border-border shrink-0">
        <Leaf className="h-5 w-5 text-primary" />
        <span className="font-semibold text-sm text-foreground tracking-tight">
          Compooss
        </span>

        <div className="flex-1 mx-4">
          <div className="flex items-center gap-2 bg-secondary rounded-sm px-3 py-1.5 max-w-2xl hover:bg-secondary/80 transition-colors">
            {activeConnection?.color && (
              <span
                className="w-2.5 h-2.5 rounded-full shrink-0"
                style={{ backgroundColor: activeConnection.color }}
              />
            )}
            <Database className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
            <span className="text-xs font-medium text-foreground truncate">
              {activeConnection?.name ?? "No connection"}
            </span>
            {activeConnection?.label && (
              <span className="text-[10px] px-1.5 py-0.5 bg-primary/10 text-primary rounded-sm shrink-0">
                {activeConnection.label}
              </span>
            )}
            <span className="text-xs font-mono text-muted-foreground truncate min-w-0 flex-1">
              {maskedUri ?? ""}
            </span>
          </div>
        </div>

        <IconButton
          variant="default"
          icon={<LogOut className="h-4 w-4" />}
          label="Disconnect"
          onClick={handleDisconnect}
        />
        <IconButton
          variant="default"
          icon={
            <TerminalSquare
              className={`h-4 w-4 ${isShellOpen ? "text-primary" : ""}`}
            />
          }
          label="MongoDB Shell"
          onClick={toggleShell}
        />
        {/* <IconButton
          variant="default"
          icon={<Settings className="h-4 w-4" />}
          label="Settings"
          onClick={() => setSettingsOpen(true)}
        /> */}
        <IconButton
          variant="default"
          icon={<HelpCircle className="h-4 w-4" />}
          label="Help"
        />
      </div>
      {/* <SettingsModal
        open={settingsOpen}
        onClose={() => setSettingsOpen(false)}
      /> */}
    </>
  );
}
