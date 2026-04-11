"use client";

import { Palette, Settings, Shield, X } from "lucide-react";
import { useState } from "react";
import { Button, IconButton, Tabs } from "@compooss/ui";
import { AppearanceSettings } from "@/lib/components/settings/appearance-settings.component";
import { GeneralSettings } from "@/lib/components/settings/general-settings.component";
import { PrivacySettings } from "@/lib/components/settings/privacy-settings.component";

type Props = {
  open: boolean;
  onClose: () => void;
};

type SettingsTab = "general" | "privacy" | "theme";

export const SettingsModal: React.FC<Props> = ({ open, onClose }) => {
  const [activeTab, setActiveTab] = useState<SettingsTab>("general");

  if (!open) return null;

  const tabs: { id: SettingsTab; label: string; icon: React.ReactNode }[] = [
    { id: "general", label: "General", icon: <Settings className="h-3.5 w-3.5" /> },
    { id: "privacy", label: "Privacy", icon: <Shield className="h-3.5 w-3.5" /> },
    { id: "theme", label: "Theme", icon: <Palette className="h-3.5 w-3.5" /> },
  ];

  const handleTabChange = (id: string) => {
    setActiveTab(id as SettingsTab);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-background/10 backdrop-blur-xs"
        onClick={onClose}
      />
      <div className="relative bg-card border border-border rounded-lg shadow-xl w-full max-w-lg mx-4">
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <div className="flex items-center gap-2">
            <Settings className="h-4 w-4 text-primary" />
            <h2 className="text-sm font-semibold text-foreground">Settings</h2>
          </div>
          <IconButton
            onClick={onClose}
            icon={<X className="h-4 w-4" />}
            variant="ghost"
            size="sm"
            label="Close"
          />
        </div>

        <div className="flex min-h-[320px]">
          <Tabs
            variant="pill"
            items={tabs}
            activeTab={activeTab}
            onTabChange={handleTabChange}
          />

          <div className="flex-1 p-5 space-y-5 overflow-y-auto">
            {activeTab === "general" && <GeneralSettings />}
            {activeTab === "privacy" && <PrivacySettings />}
            {activeTab === "theme" && <AppearanceSettings />}
          </div>
        </div>

        <div className="flex items-center justify-end gap-2 px-5 py-3 border-t border-border">
          <Button
            onClick={onClose}
            variant="ghost"
            className="px-4 py-2 text-xs font-medium"
          >
            Cancel
          </Button>
          <Button
            onClick={onClose}
            variant="primary"
            className="px-4 py-2 text-xs font-medium"
          >
            Save Changes
          </Button>
        </div>
      </div>
    </div>
  );
};
