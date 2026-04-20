export type ViewTab =
  | "documents"
  | "aggregations"
  | "schema"
  | "explain"
  | "indexes"
  | "validation"
  | "diagram";

export const VALID_TABS: ViewTab[] = [
  "documents",
  "aggregations",
  "schema",
  "explain",
  "indexes",
  "validation",
  "diagram",
];
