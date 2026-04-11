"use client";

import { Shield } from "lucide-react";
import { useState } from "react";
import { Toggle } from "@compooss/ui";

export const PrivacySettings: React.FC = () => {
  const [telemetry, setTelemetry] = useState(true);
  const [crashReports, setCrashReports] = useState(true);

  return (
    <div>
      <h3 className="text-xs font-semibold text-foreground mb-3 flex items-center gap-1.5">
        <Shield className="h-3.5 w-3.5 text-primary" />
        Privacy Settings
      </h3>
      <div className="space-y-2">
        <label className="flex items-center justify-between py-1.5 cursor-pointer">
          <span className="text-xs text-foreground">Enable Usage Statistics</span>
          <Toggle
            checked={telemetry}
            onChange={setTelemetry}
            label="Enable Usage Statistics"
          />
        </label>
        <label className="flex items-center justify-between py-1.5 cursor-pointer">
          <span className="text-xs text-foreground">Enable Crash Reports</span>
          <Toggle
            checked={crashReports}
            onChange={setCrashReports}
            label="Enable Crash Reports"
          />
        </label>
      </div>
      <p className="text-[10px] text-muted-foreground mt-3">
        Usage statistics help improve Compooss. No personal data is collected.
      </p>
    </div>
  );
};
