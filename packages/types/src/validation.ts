export type ValidationLevel = "off" | "moderate" | "strict";
export type ValidationAction = "error" | "warn";

export interface CollectionValidation {
  validator: Record<string, unknown> | null;
  validationLevel: ValidationLevel;
  validationAction: ValidationAction;
}

export interface InvalidDocument {
  _id: string;
  errors: string[];
}

export interface ValidationCheckResult {
  totalDocuments: number;
  validCount: number;
  invalidCount: number;
  invalidDocuments: InvalidDocument[];
}
