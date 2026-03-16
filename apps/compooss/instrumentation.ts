/**
 * Next.js instrumentation hook.
 * Connection is now managed dynamically via the ConnectionManager,
 * so no startup URI validation is needed.
 */
export async function register() {
  // No-op: connections are established on demand via /api/connection/connect
}
