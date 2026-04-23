"use client";

import type { ShellEntry } from "@compooss/types";
import { useEffect, useRef } from "react";

const MAX_TABLE_COLS = 8;
const MAX_CELL_CHARS = 36;

// ─── EJSON / value helpers ────────────────────────────────────────────────────

function isPlainObject(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null && !Array.isArray(v);
}

function isDocumentArray(v: unknown): v is Record<string, unknown>[] {
  return Array.isArray(v) && v.length > 0 && v.every(isPlainObject);
}

type MongoValueMeta =
  | { kind: "oid"; display: string }
  | { kind: "date"; display: string }
  | { kind: "string"; value: string }
  | { kind: "number"; value: number }
  | { kind: "boolean"; value: boolean }
  | { kind: "null" }
  | { kind: "object"; value: Record<string, unknown> }
  | { kind: "array"; value: unknown[] };

function classify(v: unknown): MongoValueMeta {
  if (v === null || v === undefined) return { kind: "null" };
  if (typeof v === "string") return { kind: "string", value: v };
  if (typeof v === "number") return { kind: "number", value: v };
  if (typeof v === "boolean") return { kind: "boolean", value: v };
  if (Array.isArray(v)) return { kind: "array", value: v };
  if (isPlainObject(v)) {
    if (typeof v.$oid === "string")
      return { kind: "oid", display: `ObjectId("${v.$oid}")` };
    if (typeof v.$date === "string")
      return { kind: "date", display: `ISODate("${v.$date}")` };
    if (typeof v.$numberLong === "string")
      return { kind: "number", value: Number(v.$numberLong) };
    if (typeof v.$numberDecimal === "string")
      return { kind: "number", value: Number(v.$numberDecimal) };
    return { kind: "object", value: v };
  }
  return { kind: "null" };
}

function metaToCell(meta: MongoValueMeta): { text: string; cls: string } {
  switch (meta.kind) {
    case "null":
      return { text: "null", cls: "text-zinc-500" };
    case "string":
      return { text: meta.value, cls: "text-amber-300/90" };
    case "number":
      return { text: String(meta.value), cls: "text-emerald-400/90" };
    case "boolean":
      return { text: String(meta.value), cls: "text-yellow-300/90" };
    case "oid":
      return { text: meta.display, cls: "text-violet-400/80" };
    case "date":
      return { text: meta.display, cls: "text-sky-400/80" };
    case "array":
      return { text: `[…] ${meta.value.length}`, cls: "text-zinc-400" };
    case "object":
      return { text: "{…}", cls: "text-zinc-400" };
  }
}

function truncate(s: string) {
  return s.length > MAX_CELL_CHARS ? s.slice(0, MAX_CELL_CHARS - 1) + "…" : s;
}

// ─── Syntax-highlighted JSON ──────────────────────────────────────────────────

function JsonNode({ value, depth = 0 }: { value: unknown; depth?: number }) {
  const meta = classify(value);
  const indent = "  ".repeat(depth);
  const innerIndent = "  ".repeat(depth + 1);

  if (meta.kind === "null")
    return <span className="text-zinc-500">null</span>;
  if (meta.kind === "boolean")
    return <span className="text-yellow-300">{String(meta.value)}</span>;
  if (meta.kind === "number")
    return <span className="text-emerald-400">{meta.value}</span>;
  if (meta.kind === "string")
    return <span className="text-amber-300">"{meta.value}"</span>;
  if (meta.kind === "oid")
    return <span className="text-violet-400">{meta.display}</span>;
  if (meta.kind === "date")
    return <span className="text-sky-400">{meta.display}</span>;

  if (meta.kind === "array") {
    if (meta.value.length === 0)
      return <span className="text-zinc-400">[]</span>;
    return (
      <>
        <span className="text-zinc-400">{"["}</span>
        {"\n"}
        {meta.value.map((item, i) => (
          <span key={i}>
            {innerIndent}
            <JsonNode value={item} depth={depth + 1} />
            {i < meta.value.length - 1 && (
              <span className="text-zinc-500">,</span>
            )}
            {"\n"}
          </span>
        ))}
        {indent}
        <span className="text-zinc-400">{"]"}</span>
      </>
    );
  }

  if (meta.kind === "object") {
    const entries = Object.entries(meta.value);
    if (entries.length === 0)
      return <span className="text-zinc-400">{"{}"}</span>;
    return (
      <>
        <span className="text-zinc-400">{"{"}</span>
        {"\n"}
        {entries.map(([k, v], i) => (
          <span key={k}>
            {innerIndent}
            <span className="text-blue-300/90">"{k}"</span>
            <span className="text-zinc-500">: </span>
            <JsonNode value={v} depth={depth + 1} />
            {i < entries.length - 1 && (
              <span className="text-zinc-500">,</span>
            )}
            {"\n"}
          </span>
        ))}
        {indent}
        <span className="text-zinc-400">{"}"}</span>
      </>
    );
  }

  return null;
}

// ─── Document table ───────────────────────────────────────────────────────────

