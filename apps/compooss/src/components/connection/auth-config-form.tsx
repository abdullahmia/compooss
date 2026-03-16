"use client";

import type { TConnectionForm } from "@/lib/schemas/connection.schema";
import type { AuthType } from "@compooss/types";
import { cn } from "@compooss/ui";
import { useWatch, type UseFormReturn } from "react-hook-form";

interface AuthConfigFormProps {
  form: UseFormReturn<TConnectionForm>;
}

const AUTH_METHODS: { value: AuthType; label: string; description: string }[] =
  [
    {
      value: "default",
      label: "Default",
      description: "No authentication or credentials in URI",
    },
    {
      value: "password",
      label: "Username / Password",
      description: "SCRAM-SHA-1 or SCRAM-SHA-256",
    },
    {
      value: "ldap",
      label: "LDAP",
      description: "Lightweight Directory Access Protocol",
    },
    {
      value: "kerberos",
      label: "Kerberos",
      description: "GSSAPI / Kerberos authentication",
    },
  ];

function FieldRow({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="grid grid-cols-[120px_1fr] items-center gap-2">
      <label className="text-[11px] font-medium text-muted-foreground text-right">
        {label}
      </label>
      {children}
    </div>
  );
}

export function AuthConfigForm({ form }: AuthConfigFormProps) {
  const authType = useWatch({ control: form.control, name: "authType" });

  return (
    <div className="space-y-3 pb-3">
      <div className="flex flex-wrap gap-1.5">
        {AUTH_METHODS.map((method) => (
          <button
            key={method.value}
            type="button"
            onClick={() => form.setValue("authType", method.value)}
            className={cn(
              "text-[11px] px-2.5 py-1.5 rounded-sm transition-colors",
              authType === method.value
                ? "bg-primary/15 text-primary font-medium"
                : "bg-secondary text-muted-foreground hover:text-foreground",
            )}
          >
            {method.label}
          </button>
        ))}
      </div>

      <p className="text-[11px] text-muted-foreground">
        {AUTH_METHODS.find((m) => m.value === authType)?.description}
      </p>

      {authType === "password" && (
        <div className="space-y-2">
          <FieldRow label="Username">
            <input
              {...form.register("authConfig.username")}
              placeholder="admin"
              className="bg-secondary text-xs px-2.5 py-1.5 rounded-sm border border-border focus:border-primary outline-hidden text-foreground placeholder:text-muted-foreground w-full"
            />
          </FieldRow>
          <FieldRow label="Password">
            <input
              {...form.register("authConfig.password")}
              type="password"
              placeholder="••••••••"
              className="bg-secondary text-xs px-2.5 py-1.5 rounded-sm border border-border focus:border-primary outline-hidden text-foreground placeholder:text-muted-foreground w-full"
            />
          </FieldRow>
          <FieldRow label="Auth Source">
            <input
              {...form.register("authConfig.authSource")}
              placeholder="admin"
              className="bg-secondary text-xs px-2.5 py-1.5 rounded-sm border border-border focus:border-primary outline-hidden text-foreground placeholder:text-muted-foreground w-full"
            />
          </FieldRow>
          <FieldRow label="Mechanism">
            <select
              {...form.register("authConfig.authMechanism")}
              className="bg-secondary text-xs px-2.5 py-1.5 rounded-sm border border-border focus:border-primary outline-hidden text-foreground w-full cursor-pointer"
            >
              <option value="">Default</option>
              <option value="SCRAM-SHA-1">SCRAM-SHA-1</option>
              <option value="SCRAM-SHA-256">SCRAM-SHA-256</option>
            </select>
          </FieldRow>
        </div>
      )}

      {authType === "ldap" && (
        <div className="space-y-2">
          <FieldRow label="Username">
            <input
              {...form.register("authConfig.username")}
              placeholder="cn=admin,dc=example,dc=org"
              className="bg-secondary text-xs px-2.5 py-1.5 rounded-sm border border-border focus:border-primary outline-hidden text-foreground placeholder:text-muted-foreground w-full"
            />
          </FieldRow>
          <FieldRow label="Password">
            <input
              {...form.register("authConfig.password")}
              type="password"
              placeholder="••••••••"
              className="bg-secondary text-xs px-2.5 py-1.5 rounded-sm border border-border focus:border-primary outline-hidden text-foreground placeholder:text-muted-foreground w-full"
            />
          </FieldRow>
        </div>
      )}

      {authType === "kerberos" && (
        <div className="space-y-2">
          <FieldRow label="Principal">
            <input
              {...form.register("authConfig.username")}
              placeholder="user@REALM.COM"
              className="bg-secondary text-xs px-2.5 py-1.5 rounded-sm border border-border focus:border-primary outline-hidden text-foreground placeholder:text-muted-foreground w-full"
            />
          </FieldRow>
          <FieldRow label="Service Name">
            <input
              {...form.register("authConfig.gssapiServiceName")}
              placeholder="mongodb"
              className="bg-secondary text-xs px-2.5 py-1.5 rounded-sm border border-border focus:border-primary outline-hidden text-foreground placeholder:text-muted-foreground w-full"
            />
          </FieldRow>
          <FieldRow label="Canonicalize">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                {...form.register("authConfig.canonicalizeHostName")}
                className="rounded border-border"
              />
              <span className="text-[11px] text-muted-foreground">
                Canonicalize hostname
              </span>
            </label>
          </FieldRow>
        </div>
      )}
    </div>
  );
}
