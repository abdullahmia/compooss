import type { ValidationLevel, ValidationAction } from "@compooss/types";

export const VALIDATION_LEVELS: { value: ValidationLevel; label: string; description: string }[] = [
  { value: "strict", label: "Strict", description: "Apply to all inserts and updates" },
  { value: "moderate", label: "Moderate", description: "Apply to inserts and updates on existing valid documents" },
  { value: "off", label: "Off", description: "No validation is enforced" },
];

export const VALIDATION_ACTIONS: { value: ValidationAction; label: string; description: string }[] = [
  { value: "error", label: "Error", description: "Reject documents that fail validation" },
  { value: "warn", label: "Warn", description: "Allow invalid documents but log a warning" },
];

export const VALIDATION_SAMPLE_SIZES = [100, 500, 1000, 5000] as const;
