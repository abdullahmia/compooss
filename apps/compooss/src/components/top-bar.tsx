"use client";

import { useConnection } from "@/lib/providers/connection-provider";
import { useShellPanel } from "@/lib/providers/shell-provider";
import { ConfirmDestructiveModal, IconButton } from "@compooss/ui";
import {
  Database,
  HelpCircle,
  Leaf,
  LogOut,
  TerminalSquare
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

export function TopBar() {
  // const [settingsOpen, setSettingsOpen] = useState(false);
  const [disconnectOpen, setDisconnectOpen] = useState(false);
  const [isDisconnecting, setIsDisconnecting] = useState(false);
  const { isOpen: isShellOpen, toggle: toggleShell } = useShellPanel();
  const { activeConnection, maskedUri, disconnect } = useConnection();
  const router = useRouter();

  const handleDisconnect = async () => {
    setIsDisconnecting(true);
    await disconnect();
    setIsDisconnecting(false);
    setDisconnectOpen(false);
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

        <button
          type="button"
          onClick={() => setDisconnectOpen(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-muted-foreground hover:text-foreground rounded-sm border border-border hover:bg-secondary transition-colors"
        >
          <LogOut className="h-3.5 w-3.5" />
          Disconnect
        </button>
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
      <ConfirmDestructiveModal
        open={disconnectOpen}
        onClose={() => setDisconnectOpen(false)}
        title="Disconnect"
        icon={<LogOut className="h-5 w-5" />}
        description="Are you sure you want to disconnect from this database? Any unsaved changes will be lost."
        confirmLabel="Disconnect"
        isPending={isDisconnecting}
        onConfirm={handleDisconnect}
      />
      {/* <SettingsModal
        open={settingsOpen}
        onClose={() => setSettingsOpen(false)}
      /> */}
    </>
  );
}
