"use client";

import Editor from "@monaco-editor/react";
import type { editor } from "monaco-editor";
import { useCallback, useRef } from "react";

interface StageEditorProps {
  value: string;
  onChange: (value: string) => void;
  height?: string;
  readOnly?: boolean;
}

export function StageEditor({
  value,
  onChange,
  height = "120px",
  readOnly = false,
}: StageEditorProps) {
  const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null);

  const handleChange = useCallback(
    (nextValue?: string) => {
      onChange(nextValue ?? "");
    },
    [onChange],
  );

  const handleMount = useCallback(
    (instance: editor.IStandaloneCodeEditor) => {
      editorRef.current = instance;
      instance.updateOptions({
        fontSize: 12,
        minimap: { enabled: false },
        lineNumbers: "on",
        wordWrap: "on",
        readOnly,
        scrollBeyondLastLine: false,
        folding: true,
        renderLineHighlight: "gutter",
        overviewRulerBorder: false,
        hideCursorInOverviewRuler: true,
        lineDecorationsWidth: 0,
        lineNumbersMinChars: 3,
        glyphMargin: false,
        padding: { top: 8, bottom: 8 },
      });
    },
    [readOnly],
  );

  return (
    <div className="border border-border rounded-sm overflow-hidden bg-card">
      <Editor
        height={height}
        defaultLanguage="json"
        theme="vs-dark"
        value={value}
        onChange={handleChange}
        onMount={handleMount}
        options={{
          scrollBeyondLastLine: false,
          automaticLayout: true,
        }}
      />
    </div>
  );
}
