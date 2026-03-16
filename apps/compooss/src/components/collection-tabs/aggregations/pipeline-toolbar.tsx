"use client";

import { Badge, Button, IconButton } from "@compooss/ui";
import {
  BookOpen,
  Braces,
  ClipboardCopy,
  Code2,
  Download,
  Eye,
  Hammer,
  Loader2,
  Play,
  RefreshCw,
  Save,
  Settings,
  Square,
  Trash2,
} from "lucide-react";
import { useCallback, useState } from "react";
import { toast } from "sonner";
import type { PipelineMode, UseAggregationPipeline } from "./use-aggregation-pipeline";

interface PipelineToolbarProps {
  pipeline: UseAggregationPipeline;
  onOpenSave: () => void;
  onOpenLoad: () => void;
  onOpenSettings: () => void;
  onOpenCreateView: () => void;
}

export function PipelineToolbar({
  pipeline,
  onOpenSave,
  onOpenLoad,
  onOpenSettings,
  onOpenCreateView,
}: PipelineToolbarProps) {
  const [showExportMenu, setShowExportMenu] = useState(false);

  const handleRun = useCallback(() => {
    pipeline.runPipeline();
  }, [pipeline]);

  const handleStop = useCallback(() => {
    pipeline.stopPipeline();
  }, [pipeline]);

  const handleExportJson = useCallback(() => {
    const json = pipeline.exportPipelineJson();
    if (!json) return;
    navigator.clipboard.writeText(json);
    toast.success("Pipeline JSON copied to clipboard.");
    setShowExportMenu(false);
  }, [pipeline]);

  const handleCopyBackend = useCallback(() => {
    const code = pipeline.copyForBackendCode();
    if (!code) return;
    navigator.clipboard.writeText(code);
    toast.success("Backend code copied to clipboard.");
    setShowExportMenu(false);
  }, [pipeline]);

  const handleDownloadJson = useCallback(() => {
    const json = pipeline.exportPipelineJson();
    if (!json) return;
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "pipeline.json";
    a.click();
    URL.revokeObjectURL(url);
    setShowExportMenu(false);
  }, [pipeline]);

  return (
    <div className="flex items-center justify-between px-4 py-2 border-b border-border bg-card/30">
      {/* Left: mode toggle + stage count */}
      <div className="flex items-center gap-2">
        <div className="flex items-center rounded-md border border-border overflow-hidden">
          <button
            type="button"
            onClick={() => pipeline.setMode("builder")}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 text-xs transition-colors ${
              pipeline.mode === "builder"
                ? "bg-primary text-primary-foreground"
                : "bg-card/50 text-muted-foreground hover:bg-muted/50"
            }`}
          >
            <Hammer className="h-3 w-3" />
            Builder
          </button>
          <button
            type="button"
            onClick={() => pipeline.setMode("text")}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 text-xs transition-colors ${
              pipeline.mode === "text"
                ? "bg-primary text-primary-foreground"
                : "bg-card/50 text-muted-foreground hover:bg-muted/50"
            }`}
          >
            <Braces className="h-3 w-3" />
            Text
          </button>
        </div>

        <Badge variant="subtle" size="sm">
          {pipeline.stages.length} stage
          {pipeline.stages.length !== 1 ? "s" : ""}
        </Badge>

        {pipeline.hasErrors && (
          <Badge variant="destructive" size="sm">
            {pipeline.stageErrors.size} error
            {pipeline.stageErrors.size !== 1 ? "s" : ""}
          </Badge>
        )}
      </div>

      {/* Right: actions */}
      <div className="flex items-center gap-1.5">
        {/* Run / Stop */}
        {pipeline.isRunning ? (
          <Button
            variant="ghost"
            icon={<Square className="h-3.5 w-3.5" />}
            onClick={handleStop}
          >
            Stop
          </Button>
        ) : (
          <Button
            variant="primary"
            icon={
              pipeline.isRunning ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <Play className="h-3.5 w-3.5" />
              )
            }
            onClick={handleRun}
            disabled={pipeline.stages.length === 0 || pipeline.hasErrors}
          >
            Run
          </Button>
        )}

        <IconButton
          variant="default"
          size="sm"
          icon={<RefreshCw className="h-3.5 w-3.5" />}
          label="Re-run pipeline"
          onClick={handleRun}
          disabled={pipeline.stages.length === 0 || pipeline.isRunning}
        />

        <div className="w-px h-5 bg-border mx-1" />

        {/* Save / Load */}
        <IconButton
          variant="default"
          size="sm"
          icon={<Save className="h-3.5 w-3.5" />}
          label="Save pipeline"
          onClick={onOpenSave}
          disabled={pipeline.stages.length === 0}
        />
        <IconButton
          variant="default"
          size="sm"
          icon={<BookOpen className="h-3.5 w-3.5" />}
          label="Load pipeline"
          onClick={onOpenLoad}
        />

        {/* Export */}
        <div className="relative">
          <IconButton
            variant="default"
            size="sm"
            icon={<Download className="h-3.5 w-3.5" />}
            label="Export"
            onClick={() => setShowExportMenu(!showExportMenu)}
            disabled={pipeline.stages.length === 0}
          />
          {showExportMenu && (
            <>
              <div
                className="fixed inset-0 z-40"
                onClick={() => setShowExportMenu(false)}
              />
              <div className="absolute right-0 top-full mt-1 z-50 w-[220px] rounded-lg border border-border bg-card shadow-xl overflow-hidden">
                <button
                  type="button"
                  onClick={handleExportJson}
                  className="w-full text-left flex items-center gap-2 px-3 py-2 text-xs hover:bg-muted/50 transition-colors"
                >
                  <ClipboardCopy className="h-3.5 w-3.5 text-muted-foreground" />
                  Copy Pipeline JSON
                </button>
                <button
                  type="button"
                  onClick={handleCopyBackend}
                  className="w-full text-left flex items-center gap-2 px-3 py-2 text-xs hover:bg-muted/50 transition-colors"
                >
                  <Code2 className="h-3.5 w-3.5 text-muted-foreground" />
                  Copy for Backend Code
                </button>
                <button
                  type="button"
                  onClick={handleDownloadJson}
                  className="w-full text-left flex items-center gap-2 px-3 py-2 text-xs hover:bg-muted/50 transition-colors"
                >
                  <Download className="h-3.5 w-3.5 text-muted-foreground" />
                  Download JSON File
                </button>
              </div>
            </>
          )}
        </div>

        <div className="w-px h-5 bg-border mx-1" />

        {/* Create View */}
        <IconButton
          variant="default"
          size="sm"
          icon={<Eye className="h-3.5 w-3.5" />}
          label="Create View"
          onClick={onOpenCreateView}
          disabled={pipeline.stages.length === 0 || pipeline.hasErrors}
        />

        {/* Settings */}
        <IconButton
          variant="default"
          size="sm"
          icon={<Settings className="h-3.5 w-3.5" />}
          label="Pipeline settings"
          onClick={onOpenSettings}
        />

        {/* Clear */}
        <IconButton
          variant="danger"
          size="sm"
          icon={<Trash2 className="h-3.5 w-3.5" />}
          label="Clear pipeline"
          onClick={pipeline.clearPipeline}
          disabled={pipeline.stages.length === 0}
        />
      </div>
    </div>
  );
}
