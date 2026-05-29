export type LogLevel = "error" | "warn" | "info" | "debug" | "trace";

export type LogContext = Record<string, unknown>;

export type Logger = {
  error(msg: string, ctx?: LogContext): void;
  warn(msg: string, ctx?: LogContext): void;
  info(msg: string, ctx?: LogContext): void;
  debug(msg: string, ctx?: LogContext): void;
  trace(msg: string, ctx?: LogContext): void;
  child(ctx: LogContext): Logger;
};
