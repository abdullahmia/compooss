import type { TIndexFieldForm } from "@/lib/schemas";

export const DIRECTION_OPTIONS: { value: TIndexFieldForm["direction"]; label: string }[] = [
  { value: "1", label: "1 (asc)" },
  { value: "-1", label: "-1 (desc)" },
  { value: "text", label: "text" },
  { value: "2dsphere", label: "2dsphere" },
  { value: "2d", label: "2d" },
  { value: "hashed", label: "hashed" },
];
