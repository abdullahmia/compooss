"use client";

import {
  ConnectionFormSchema,
  type TConnectionForm,
} from "@/lib/schemas/connection.schema";
import { Button, cn, Input } from "@compooss/ui";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  CheckCircle2,
  ChevronDown,
  Loader2,
  Plug2,
  Star,
  XCircle,
} from "lucide-react";
import { useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { ColorPicker } from "./color-picker";
// import { AuthConfigForm } from "./auth-config-form";
// import { TlsConfigForm } from "./tls-config-form";
// import { AdvancedConfigForm } from "./advanced-config-form";

interface ConnectionFormProps {
  defaultValues?: Partial<TConnectionForm>;
  onSubmit: (data: TConnectionForm) => Promise<void>;
  onTest: (uri: string) => Promise<{ ok: boolean; message: string }>;
  isConnecting?: boolean;
  editMode?: boolean;
  submitError?: string | null;
}

export function ConnectionForm({
  defaultValues,
  onSubmit,
  onTest,
  isConnecting,
  editMode,
  submitError,
}: ConnectionFormProps) {
  const [testResult, setTestResult] = useState<{
    ok: boolean;
    message: string;
  } | null>(null);
  const [isTesting, setIsTesting] = useState(false);
  const [expandedSections, setExpandedSections] = useState<Set<string>>(
    new Set(),
  );

  const form = useForm<TConnectionForm>({
    resolver: zodResolver(ConnectionFormSchema),
    defaultValues: {
      connectionString: "mongodb://localhost:27017",
      connectionName: "",
      isFavorite: false,
      authType: "default",
      ...defaultValues,
    },
  });

  const isFavorite = useWatch({ control: form.control, name: "isFavorite" });
  const colorValue = useWatch({ control: form.control, name: "color" });
  const connectionString = useWatch({
    control: form.control,
    name: "connectionString",
  });

  const handleTest = async () => {
    const uri = form.getValues("connectionString");
    if (!uri) return;
    setIsTesting(true);
    setTestResult(null);
    try {
      const result = await onTest(uri);
      setTestResult(result);
    } catch {
      setTestResult({ ok: false, message: "Test failed" });
    } finally {
      setIsTesting(false);
    }
  };

  const handleFormSubmit = async (data: TConnectionForm) => {
    setTestResult(null);
    await onSubmit(data);
  };

  const toggleSection = (id: string) => {
    setExpandedSections((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const sectionHeader = (id: string, label: string) => (
    <button
      type="button"
      onClick={() => toggleSection(id)}
      className="w-full flex items-center justify-between py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider hover:text-foreground transition-colors"
    >
      {label}
      <ChevronDown
        className={cn(
          "h-3.5 w-3.5 transition-transform",
          expandedSections.has(id) && "rotate-180",
        )}
      />
    </button>
  );

  return (
    <form
      onSubmit={form.handleSubmit(handleFormSubmit)}
      className="space-y-4"
    >
      <div className="bg-card border border-border rounded-lg p-5">
        <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 block">
          Connection String
        </label>
        <Input
          hookForm={
            form as unknown as import("react-hook-form").UseFormReturn<
              Record<string, unknown>
            >
          }
          name="connectionString"
          placeholder="mongodb://localhost:27017"
          variant="default"
          inputSize="lg"
          className="w-full font-mono"
        />

        <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 mt-4 block">
          Connection Name
        </label>
        <Input
          hookForm={
            form as unknown as import("react-hook-form").UseFormReturn<
              Record<string, unknown>
            >
          }
          name="connectionName"
          placeholder="e.g. Local Development"
          variant="default"
          inputSize="lg"
          className="w-full"
        />

        <div className="mt-4 flex items-center gap-4">
          <div>
            <label className="text-[11px] font-medium text-muted-foreground mb-1.5 block">
              Label (optional)
            </label>
            <input
              {...form.register("label")}
              placeholder="e.g. dev, staging"
              className="bg-secondary text-xs px-2.5 py-1.5 rounded-sm border border-border focus:border-primary focus:ring-1 focus:ring-primary/30 outline-hidden text-foreground placeholder:text-muted-foreground w-32"
            />
          </div>
          <div>
            <label className="text-[11px] font-medium text-muted-foreground mb-1.5 block">
              Color
            </label>
            <ColorPicker
              value={colorValue}
              onChange={(c) => form.setValue("color", c)}
            />
          </div>
        </div>

        {/* Collapsible: Authentication (temporarily disabled on /connect) */}
        {/*
        <div className="mt-3 border-t border-border pt-1">
          {sectionHeader("auth", "Authentication")}
          {expandedSections.has("auth") && (
            <AuthConfigForm form={form} />
          )}
        </div>
        */}

        {/* TODO: TLS/SSL section — uncomment when ready
        <div className="border-t border-border pt-1">
          {sectionHeader("tls", "TLS / SSL")}
          {expandedSections.has("tls") && <TlsConfigForm form={form} />}
        </div>
        */}

        {/* TODO: Advanced Options section — uncomment when ready
        <div className="border-t border-border pt-1">
          {sectionHeader("advanced", "Advanced Options")}
          {expandedSections.has("advanced") && (
            <AdvancedConfigForm form={form} />
          )}
        </div>
        */}

        {/* Test result */}
        {testResult && (
          <div
            className={cn(
              "mt-4 flex items-center gap-2 text-xs px-3 py-2 rounded-sm",
              testResult.ok
                ? "bg-success/10 text-success"
                : "bg-destructive/10 text-destructive",
            )}
          >
            {testResult.ok ? (
              <CheckCircle2 className="h-3.5 w-3.5" />
            ) : (
              <XCircle className="h-3.5 w-3.5" />
            )}
            {testResult.message}
          </div>
        )}

        {/* Submit / connection error */}
        {submitError && (
          <div className="mt-2 flex items-center gap-2 text-xs px-3 py-2 rounded-sm bg-destructive/10 text-destructive">
            <XCircle className="h-3.5 w-3.5" />
            {submitError}
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center gap-3 mt-4">
          <Button
            type="submit"
            disabled={isConnecting}
            loading={isConnecting}
            icon={<Plug2 className="h-3.5 w-3.5" />}
          >
            {editMode ? "Save & Connect" : "Connect"}
          </Button>

          <Button
            variant="ghost"
            type="button"
            onClick={handleTest}
            disabled={isTesting || !connectionString}
            loading={isTesting}
          >
            Test Connection
          </Button>

          <Button
            variant="ghost"
            type="button"
            icon={
              <Star
                className={cn(
                  "h-3 w-3 transition-colors",
                  isFavorite && "fill-warning text-warning",
                )}
              />
            }
            onClick={() =>
              form.setValue("isFavorite", !form.getValues("isFavorite"))
            }
          >
            {isFavorite ? "Favorited" : "Save as favorite"}
          </Button>
        </div>
      </div>
    </form>
  );
}
