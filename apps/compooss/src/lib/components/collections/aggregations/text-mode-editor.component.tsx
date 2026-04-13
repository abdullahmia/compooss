"use client";

import Editor from "@monaco-editor/react";
import { defineMonacoThemes } from "@/lib/components/collections/monaco-themes";
import type { editor } from "monaco-editor";
import { useTheme } from "next-themes";
import { useCallback, useRef, useState } from "react";
import { Badge, Button } from "@compooss/ui";
import { AlertTriangle, Check } from "lucide-react";
import type { UseAggregationPipeline } from "@/lib/components/collections/aggregations/use-aggregation-pipeline";

type Props = {
  pipeline: UseAggregationPipeline;
};

export const TextModeEditor: React.FC<Props> = ({ pipeline }) => {
  const { resolvedTheme } = useTheme();
  const monacoTheme = resolvedTheme === "light" ? "compooss-light" : "compooss-dark";
  const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null);
  const [localText, setLocalText] = useState(pipeline.pipelineText);
  const [parseError, setParseError] = useState<string | null>(null);
  const [isDirty, setIsDirty] = useState(false);

  const handleChange = useCallback(
    (value?: string) => {
      const text = value ?? "[]";
      setLocalText(text);
      setIsDirty(true);

      try {
        JSON.parse(text);
        setParseError(null);
      } catch (e) {
        setParseError(e instanceof Error ? e.message : "Invalid JSON");
      }
    },
    [],
  );

  const handleApply = useCallback(() => {
    const success = pipeline.importFromText(localText);
    if (success) {
      setIsDirty(false);
      setParseError(null);
    }
  }, [localText, pipeline]);

  const handleMount = useCallback((instance: editor.IStandaloneCodeEditor) => {
    editorRef.current = instance;
    instance.updateOptions({
      fontSize: 12,
      minimap: { enabled: false },
      lineNumbers: "on",
      wordWrap: "on",
      scrollBeyondLastLine: false,
      folding: true,
      renderLineHighlight: "gutter",
      padding: { top: 8, bottom: 8 },
    });
  }, []);

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <div className="flex items-center justify-between px-4 py-2 border-b border-border bg-card/30">
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground">
            Full Pipeline JSON
          </span>
          {parseError ? (
            <Badge variant="destructive" size="sm">
              <AlertTriangle className="h-3 w-3 mr-1" />
              Syntax Error
            </Badge>
          ) : (
            <Badge variant="success" size="sm">
              <Check className="h-3 w-3 mr-1" />
              Valid
            </Badge>
          )}
        </div>
        {isDirty && (
          <Button
            variant="primary"
            onClick={handleApply}
            disabled={!!parseError}
          >
            Apply to Builder
          </Button>
        )}
      </div>

      {parseError && (
        <div className="px-4 py-1.5 text-[11px] text-destructive bg-destructive/5 border-b border-destructive/20">
          {parseError}
        </div>
      )}

      <div className="flex-1 min-h-0">
        <Editor
          height="100%"
          defaultLanguage="json"
          theme={monacoTheme}
          value={localText}
          onChange={handleChange}
          beforeMount={defineMonacoThemes}
          onMount={handleMount}
          options={{
            scrollBeyondLastLine: false,
            automaticLayout: true,
          }}
        />
      </div>
    </div>
  );
};
