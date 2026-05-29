"use client";

import type { Logger, LogLevel, LogContext } from "./logger.types";

const isProd = process.env.NODE_ENV === "production";

// In production, only error logs reach the browser console.
const MIN_LEVEL: LogLevel = isProd ? "error" : "debug";

const LEVEL_ORDER: Record<LogLevel, number> = {
  trace: 0,
  debug: 1,
  info: 2,
  warn: 3,
  error: 4,
};

const shouldLog = (level: LogLevel): boolean =>
  LEVEL_ORDER[level] >= LEVEL_ORDER[MIN_LEVEL];

const emit = (level: LogLevel, msg: string, ctx?: LogContext, bound: LogContext = {}): void => {
  if (!shouldLog(level)) return;
  const merged = ctx ? { ...bound, ...ctx } : bound;
  const prefix = `[${bound.module ?? "client"}]`;
  const args = Object.keys(merged).length > 0 ? [prefix, msg, merged] : [prefix, msg];
  console[level === "trace" || level === "debug" ? "debug" : level === "info" ? "info" : level === "warn" ? "warn" : "error"](...args);
}

const makeLogger = (bound: LogContext = {}): Logger => {
  return {
    error: (msg, ctx) => emit("error", msg, ctx, bound),
    warn: (msg, ctx) => emit("warn", msg, ctx, bound),
    info: (msg, ctx) => emit("info", msg, ctx, bound),
    debug: (msg, ctx) => emit("debug", msg, ctx, bound),
    trace: (msg, ctx) => emit("trace", msg, ctx, bound),
    child: (ctx) => makeLogger({ ...bound, ...ctx }),
  };
}

export const clientLogger: Logger = makeLogger({ module: "client" });
