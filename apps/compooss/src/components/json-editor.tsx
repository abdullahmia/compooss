"use client";

import Editor from "@monaco-editor/react";
import type { editor } from "monaco-editor";

type Props = {
  value: string;
  onChange: (value: string) => void;
  height?: string;
};

export function JsonEditor({ value, onChange, height = "260px" }: Props) {
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

