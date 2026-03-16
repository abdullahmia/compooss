"use client";

import type { TConnectionForm } from "@/lib/schemas/connection.schema";
import { useWatch, type UseFormReturn } from "react-hook-form";

interface TlsConfigFormProps {
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
    <div className="grid grid-cols-[140px_1fr] items-center gap-2">
      <label className="text-[11px] font-medium text-muted-foreground text-right">
        {label}
      </label>
      {children}
    </div>
  );
}

export function TlsConfigForm({ form }: TlsConfigFormProps) {
  const tlsEnabled = useWatch({
    control: form.control,
    name: "tlsConfig.enabled",
  });

  return (
    <div className="space-y-3 pb-3">
      <label className="flex items-center gap-2 cursor-pointer">
        <input
          type="checkbox"
          {...form.register("tlsConfig.enabled")}
          className="rounded border-border"
        />
        <span className="text-xs text-foreground font-medium">
          Enable TLS / SSL
        </span>
      </label>

      {tlsEnabled && (
        <div className="space-y-2">
          <FieldRow label="CA Certificate">
            <input
              {...form.register("tlsConfig.caFile")}
              placeholder="/path/to/ca.pem"
              className="bg-secondary text-xs font-mono px-2.5 py-1.5 rounded-sm border border-border focus:border-primary outline-hidden text-foreground placeholder:text-muted-foreground w-full"
            />
          </FieldRow>
          <FieldRow label="Client Certificate">
            <input
              {...form.register("tlsConfig.certFile")}
              placeholder="/path/to/client-cert.pem"
              className="bg-secondary text-xs font-mono px-2.5 py-1.5 rounded-sm border border-border focus:border-primary outline-hidden text-foreground placeholder:text-muted-foreground w-full"
            />
          </FieldRow>
          <FieldRow label="Client Key">
            <input
              {...form.register("tlsConfig.keyFile")}
              placeholder="/path/to/client-key.pem"
              className="bg-secondary text-xs font-mono px-2.5 py-1.5 rounded-sm border border-border focus:border-primary outline-hidden text-foreground placeholder:text-muted-foreground w-full"
            />
          </FieldRow>
          <FieldRow label="Allow Invalid Certs">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                {...form.register("tlsConfig.allowInvalidCertificates")}
                className="rounded border-border"
              />
              <span className="text-[11px] text-muted-foreground">
                Accept invalid certificates
              </span>
            </label>
          </FieldRow>
          <FieldRow label="Allow Invalid Hosts">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                {...form.register("tlsConfig.allowInvalidHostnames")}
                className="rounded border-border"
              />
              <span className="text-[11px] text-muted-foreground">
                Accept invalid hostnames
              </span>
            </label>
          </FieldRow>
        </div>
      )}
    </div>
  );
}
