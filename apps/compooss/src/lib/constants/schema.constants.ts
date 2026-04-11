export const SCHEMA_SAMPLE_SIZES = [100, 500, 1000, 5000] as const;

export const TYPE_COLORS: Record<string, string> = {
  String: "var(--color-info)",
  Number: "var(--color-json-number)",
  Boolean: "var(--color-json-boolean)",
  Date: "var(--color-success)",
  ObjectId: "var(--color-muted-foreground)",
  Null: "var(--color-destructive)",
  Object: "var(--color-warning)",
  Array: "var(--color-accent)",
  Unknown: "var(--color-muted-foreground)",
};

export const VALUE_PALETTE = [
  "#3b82f6",
  "#10b981",
  "#f59e0b",
  "#8b5cf6",
  "#ef4444",
  "#06b6d4",
  "#f97316",
  "#ec4899",
  "#14b8a6",
  "#a855f7",
];
