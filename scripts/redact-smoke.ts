/**
 * Smoke-test for the redact utilities.
 * Run with: bun run scripts/redact-smoke.ts
 */

// Inline redact logic to avoid needing Next.js module resolution at script time.
const SENSITIVE_KEYS = new Set([
  "password", "uri", "authorization", "cookie", "token", "secret",
  "credential", "credentials",
]);

function maskUri(uri: string): string {
  return uri.replace(/^mongodb(\+srv)?:\/\/([^:]+):([^@]+)@/, "mongodb$1://$2:***@");
}

function redact(obj: Record<string, unknown>): Record<string, unknown> {
  const result: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(obj)) {
    if (SENSITIVE_KEYS.has(key.toLowerCase())) {
      result[key] = "[REDACTED]";
    } else if (typeof value === "string" && (value.startsWith("mongodb://") || value.startsWith("mongodb+srv://"))) {
      result[key] = maskUri(value);
    } else {
      result[key] = value;
    }
  }
  return result;
}

let passed = 0;
let failed = 0;

function assert(label: string, actual: unknown, expected: unknown) {
  if (actual === expected) {
    console.log(`  ✓ ${label}`);
    passed++;
  } else {
    console.error(`  ✗ ${label}`);
    console.error(`    expected: ${JSON.stringify(expected)}`);
    console.error(`    actual:   ${JSON.stringify(actual)}`);
    failed++;
  }
}

console.log("\n=== redact smoke tests ===\n");

// URI masking
const masked = maskUri("mongodb://admin:s3cr3t@localhost:27017/db");
assert("maskUri hides password", masked, "mongodb://admin:***@localhost:27017/db");

const maskedSrv = maskUri("mongodb+srv://user:pass@cluster.mongodb.net/");
assert("maskUri handles mongodb+srv", maskedSrv, "mongodb+srv://user:***@cluster.mongodb.net/");

const noCredentials = maskUri("mongodb://localhost:27017");
assert("maskUri is a no-op when no credentials", noCredentials, "mongodb://localhost:27017");

// redact() — sensitive keys
const r1 = redact({ password: "hunter2", name: "test" });
assert("redact hides password field", r1.password, "[REDACTED]");
assert("redact keeps non-sensitive fields", r1.name, "test");

const r2 = redact({ token: "abc123", dbName: "mydb" });
assert("redact hides token field", r2.token, "[REDACTED]");

const r3 = redact({ uri: "mongodb://admin:pass@host:27017", dbName: "mydb" });
assert("redact hides uri field", r3.uri, "[REDACTED]");

// redact() — URI strings in values
const r4 = redact({ connectionString: "mongodb://user:secret@cluster:27017" });
assert("redact masks URI in values", r4.connectionString, "mongodb://user:***@cluster:27017");

console.log(`\n${passed} passed, ${failed} failed\n`);
if (failed > 0) process.exit(1);
