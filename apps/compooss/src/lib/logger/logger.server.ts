import pino from "pino";
import type { Logger, LogContext } from "./logger.types";

const createTransport = () => {
  const pretty =
    process.env.LOG_PRETTY === "true" ||
    (process.env.LOG_PRETTY !== "false" && process.env.NODE_ENV !== "production");

  if (pretty) {
    return pino.transport({
      target: "pino-pretty",
      options: {
        colorize: true,
        translateTime: "HH:MM:ss",
        ignore: "pid,hostname",
        messageFormat: "[{module}] {msg}",
      },
    });
  }
  return undefined;
};

const level =
  process.env.LOG_LEVEL ??
  (process.env.NODE_ENV === "production" ? "info" : "debug");

const pinoInstance = pino(
  {
    level,
    redact: {
      paths: ["password", "uri", "authorization", "cookie", "token", "secret", "*.password", "*.uri", "*.token"],
      censor: "[REDACTED]",
    },
    serializers: {
      err: pino.stdSerializers.err,
    },
  },
  createTransport(),
);

const adaptPino = (p: pino.Logger): Logger => {
  return {
    error: (msg, ctx) => p.error(ctx ?? {}, msg),
    warn: (msg, ctx) => p.warn(ctx ?? {}, msg),
    info: (msg, ctx) => p.info(ctx ?? {}, msg),
    debug: (msg, ctx) => p.debug(ctx ?? {}, msg),
    trace: (msg, ctx) => p.trace(ctx ?? {}, msg),
    child: (ctx: LogContext) => adaptPino(p.child(ctx)),
  };
};

export const serverLogger: Logger = adaptPino(pinoInstance);
