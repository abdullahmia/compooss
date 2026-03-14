"use client";

import { Database, HelpCircle, Leaf, RefreshCw, Settings } from "lucide-react";
import { useState } from "react";
import { SettingsModal } from "./settings/settings-modal";
import { IconButton } from "@compooss/ui";

interface TopBarProps {
  connectionString?: string;
  onRefreshConnection?: () => void;
}

export function TopBar({
  connectionString,
  onRefreshConnection,
}: TopBarProps) {
  const [settingsOpen, setSettingsOpen] = useState(false);

  return (
    <>
      <div className="h-11 flex items-center gap-2 px-3 bg-topbar border-b border-border shrink-0">
        <Leaf className="h-5 w-5 text-primary" />
        <span className="font-semibold text-sm text-foreground tracking-tight">
          Compooss
        </span>

        <div className="flex-1 mx-4">
          <div className="flex items-center gap-2 bg-secondary rounded-sm px-3 py-1.5 max-w-2xl">
            <Database className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
            <span className="text-xs font-mono text-muted-foreground truncate min-w-0 flex-1">
              {connectionString ?? "No connection"}
            </span>
            <button
              type="button"
              className="ml-auto text-muted-foreground hover:text-foreground transition-colors"
              onClick={onRefreshConnection}
            >
              <RefreshCw className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>

        {/* {onDisconnect && (
          <button
            onClick={onDisconnect}
            className="px-3 py-1 text-xs text-muted-foreground hover:text-destructive border border-border rounded-sm hover:border-destructive/30 transition-colors"
          >
            Disconnect
          </button>
        )} */}
        <IconButton
          variant="default"
          icon={<Settings className="h-4 w-4" />}
          label="Settings"
          onClick={() => setSettingsOpen(true)}
        />
        <IconButton
          variant="default"
          icon={<HelpCircle className="h-4 w-4" />}
          label="Help"
        />
      </div>
      <SettingsModal
        open={settingsOpen}
        onClose={() => setSettingsOpen(false)}
      />
    </>
  );
}
