"use client";

import type { TConnectionForm } from "@/lib/schemas/connection.schema";
import { Checkbox, Input } from "@compooss/ui";
import { useWatch, type UseFormReturn } from "react-hook-form";
import { FieldRow } from "./field-row.component";

type Props = {
  form: UseFormReturn<TConnectionForm>;
};

export const TlsConfigForm: React.FC<Props> = ({ form }) => {
  const tlsEnabled = useWatch({
    control: form.control,
    name: "tlsConfig.enabled",
  });

  return (
    <div className="space-y-3 pb-3">
      <label className="flex items-center gap-2 cursor-pointer">
        <Checkbox {...form.register("tlsConfig.enabled")} />
        <span className="text-xs text-foreground font-medium">
          Enable TLS / SSL
        </span>
      </label>

      {tlsEnabled && (
        <div className="space-y-2">
          <FieldRow label="CA Certificate" cols="140px">
            <Input
              variant="compact"
              className="font-mono"
              {...form.register("tlsConfig.caFile")}
              placeholder="/path/to/ca.pem"
            />
          </FieldRow>
          <FieldRow label="Client Certificate" cols="140px">
            <Input
              variant="compact"
              className="font-mono"
              {...form.register("tlsConfig.certFile")}
              placeholder="/path/to/client-cert.pem"
            />
          </FieldRow>
          <FieldRow label="Client Key" cols="140px">
            <Input
              variant="compact"
              className="font-mono"
              {...form.register("tlsConfig.keyFile")}
              placeholder="/path/to/client-key.pem"
            />
          </FieldRow>
          <FieldRow label="Allow Invalid Certs" cols="140px">
            <label className="flex items-center gap-2 cursor-pointer">
              <Checkbox {...form.register("tlsConfig.allowInvalidCertificates")} />
              <span className="text-[11px] text-muted-foreground">
                Accept invalid certificates
              </span>
            </label>
          </FieldRow>
          <FieldRow label="Allow Invalid Hosts" cols="140px">
            <label className="flex items-center gap-2 cursor-pointer">
              <Checkbox {...form.register("tlsConfig.allowInvalidHostnames")} />
              <span className="text-[11px] text-muted-foreground">
                Accept invalid hostnames
              </span>
            </label>
          </FieldRow>
        </div>
      )}
    </div>
  );
};
