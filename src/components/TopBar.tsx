import { Database, Leaf, RefreshCw, Settings, HelpCircle } from "lucide-react";
import { useState } from "react";
import { SettingsModal } from "./SettingsModal";

interface TopBarProps {
  connectionString: string;
  onDisconnect?: () => void;
}

export function TopBar({ connectionString, onDisconnect }: TopBarProps) {
  const [settingsOpen, setSettingsOpen] = useState(false);

  return (
    <>
      <div className="h-11 flex items-center gap-2 px-3 bg-topbar border-b border-border shrink-0">
        <Leaf className="h-5 w-5 text-primary" />
        <span className="font-semibold text-sm text-foreground tracking-tight">Compooss</span>
        
        <div className="flex-1 mx-4">
          <div className="flex items-center gap-2 bg-secondary rounded px-3 py-1.5 max-w-2xl">
            <Database className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
            <span className="text-xs font-mono text-muted-foreground truncate">{connectionString}</span>
            <button className="ml-auto text-muted-foreground hover:text-foreground transition-colors">
              <RefreshCw className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>

        {onDisconnect && (
          <button
            onClick={onDisconnect}
            className="px-3 py-1 text-xs text-muted-foreground hover:text-destructive border border-border rounded hover:border-destructive/30 transition-colors"
          >
            Disconnect
          </button>
        )}
        <button
          onClick={() => setSettingsOpen(true)}
          className="p-1.5 text-muted-foreground hover:text-foreground transition-colors rounded hover:bg-secondary"
        >
          <Settings className="h-4 w-4" />
        </button>
        <button className="p-1.5 text-muted-foreground hover:text-foreground transition-colors rounded hover:bg-secondary">
          <HelpCircle className="h-4 w-4" />
        </button>
      </div>
      <SettingsModal open={settingsOpen} onClose={() => setSettingsOpen(false)} />
    </>
  );
}