function DocumentTable({ docs }: { docs: Record<string, unknown>[] }) {
  const allKeys = Array.from(
    docs.reduce<Set<string>>((s, doc) => {
      Object.keys(doc).forEach((k) => s.add(k));
      return s;
    }, new Set()),
  );

  const keys = [
    ...(allKeys.includes("_id") ? ["_id"] : []),
    ...allKeys.filter((k) => k !== "_id"),
  ].slice(0, MAX_TABLE_COLS);

  const hiddenCols = allKeys.length - keys.length;

  return (
    <div className="mt-1.5 overflow-x-auto rounded border border-zinc-800">
      <table className="text-[11px] font-mono border-collapse w-full">
        <thead>
          <tr className="bg-zinc-800/60">
            {keys.map((key) => (
              <th
                key={key}
                className="text-left px-3 py-1.5 text-zinc-400 font-medium whitespace-nowrap border-b border-zinc-700/60"
              >
                {key}
              </th>
            ))}
            {hiddenCols > 0 && (
              <th className="px-3 py-1.5 text-zinc-600 font-normal border-b border-zinc-700/60">
                +{hiddenCols} more
              </th>
            )}
          </tr>
        </thead>
        <tbody>
          {docs.map((doc, i) => (
            <tr
              key={i}
              className="border-b border-zinc-800/80 last:border-0 hover:bg-white/[0.025] transition-colors"
            >
              {keys.map((key) => {
                const { text, cls } = metaToCell(classify(doc[key]));
                return (
                  <td
                    key={key}
                    className={`px-3 py-1 whitespace-nowrap ${cls}`}
                    title={text}
                  >
                    {truncate(text)}
                  </td>
                );
              })}
              {hiddenCols > 0 && (
                <td className="px-3 py-1 text-zinc-700">…</td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
      <div className="px-3 py-1 text-[10px] text-zinc-600 bg-zinc-900/40 border-t border-zinc-800">
        {docs.length} document{docs.length !== 1 ? "s" : ""}
        {hiddenCols > 0 && ` · ${hiddenCols} column${hiddenCols !== 1 ? "s" : ""} hidden`}
      </div>
    </div>
  );
}

// ─── Result renderer ──────────────────────────────────────────────────────────

function ResultContent({ entry }: { entry: ShellEntry }) {
  const { response } = entry;
  const result = response.result;

  if (response.type === "error") {
    return (
      <div className="mt-0.5 pl-4 text-red-400 text-[11px] font-mono whitespace-pre-wrap break-all">
        {typeof result === "string" ? result : JSON.stringify(result)}
      </div>
    );
  }

  if (response.type === "info" || response.type === "switchDb") {
    return (
      <div className="mt-0.5 pl-4 text-zinc-500 text-[11px] font-mono italic">
        {typeof result === "string" ? result : JSON.stringify(result)}
      </div>
    );
  }

  if (result === null || result === undefined) return null;

  if (isDocumentArray(result)) {
    return (
      <div className="pl-4">
        <DocumentTable docs={result} />
      </div>
    );
  }

  if (Array.isArray(result)) {
    return (
      <div className="mt-0.5 pl-4 text-[11px] font-mono space-y-0.5">
        {result.map((item, i) => {
          const { text, cls } = metaToCell(classify(item));
          return (
            <div key={i} className={cls}>
              {text}
            </div>
          );
        })}
      </div>
    );
  }

  if (isPlainObject(result) || typeof result !== "string") {
    return (
      <div className="mt-0.5 pl-4 text-[11px] font-mono whitespace-pre leading-relaxed">
        <JsonNode value={result} />
      </div>
    );
  }

  return (
    <div className="mt-0.5 pl-4 text-[11px] font-mono text-zinc-300 whitespace-pre-wrap">
      {result}
    </div>
  );
}

// ─── Entry block ──────────────────────────────────────────────────────────────

function EntryBlock({ entry }: { entry: ShellEntry }) {
  const isError = entry.response.type === "error";

  return (
    <div className="py-1.5">
      <div className="flex items-start gap-1.5 font-mono text-[11px]">
        <span className="text-emerald-400 shrink-0 select-none leading-relaxed">
          {entry.database}&gt;
        </span>
        <span className="text-zinc-200 whitespace-pre-wrap break-all leading-relaxed">
          {entry.command}
        </span>
      </div>

      <ResultContent entry={entry} />

      {entry.response.executionTimeMs > 0 && !isError && (
        <div className="pl-4 mt-0.5 text-[10px] text-zinc-700 font-mono">
          {entry.response.executionTimeMs.toFixed(0)}ms
        </div>
      )}
    </div>
  );
}

// ─── Shell output ─────────────────────────────────────────────────────────────

export const ShellOutput: React.FC<{ entries: ShellEntry[] }> = ({
  entries,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [entries]);

  return (
    <div
      ref={containerRef}
      className="flex-1 overflow-y-auto px-3 py-2 divide-y divide-zinc-800/60 bg-[#1e1e1e] min-h-0 scrollbar-thin scrollbar-thumb-zinc-700 scrollbar-track-transparent"
    >
      {entries.length === 0 ? (
        <div className="py-2 font-mono text-[11px] space-y-1">
          <div className="text-emerald-400/80">MongoDB Shell</div>
          <div className="text-zinc-600">
            Using MongoDB:{" "}
            <span className="text-zinc-500">mongosh compatible</span>
          </div>
          <div className="text-zinc-700 mt-2">
            Type{" "}
            <span className="text-zinc-400">help</span>
            {" · "}
            <span className="text-zinc-400">show dbs</span>
            {" · "}
            <span className="text-zinc-400">show collections</span>
          </div>
        </div>
      ) : (
        entries.map((entry) => <EntryBlock key={entry.id} entry={entry} />)
      )}
    </div>
  );
};
