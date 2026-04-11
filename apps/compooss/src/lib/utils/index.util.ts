export function getIndexType(key: Record<string, number | string>): string {
  const vals = Object.values(key);
  if (vals.includes("text")) return "Text";
  if (vals.includes("2dsphere")) return "2dsphere";
  if (vals.includes("2d")) return "2d";
  if (vals.includes("hashed")) return "Hashed";
  if (vals.length > 1) return "Compound";
  return "Standard";
}

export function formatKeySpec(key: Record<string, number | string>): string {
  return Object.entries(key)
    .map(([f, v]) => `${f}: ${v}`)
    .join(", ");
}
