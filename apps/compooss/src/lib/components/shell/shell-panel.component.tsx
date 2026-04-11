"use client";

import { useShellPanel } from "@/lib/providers/shell-provider";
import { useShell } from "@/lib/hooks/use-shell.hook";
import { ShellInput } from "@/lib/components/shell/shell-input.component";
import { ShellOutput } from "@/lib/components/shell/shell-output.component";
import { IconButton } from "@compooss/ui";
import {
  ChevronDown,
  ClipboardCopy,
  Eraser,
  GripHorizontal,
  Maximize2,
  Minimize2,
  X,
} from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

const MIN_HEIGHT = 160;
const DEFAULT_HEIGHT = 300;
const MAX_HEIGHT_RATIO = 0.75;

export const ShellPanel: React.FC = () => {
  const { isOpen, close } = useShellPanel();
  const {
    entries,
    currentDatabase,
    isExecuting,
    executeCommand,
    navigateHistory,
    clearOutput,
    copyLastResult,
  } = useShell();

  const [height, setHeight] = useState(DEFAULT_HEIGHT);
  const [isMaximized, setIsMaximized] = useState(false);
  const [collectionNames, setCollectionNames] = useState<string[]>([]);
  const panelRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef<{
    startY: number;
    startHeight: number;
  } | null>(null);

  useEffect(() => {
    if (!isOpen || !currentDatabase) return;
    const controller = new AbortController();

    fetch(`/api/databases/${encodeURIComponent(currentDatabase)}/collections`, {
      signal: controller.signal,
    })
      .then((r) => r.json())
      .then((data) => {
        if (data?.data && Array.isArray(data.data)) {
          setCollectionNames(
            data.data.map((c: { name: string }) => c.name).sort(),
          );
        }
      })
      .catch(() => {});

    return () => controller.abort();
  }, [isOpen, currentDatabase]);

  const handleDragStart = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      dragRef.current = { startY: e.clientY, startHeight: height };

      const handleDrag = (moveEvent: MouseEvent) => {
        if (!dragRef.current) return;
        const delta = dragRef.current.startY - moveEvent.clientY;
        const maxHeight = window.innerHeight * MAX_HEIGHT_RATIO;
        const newHeight = Math.min(
          maxHeight,
          Math.max(MIN_HEIGHT, dragRef.current.startHeight + delta),
        );
        setHeight(newHeight);
        setIsMaximized(false);
      };

      const handleDragEnd = () => {
        dragRef.current = null;
        document.removeEventListener("mousemove", handleDrag);
        document.removeEventListener("mouseup", handleDragEnd);
      };

      document.addEventListener("mousemove", handleDrag);
      document.addEventListener("mouseup", handleDragEnd);
    },
    [height],
  );

  const toggleMaximize = useCallback(() => {
    setIsMaximized((prev) => !prev);
  }, []);

  const panelHeight = isMaximized
    ? window.innerHeight * MAX_HEIGHT_RATIO
    : height;

  if (!isOpen) return null;

  return (
    <div
      ref={panelRef}
      className="border-t border-border flex flex-col bg-[#1e1e1e] shrink-0"
      style={{ height: panelHeight }}
    >
      {/* Drag handle */}
      <div
        className="h-1 cursor-row-resize flex items-center justify-center hover:bg-primary/20 transition-colors group"
        onMouseDown={handleDragStart}
      >
        <GripHorizontal className="h-3 w-3 text-muted-foreground/30 group-hover:text-muted-foreground/60" />
      </div>

      {/* Toolbar */}
      <div className="h-8 flex items-center gap-1 px-2 border-b border-border/30 shrink-0">
        <ChevronDown className="h-3.5 w-3.5 text-emerald-400" />
        <span className="text-xs font-semibold text-foreground/80 tracking-tight">
          MongoDB Shell
        </span>
        <span className="text-[10px] font-mono text-muted-foreground/60 ml-1">
          {currentDatabase}
        </span>

        <div className="flex-1" />

        <IconButton
          variant="ghost"
          size="sm"
          icon={<ClipboardCopy className="h-3.5 w-3.5" />}
          label="Copy last result"
          className="hover:bg-white/5 rounded-sm"
          onClick={copyLastResult}
        />
        <IconButton
          variant="ghost"
          size="sm"
          icon={<Eraser className="h-3.5 w-3.5" />}
          label="Clear output"
          className="hover:bg-white/5 rounded-sm"
          onClick={clearOutput}
        />
        <IconButton
          variant="ghost"
          size="sm"
          icon={
            isMaximized ? (
              <Minimize2 className="h-3.5 w-3.5" />
            ) : (
              <Maximize2 className="h-3.5 w-3.5" />
            )
          }
          label={isMaximized ? "Restore" : "Maximize"}
          className="hover:bg-white/5 rounded-sm"
          onClick={toggleMaximize}
        />
        <IconButton
          variant="ghost"
          size="sm"
          icon={<X className="h-3.5 w-3.5" />}
          label="Close shell"
          className="hover:bg-white/5 rounded-sm"
          onClick={close}
        />
      </div>

      {/* Output */}
      <ShellOutput entries={entries} />

      {/* Input */}
      <ShellInput
        database={currentDatabase}
        isExecuting={isExecuting}
        collectionNames={collectionNames}
        onExecute={executeCommand}
        onNavigateHistory={navigateHistory}
      />
    </div>
  );
};
