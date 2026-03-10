import { Database, Monitor } from "lucide-react";
import { useState } from "react";
import { Toggle } from "../ui/toggle/toggle";


export const GeneralSettings = () => {
  const [maxTimeMS, setMaxTimeMS] = useState("60000");
  const [maxDocuments, setMaxDocuments] = useState("20");
  const [enableDevTools, setEnableDevTools] = useState(false);
  const [autoUpdates, setAutoUpdates] = useState(true);

  return (
    <>
      <div>
        <h3 className="text-xs font-semibold text-foreground mb-3 flex items-center gap-1.5">
          <Database className="h-3.5 w-3.5 text-primary" />
          Query Settings
        </h3>
        <div className="space-y-3">
          <div>
            <label className="text-[11px] text-muted-foreground mb-1 block">Max Time MS</label>
            <input
              type="text"
              value={maxTimeMS}
              onChange={(e) => setMaxTimeMS(e.target.value)}
              className="w-full bg-secondary text-xs font-mono text-foreground px-3 py-2 rounded-sm border border-border focus:border-primary outline-hidden transition-colors"
            />
          </div>
          <div>
            <label className="text-[11px] text-muted-foreground mb-1 block">Default Documents Per Page</label>
            <input
              type="text"
              value={maxDocuments}
              onChange={(e) => setMaxDocuments(e.target.value)}
              className="w-full bg-secondary text-xs font-mono text-foreground px-3 py-2 rounded-sm border border-border focus:border-primary outline-hidden transition-colors"
            />
          </div>
        </div>
      </div>
      <div>
        <h3 className="text-xs font-semibold text-foreground mb-3 flex items-center gap-1.5">
          <Monitor className="h-3.5 w-3.5 text-primary" />
          Application
        </h3>
        <div className="space-y-2">
          <label className="flex items-center justify-between py-1.5 cursor-pointer">
            <span className="text-xs text-foreground">Enable DevTools</span>
            <Toggle checked={enableDevTools} onChange={setEnableDevTools} label="Enable DevTools" />
          </label>
          <label className="flex items-center justify-between py-1.5 cursor-pointer">
            <span className="text-xs text-foreground">Automatic Updates</span>
            <Toggle checked={autoUpdates} onChange={setAutoUpdates} label="Automatic Updates" />
          </label>
        </div>
      </div>
    </>
  )
}