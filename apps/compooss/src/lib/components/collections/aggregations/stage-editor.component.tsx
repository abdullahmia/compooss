"use client";

import Editor from "@monaco-editor/react";
import { defineMonacoThemes } from "@/lib/components/collections/monaco-themes";
import type { editor } from "monaco-editor";
import { useTheme } from "next-themes";
import { useCallback, useRef } from "react";

type Props = {
  value: string;
  onChange: (value: string) => void;
  height?: string;
  readOnly?: boolean;
};

export const StageEditor: React.FC<Props> = ({
  value,
  onChange,
  height = "120px",
  readOnly = false,
}) => {
  const { resolvedTheme } = useTheme();
  const monacoTheme = resolvedTheme === "light" ? "compooss-light" : "compooss-dark";
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
    <div className="border border-border rounded-sm overflow-hidden">
      <Editor
        height={height}
        defaultLanguage="json"
        theme={monacoTheme}
        value={value}
        onChange={handleChange}
        beforeMount={defineMonacoThemes}
        onMount={handleMount}
        options={{
          scrollBeyondLastLine: false,
          automaticLayout: true,
        }}
      />
    </div>
  );
};
