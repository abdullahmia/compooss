const SENSITIVE_KEYS = new Set([
  "password",
  "uri",
  "authorization",
  "cookie",
  "token",
  "secret",
  "credential",
  "credentials",
]);

const MAX_STRING_LENGTH = 500;

export const maskUri = (uri: string): string => {
  try {
    return uri.replace(
      /^mongodb(\+srv)?:\/\/([^:]+):([^@]+)@/,
      "mongodb$1://$2:***@",
    );
  } catch {
    return uri;
  }
};

export const redact = (obj: Record<string, unknown>): Record<string, unknown> => {
  const result: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(obj)) {
    if (SENSITIVE_KEYS.has(key.toLowerCase())) {
      result[key] = "[REDACTED]";
    } else if (typeof value === "string" && value.length > MAX_STRING_LENGTH) {
      result[key] = value.slice(0, MAX_STRING_LENGTH) + "…[truncated]";
    } else if (
      typeof value === "string" &&
      (value.startsWith("mongodb://") || value.startsWith("mongodb+srv://"))
    ) {
      result[key] = maskUri(value);
    } else {
      result[key] = value;
    }
  }
  return result;
};
