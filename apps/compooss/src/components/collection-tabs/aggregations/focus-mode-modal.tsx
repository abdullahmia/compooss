"use client";

import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalFooter,
  Button,
  Badge,
} from "@compooss/ui";
import { Maximize2, Play } from "lucide-react";
import Editor from "@monaco-editor/react";
import type { editor } from "monaco-editor";
import { useCallback, useRef, useState } from "react";
import type { AggregationStage } from "@compooss/types";

interface FocusModeModalProps {
  open: boolean;
  stage: AggregationStage | null;
  previewDocs?: Record<string, unknown>[];
  onClose: () => void;
  onUpdate: (id: string, updates: Partial<Pick<AggregationStage, "value">>) => void;
  onRunPartial: (id: string) => void;
}

export function FocusModeModal({
  open,
  stage,
  previewDocs,
  onClose,
  onUpdate,
  onRunPartial,
}: FocusModeModalProps) {
  const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null);
  const [localValue, setLocalValue] = useState(stage?.value ?? "{}");

  const handleChange = useCallback((value?: string) => {
    setLocalValue(value ?? "");
  }, []);

  const handleMount = useCallback((instance: editor.IStandaloneCodeEditor) => {
    editorRef.current = instance;
    instance.updateOptions({
      fontSize: 13,
      minimap: { enabled: false },
      lineNumbers: "on",
      wordWrap: "on",
      scrollBeyondLastLine: false,
      folding: true,
      renderLineHighlight: "gutter",
      padding: { top: 12, bottom: 12 },
    });
    instance.focus();
  }, []);

  const handleApply = useCallback(() => {
    if (!stage) return;
    onUpdate(stage.id, { value: localValue });
  }, [stage, localValue, onUpdate]);

  const handleRunStage = useCallback(() => {
    if (!stage) return;
    onUpdate(stage.id, { value: localValue });
    onRunPartial(stage.id);
  }, [stage, localValue, onUpdate, onRunPartial]);

  if (!stage) return null;

  return (
    <Modal open={open} onClose={onClose}>
      <ModalContent
        size="xl"
        className="max-h-[90vh] flex flex-col !max-w-4xl"
      >
        <ModalHeader
          icon={<Maximize2 className="h-4 w-4" />}
          title={`Focus: ${stage.stageOperator}`}
          onClose={onClose}
        />

        <div className="flex-1 flex min-h-0 overflow-hidden">
          {/* Editor panel */}
          <div className="flex-1 flex flex-col border-r border-border min-w-0">
            <div className="px-3 py-2 border-b border-border bg-muted/30 flex items-center gap-2">
              <Badge variant="subtle" size="sm" className="font-mono">
                {stage.stageOperator}
              </Badge>
              <span className="text-[11px] text-muted-foreground">
                Stage Editor
              </span>
            </div>
            <div className="flex-1 min-h-0">
              <Editor
                height="100%"
                defaultLanguage="json"
                theme="vs-dark"
                value={localValue}
                onChange={handleChange}
                onMount={handleMount}
                options={{
                  scrollBeyondLastLine: false,
                  automaticLayout: true,
                }}
              />
            </div>
          </div>

          {/* Preview panel */}
          <div className="w-[360px] flex flex-col min-w-0">
            <div className="px-3 py-2 border-b border-border bg-muted/30 flex items-center gap-2">
              <span className="text-[11px] text-muted-foreground">
                Output Preview
              </span>
              {previewDocs && (
                <Badge variant="subtle" size="sm">
                  {previewDocs.length} docs
                </Badge>
              )}
            </div>
            <div className="flex-1 overflow-auto p-3">
              {previewDocs && previewDocs.length > 0 ? (
                <pre className="text-[11px] font-mono text-muted-foreground leading-relaxed">
                  {JSON.stringify(previewDocs, null, 2)}
                </pre>
              ) : (
                <p className="text-xs text-muted-foreground text-center mt-8">
                  Click "Run Stage" to preview output.
                </p>
              )}
            </div>
          </div>
        </div>

        <ModalFooter>
          <Button
            variant="ghost"
            icon={<Play className="h-3.5 w-3.5" />}
            onClick={handleRunStage}
          >
            Run Stage
          </Button>
          <Button variant="primary" onClick={handleApply}>
            Apply Changes
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
