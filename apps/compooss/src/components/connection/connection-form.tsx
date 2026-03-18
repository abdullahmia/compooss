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
  Unplug,
  XCircle,
  Zap,
} from "lucide-react";
import { useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { ColorPicker } from "./color-picker";

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
      {/* Connection URI Card */}
      <div className="bg-card/80 backdrop-blur-sm border border-border rounded-xl p-5 shadow-lg shadow-black/5">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-5 h-5 rounded-md bg-primary/10 flex items-center justify-center">
            <Unplug className="h-3 w-3 text-primary" />
          </div>
          <span className="text-xs font-semibold text-foreground">Connection URI</span>
        </div>
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
        <p className="text-[11px] text-muted-foreground/70 mt-2">
          Paste your MongoDB connection string or SRV address
        </p>
      </div>

      {/* Connection Details Card */}
      <div className="bg-card/80 backdrop-blur-sm border border-border rounded-xl p-5 shadow-lg shadow-black/5">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-5 h-5 rounded-md bg-primary/10 flex items-center justify-center">
            <Zap className="h-3 w-3 text-primary" />
          </div>
          <span className="text-xs font-semibold text-foreground">Details</span>
        </div>

        <label className="text-[11px] font-medium text-muted-foreground mb-1.5 block">
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

        <div className="mt-4 grid grid-cols-2 gap-4">
          <div>
            <label className="text-[11px] font-medium text-muted-foreground mb-1.5 block">
              Label
            </label>
            <input
              {...form.register("label")}
              placeholder="e.g. dev, staging"
              className="w-full bg-secondary text-xs px-3 py-2 rounded-lg border border-border focus:border-primary focus:ring-1 focus:ring-primary/30 outline-hidden text-foreground placeholder:text-muted-foreground transition-colors"
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
      </div>

      {/* Test result */}
      {testResult && (
        <div
          className={cn(
            "flex items-center gap-2.5 text-xs px-4 py-3 rounded-xl border transition-all",
            testResult.ok
              ? "bg-success/5 text-success border-success/20"
              : "bg-destructive/5 text-destructive border-destructive/20",
          )}
        >
          {testResult.ok ? (
            <CheckCircle2 className="h-4 w-4 shrink-0" />
          ) : (
            <XCircle className="h-4 w-4 shrink-0" />
          )}
          <span>{testResult.message}</span>
        </div>
      )}

      {/* Submit / connection error */}
      {submitError && (
        <div className="flex items-center gap-2.5 text-xs px-4 py-3 rounded-xl border bg-destructive/5 text-destructive border-destructive/20">
          <XCircle className="h-4 w-4 shrink-0" />
          <span>{submitError}</span>
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center gap-3 pt-1">
        <Button
          type="submit"
          disabled={isConnecting}
          loading={isConnecting}
          icon={<Plug2 className="h-3.5 w-3.5" />}
        >
          {editMode ? "Save & Connect" : "Connect"}
        </Button>

        <Button
          variant="outline"
          type="button"
          onClick={handleTest}
          disabled={isTesting || !connectionString}
          loading={isTesting}
        >
          Test
        </Button>

        <div className="flex-1" />

        <button
          type="button"
          className={cn(
            "flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg transition-all",
            isFavorite
              ? "bg-warning/10 text-warning border border-warning/20"
              : "text-muted-foreground hover:text-foreground hover:bg-secondary border border-transparent",
          )}
          onClick={() =>
            form.setValue("isFavorite", !form.getValues("isFavorite"))
          }
        >
          <Star
            className={cn(
              "h-3 w-3 transition-colors",
              isFavorite && "fill-warning text-warning",
            )}
          />
          {isFavorite ? "Favorited" : "Favorite"}
        </button>
      </div>
    </form>
  );
}
