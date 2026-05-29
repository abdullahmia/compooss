export type { Logger, LogLevel, LogContext } from "./logger.types";
export { maskUri, redact } from "./redact";
export { clientLogger } from "./logger.client";
export { withLogging } from "./with-logging";

// Server logger — only import on the server side.
// Use `serverLogger` in API routes and server-side modules.
export { serverLogger } from "./logger.server";
