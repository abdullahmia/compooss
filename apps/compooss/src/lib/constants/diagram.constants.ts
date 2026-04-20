export const DIAGRAM_NODE_SIZE = {
  entityWidth: 220,
  entityHeight: 60,
  fieldWidth: 200,
  fieldHeight: 44,
} as const;

export const DIAGRAM_LAYOUT = {
  er: { rankdir: "TB" as const, nodesep: 80, ranksep: 150 },
  schema: { rankdir: "TB" as const, nodesep: 40, ranksep: 80 },
} as const;

export const DIAGRAM_EDGE_COLORS = {
  objectid: "#6366f1",
  suffix: "#f59e0b",
  name: "#10b981",
} as const;

export const DIAGRAM_MAX_SCHEMA_DEPTH = 2;

export const DIAGRAM_ER_HEADER_HEIGHT = 44;
export const DIAGRAM_ER_ROW_HEIGHT = 32;
// Max height of the scrollable fields section inside an ER node
export const DIAGRAM_ER_MAX_FIELDS_HEIGHT = 200;
