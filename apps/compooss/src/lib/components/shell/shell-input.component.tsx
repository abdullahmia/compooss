"use client";

import Editor, { type OnMount } from "@monaco-editor/react";
import type { editor as MonacoEditor } from "monaco-editor";
import { useCallback, useEffect, useRef, useState } from "react";
import { registerShellCompletions } from "@/lib/components/shell/shell-completions";

type Props = {
  database: string;
  isExecuting: boolean;
  collectionNames: string[];
  onExecute: (command: string) => void;
  onNavigateHistory: (direction: "up" | "down") => string | null;
};

export const ShellInput: React.FC<Props> = ({
  database,
  isExecuting,
  collectionNames,
  onExecute,
  onNavigateHistory,
}) => {
  const editorRef = useRef<MonacoEditor.IStandaloneCodeEditor | null>(null);
  const completionsDisposable = useRef<{ dispose: () => void } | null>(null);
  const [editorHeight, setEditorHeight] = useState(28);

  // Refs keep Monaco command handlers current without remounting the editor.
  const isExecutingRef = useRef(isExecuting);
  const onExecuteRef = useRef(onExecute);
  const onNavigateHistoryRef = useRef(onNavigateHistory);
  const collectionNamesRef = useRef(collectionNames);

  useEffect(() => { isExecutingRef.current = isExecuting; }, [isExecuting]);
  useEffect(() => { onExecuteRef.current = onExecute; }, [onExecute]);
  useEffect(() => { onNavigateHistoryRef.current = onNavigateHistory; }, [onNavigateHistory]);
  useEffect(() => { collectionNamesRef.current = collectionNames; }, [collectionNames]);

  // Dispose the completion provider when the shell unmounts so it doesn't
  // accumulate duplicate providers across open/close cycles.
  useEffect(() => {
    return () => {
      completionsDisposable.current?.dispose();
      completionsDisposable.current = null;
    };
  }, []);

  const handleMount: OnMount = useCallback((instance, monaco) => {
    editorRef.current = instance;

    instance.updateOptions({
      fontSize: 12,
      fontFamily: "'JetBrains Mono', 'Fira Code', 'Cascadia Code', monospace",
      minimap: { enabled: false },
      lineNumbers: "off",
      glyphMargin: false,
      folding: false,
      lineDecorationsWidth: 0,
      lineNumbersMinChars: 0,
      renderLineHighlight: "none",
      scrollbar: {
        vertical: "hidden",
        horizontal: "auto",
        handleMouseWheel: false,
      },
      overviewRulerLanes: 0,
      hideCursorInOverviewRuler: true,
      overviewRulerBorder: false,
      wordWrap: "on",
      scrollBeyondLastLine: false,
      automaticLayout: true,
      padding: { top: 6, bottom: 6 },
      suggestOnTriggerCharacters: true,
      quickSuggestions: true,
      tabCompletion: "on",
    });

    if (!completionsDisposable.current) {
      completionsDisposable.current = registerShellCompletions(
        monaco,
        () => collectionNamesRef.current,
      );
    }

    instance.addCommand(
      monaco.KeyCode.Enter,
      () => {
        const value = instance.getValue().trim();
        if (!value || isExecutingRef.current) return;
        onExecuteRef.current(value);
        instance.setValue("");
      },
    );

    instance.addCommand(
      monaco.KeyMod.Shift | monaco.KeyCode.Enter,
      () => {
        instance.trigger("keyboard", "type", { text: "\n" });
      },
    );

    instance.addCommand(
      monaco.KeyCode.UpArrow,
      () => {
        const model = instance.getModel();
        const position = instance.getPosition();
        if (model && position && position.lineNumber === 1) {
          const cmd = onNavigateHistoryRef.current("up");
          if (cmd !== null) {
            instance.setValue(cmd);
            const lineCount = model.getLineCount();
            const lastCol = model.getLineMaxColumn(lineCount);
            instance.setPosition({ lineNumber: lineCount, column: lastCol });
          }
        } else {
          instance.trigger("keyboard", "cursorUp", {});
        }
      },
    );

    instance.addCommand(
      monaco.KeyCode.DownArrow,
      () => {
        const model = instance.getModel();
        const position = instance.getPosition();
        if (
          model &&
          position &&
          position.lineNumber === model.getLineCount()
        ) {
          const cmd = onNavigateHistoryRef.current("down");
          if (cmd !== null) {
            instance.setValue(cmd);
            const lineCount = model.getLineCount();
            const lastCol = model.getLineMaxColumn(lineCount);
            instance.setPosition({ lineNumber: lineCount, column: lastCol });
          }
        } else {
          instance.trigger("keyboard", "cursorDown", {});
        }
      },
    );

    // Grow the input area as the user types multi-line commands.
    instance.onDidContentSizeChange(() => {
      const newHeight = Math.min(200, Math.max(28, instance.getContentHeight()));
      setEditorHeight(newHeight);
    });

    instance.focus();
  }, []);

  return (
    <div className="border-t border-zinc-800 bg-[#1a1a1a] flex items-start">
      <span className="text-emerald-400 text-[11px] font-mono shrink-0 pl-3 pt-[9px] select-none">
        {database}&gt;
      </span>
      <div className="flex-1 min-w-0">
        <Editor
          height={`${editorHeight}px`}
          defaultLanguage="javascript"
          theme="vs-dark"
          defaultValue=""
          onMount={handleMount}
          options={{
            scrollBeyondLastLine: false,
            automaticLayout: true,
          }}
          loading={null}
        />
      </div>
      {isExecuting && (
        <div className="pr-3 pt-[9px]">
          <div className="h-3 w-3 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin" />
        </div>
      )}
    </div>
  );
};
