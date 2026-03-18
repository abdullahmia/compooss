"use client";

import { useExecuteCommand } from "@/lib/services/shell/shell.service";
import type { ShellEntry, ShellResponse } from "@compooss/types";
import { useCallback, useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";

const STORAGE_KEY = "compooss:shell:session";
const MAX_HISTORY = 200;
const MAX_COMMAND_HISTORY = 100;

interface ShellSession {
  database: string;
  commandHistory: string[];
  entries: ShellEntry[];
}

function getDbFromPath(): string | null {
  if (typeof window === "undefined") return null;
  const match = window.location.pathname.match(/\/databases\/([^/]+)/);
  return match ? decodeURIComponent(match[1]) : null;
}

function resolveInitialDatabase(): string {
  const session = loadSessionRaw();
  if (session?.database) return session.database;
  return getDbFromPath() ?? "test";
}

function loadSessionRaw(): ShellSession | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw) as ShellSession;
  } catch {
    // ignore
  }
  return null;
}

function loadSession(): ShellSession {
  const session = loadSessionRaw();
  if (session) {
    return {
      database: session.database || getDbFromPath() || "test",
      commandHistory: session.commandHistory ?? [],
      entries: session.entries ?? [],
    };
  }
  return { database: getDbFromPath() ?? "test", commandHistory: [], entries: [] };
}

function saveSession(session: ShellSession) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
  } catch {
    // storage full or unavailable
  }
}

export function useShell() {
  const pathname = usePathname();
  const [entries, setEntries] = useState<ShellEntry[]>(() => loadSession().entries);
  const [currentDatabase, setCurrentDatabase] = useState(resolveInitialDatabase);
  const [commandHistory, setCommandHistory] = useState<string[]>(() => loadSession().commandHistory);
  const hasUserSwitched = useRef(false);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [isExecuting, setIsExecuting] = useState(false);
  const idCounter = useRef(0);

  const mutation = useExecuteCommand();

  useEffect(() => {
    if (hasUserSwitched.current) return;
    const match = pathname.match(/\/databases\/([^/]+)/);
    if (match) {
      const dbFromUrl = decodeURIComponent(match[1]);
      if (dbFromUrl && dbFromUrl !== currentDatabase) {
        setCurrentDatabase(dbFromUrl);
      }
    }
  }, [pathname]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    saveSession({
      database: currentDatabase,
      commandHistory,
      entries: entries.slice(-MAX_HISTORY),
    });
  }, [entries, currentDatabase, commandHistory]);

  const executeCommand = useCallback(
    async (command: string) => {
      const trimmed = command.trim();
      if (!trimmed) return;

      setIsExecuting(true);
      const entryId = `shell-${Date.now()}-${idCounter.current++}`;

      try {
        const response = await mutation.mutateAsync({
          command: trimmed,
          database: currentDatabase,
        });

        if (response.type === "switchDb") {
          hasUserSwitched.current = true;
          setCurrentDatabase(response.database);
        }

        const entry: ShellEntry = {
          id: entryId,
          command: trimmed,
          database: currentDatabase,
          response,
          timestamp: Date.now(),
        };

        setEntries((prev) => [...prev.slice(-MAX_HISTORY + 1), entry]);
      } catch (err) {
        const errorResponse: ShellResponse = {
          result: err instanceof Error ? err.message : String(err),
          type: "error",
          database: currentDatabase,
          executionTimeMs: 0,
        };
        const entry: ShellEntry = {
          id: entryId,
          command: trimmed,
          database: currentDatabase,
          response: errorResponse,
          timestamp: Date.now(),
        };
        setEntries((prev) => [...prev.slice(-MAX_HISTORY + 1), entry]);
      } finally {
        setIsExecuting(false);
      }

      setCommandHistory((prev) => {
        const filtered = prev.filter((c) => c !== trimmed);
        return [...filtered.slice(-MAX_COMMAND_HISTORY + 1), trimmed];
      });
      setHistoryIndex(-1);
    },
    [currentDatabase, mutation],
  );

  const navigateHistory = useCallback(
    (direction: "up" | "down"): string | null => {
      if (commandHistory.length === 0) return null;

      let newIndex: number;
      if (direction === "up") {
        newIndex =
          historyIndex === -1
            ? commandHistory.length - 1
            : Math.max(0, historyIndex - 1);
      } else {
        newIndex =
          historyIndex === -1 ? -1 : historyIndex + 1;
        if (newIndex >= commandHistory.length) {
          setHistoryIndex(-1);
          return "";
        }
      }

      setHistoryIndex(newIndex);
      return newIndex >= 0 ? commandHistory[newIndex] : "";
    },
    [commandHistory, historyIndex],
  );

  const clearOutput = useCallback(() => {
    setEntries([]);
  }, []);

  const copyLastResult = useCallback(async () => {
    const last = entries[entries.length - 1];
    if (!last) return;
    const text =
      typeof last.response.result === "string"
        ? last.response.result
        : JSON.stringify(last.response.result, null, 2);
    await navigator.clipboard.writeText(text);
  }, [entries]);

  return {
    entries,
    currentDatabase,
    isExecuting,
    historyIndex,
    executeCommand,
    navigateHistory,
    clearOutput,
    copyLastResult,
    setCurrentDatabase,
  };
}
