"use client";

import Editor from "@monaco-editor/react";
import { defineMonacoThemes } from "@/lib/components/collections/monaco-themes";
import type { editor } from "monaco-editor";
import { useTheme } from "next-themes";

export const JsonEditor: React.FC<Props> = ({ value, onChange, height = "260px" }) => {
  const { resolvedTheme } = useTheme();

  const monacoTheme = resolvedTheme === "light" ? "compooss-light" : "compooss-dark";

  const handleChange = (nextValue?: string) => {
    onChange(nextValue ?? "");
  };

  const handleMount = (instance: editor.IStandaloneCodeEditor) => {
    instance.updateOptions({
      fontSize: 12,
      minimap: { enabled: false },
      lineNumbers: "on",
      wordWrap: "on",
    });
  };

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
