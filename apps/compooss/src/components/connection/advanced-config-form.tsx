"use client";

import type { TConnectionForm } from "@/lib/schemas/connection.schema";
import type { UseFormReturn } from "react-hook-form";

interface AdvancedConfigFormProps {
  form: UseFormReturn<TConnectionForm>;
}

function FieldRow({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="grid grid-cols-[160px_1fr] items-center gap-2">
      <label className="text-[11px] font-medium text-muted-foreground text-right">
        {label}
      </label>
      {children}
    </div>
  );
}

export function AdvancedConfigForm({ form }: AdvancedConfigFormProps) {
  return (
    <div className="space-y-2 pb-3">
      <FieldRow label="Replica Set">
        <input
          {...form.register("advancedConfig.replicaSet")}
          placeholder="rs0"
          className="bg-secondary text-xs px-2.5 py-1.5 rounded-sm border border-border focus:border-primary outline-hidden text-foreground placeholder:text-muted-foreground w-full"
        />
      </FieldRow>

      <FieldRow label="Read Preference">
        <select
          {...form.register("advancedConfig.readPreference")}
          className="bg-secondary text-xs px-2.5 py-1.5 rounded-sm border border-border focus:border-primary outline-hidden text-foreground w-full cursor-pointer"
        >
          <option value="">Default (primary)</option>
          <option value="primary">Primary</option>
          <option value="primaryPreferred">Primary Preferred</option>
          <option value="secondary">Secondary</option>
          <option value="secondaryPreferred">Secondary Preferred</option>
          <option value="nearest">Nearest</option>
        </select>
      </FieldRow>

      <FieldRow label="Connect Timeout (ms)">
        <input
          {...form.register("advancedConfig.connectTimeoutMS", { valueAsNumber: true })}
          type="number"
          placeholder="10000"
          className="bg-secondary text-xs px-2.5 py-1.5 rounded-sm border border-border focus:border-primary outline-hidden text-foreground placeholder:text-muted-foreground w-full"
        />
      </FieldRow>

      <FieldRow label="Server Selection (ms)">
        <input
          {...form.register("advancedConfig.serverSelectionTimeoutMS", { valueAsNumber: true })}
          type="number"
          placeholder="5000"
          className="bg-secondary text-xs px-2.5 py-1.5 rounded-sm border border-border focus:border-primary outline-hidden text-foreground placeholder:text-muted-foreground w-full"
        />
      </FieldRow>

      <FieldRow label="Max Pool Size">
        <input
          {...form.register("advancedConfig.maxPoolSize", { valueAsNumber: true })}
          type="number"
          placeholder="10"
          min="1"
          className="bg-secondary text-xs px-2.5 py-1.5 rounded-sm border border-border focus:border-primary outline-hidden text-foreground placeholder:text-muted-foreground w-full"
        />
      </FieldRow>

      <FieldRow label="Direct Connection">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            {...form.register("advancedConfig.directConnection")}
            className="rounded border-border"
          />
          <span className="text-[11px] text-muted-foreground">
            Connect directly to a single server
          </span>
        </label>
      </FieldRow>
    </div>
  );
}
