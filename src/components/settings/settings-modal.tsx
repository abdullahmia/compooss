"use client";

import { Palette, Settings, Shield, X } from "lucide-react";
import { useState } from "react";
import { Tabs } from "../ui/tabs/tabs";
import { AppearanceSettings } from "./appearance-settings";
import { GeneralSettings } from "./general-settings";
import { PrivacySettings } from "./privacy-settings";

interface SettingsModalProps {
  open: boolean;
  onClose: () => void;
}

type SettingsTab = "general" | "privacy" | "theme";

export function SettingsModal({ open, onClose }: SettingsModalProps) {
  const [activeTab, setActiveTab] = useState<SettingsTab>("general");
  
 
  

  if (!open) return null;

  const tabs: { id: SettingsTab; label: string; icon: React.ReactNode }[] = [
    { id: "general", label: "General", icon: <Settings className="h-3.5 w-3.5" /> },
    { id: "privacy", label: "Privacy", icon: <Shield className="h-3.5 w-3.5" /> },
    { id: "theme", label: "Theme", icon: <Palette className="h-3.5 w-3.5" /> },
  ];

  const handleTabChange = (id: SettingsTab) => {
    setActiveTab(id);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-background/10 backdrop-blur-xs" onClick={onClose} />
      <div className="relative bg-card border border-border rounded-lg shadow-xl w-full max-w-lg mx-4">
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <div className="flex items-center gap-2">
            <Settings className="h-4 w-4 text-primary" />
            <h2 className="text-sm font-semibold text-foreground">Settings</h2>
          </div>
          <button onClick={onClose} className="p-1 text-muted-foreground hover:text-foreground rounded-sm hover:bg-secondary transition-colors">
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="flex min-h-[320px]">
          <Tabs
            variant="pill"
            items={tabs}
            activeTab={activeTab}
            onTabChange={handleTabChange}
          />

          <div className="flex-1 p-5 space-y-5 overflow-y-auto">
            {activeTab === "general" && (
              <GeneralSettings />
            )}

            {activeTab === "privacy" && (
              <PrivacySettings />
            )}

            {activeTab === "theme" && (
              <AppearanceSettings />
            )}
          </div>
        </div>

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
