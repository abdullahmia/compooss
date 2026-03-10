"use client";

import { useState } from "react";
import { X, Settings, Monitor, Palette, Shield, Database, Bell } from "lucide-react";

interface SettingsModalProps {
  open: boolean;
  onClose: () => void;
}

type SettingsTab = "general" | "privacy" | "theme";

export function SettingsModal({ open, onClose }: SettingsModalProps) {
  const [activeTab, setActiveTab] = useState<SettingsTab>("general");
  const [maxTimeMS, setMaxTimeMS] = useState("60000");
  const [maxDocuments, setMaxDocuments] = useState("20");
  const [enableDevTools, setEnableDevTools] = useState(false);
  const [autoUpdates, setAutoUpdates] = useState(true);
  const [telemetry, setTelemetry] = useState(true);
  const [crashReports, setCrashReports] = useState(true);

  if (!open) return null;

  const tabs: { id: SettingsTab; label: string; icon: React.ReactNode }[] = [
    { id: "general", label: "General", icon: <Settings className="h-3.5 w-3.5" /> },
    { id: "privacy", label: "Privacy", icon: <Shield className="h-3.5 w-3.5" /> },
    { id: "theme", label: "Theme", icon: <Palette className="h-3.5 w-3.5" /> },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-background/10 backdrop-blur-xs" onClick={onClose} />
      <div className="relative bg-card border border-border rounded-lg shadow-xl w-full max-w-lg mx-4">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <div className="flex items-center gap-2">
            <Settings className="h-4 w-4 text-primary" />
            <h2 className="text-sm font-semibold text-foreground">Settings</h2>
          </div>
          <button onClick={onClose} className="p-1 text-muted-foreground hover:text-foreground rounded-sm hover:bg-secondary transition-colors">
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Tabs + Content */}
        <div className="flex min-h-[320px]">
          {/* Sidebar */}
          <div className="w-40 border-r border-border bg-muted/20 p-2 space-y-0.5">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-2 px-3 py-2 rounded-sm text-xs font-medium transition-colors ${
                  activeTab === tab.id
                    ? "bg-primary/15 text-primary"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                }`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>

          {/* Content */}
          <div className="flex-1 p-5 space-y-5 overflow-y-auto">
            {activeTab === "general" && (
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
                    <ToggleRow label="Enable DevTools" checked={enableDevTools} onChange={setEnableDevTools} />
                    <ToggleRow label="Automatic Updates" checked={autoUpdates} onChange={setAutoUpdates} />
                  </div>
                </div>
              </>
            )}

            {activeTab === "privacy" && (
              <div>
                <h3 className="text-xs font-semibold text-foreground mb-3 flex items-center gap-1.5">
                  <Shield className="h-3.5 w-3.5 text-primary" />
                  Privacy Settings
                </h3>
                <div className="space-y-2">
                  <ToggleRow label="Enable Usage Statistics" checked={telemetry} onChange={setTelemetry} />
                  <ToggleRow label="Enable Crash Reports" checked={crashReports} onChange={setCrashReports} />
                </div>
                <p className="text-[10px] text-muted-foreground mt-3">
                  Usage statistics help improve Compooss. No personal data is collected.
                </p>
              </div>
            )}

            {activeTab === "theme" && (
              <div>
                <h3 className="text-xs font-semibold text-foreground mb-3 flex items-center gap-1.5">
                  <Palette className="h-3.5 w-3.5 text-primary" />
                  Appearance
                </h3>
                <div className="grid grid-cols-3 gap-2">
                  {["Dark", "Light", "System"].map((theme) => (
                    <button
                      key={theme}
                      className={`p-3 rounded-sm border text-xs font-medium transition-colors ${
                        theme === "Dark"
                          ? "border-primary bg-primary/15 text-primary"
                          : "border-border text-muted-foreground hover:border-primary/30 hover:text-foreground"
                      }`}
                    >
                      {theme}
                    </button>
                  ))}
                </div>
                <p className="text-[10px] text-muted-foreground mt-3">
                  Choose your preferred theme. Currently using the dark theme.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-2 px-5 py-3 border-t border-border">
          <button onClick={onClose} className="px-4 py-2 text-xs font-medium text-muted-foreground hover:text-foreground rounded-sm border border-border hover:bg-secondary transition-colors">
            Cancel
          </button>
          <button onClick={onClose} className="px-4 py-2 text-xs font-medium bg-primary text-primary-foreground rounded-sm hover:bg-primary/90 transition-colors">
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}

function ToggleRow({ label, checked, onChange }: { label: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <label className="flex items-center justify-between py-1.5 cursor-pointer group">
      <span className="text-xs text-foreground">{label}</span>
      <button
        onClick={() => onChange(!checked)}
        className={`w-8 h-[18px] rounded-full relative transition-colors ${
          checked ? "bg-primary" : "bg-secondary border border-border"
        }`}
      >
        <span className={`block w-3.5 h-3.5 rounded-full bg-primary-foreground absolute top-[1px] transition-transform ${
          checked ? "translate-x-[17px]" : "translate-x-[1px]"
        }`} />
      </button>
    </label>
  );
}
