import type { Edge, Node } from "@xyflow/react";
import type { FieldTypeInfo, SchemaField } from "@compooss/types";

export type ERNodeData = {
  label: string;
  docCount: number;
  isAnalyzed: boolean;
  fields: SchemaField[];
};

export type SchemaNodeData = {
  name: string;
  types: FieldTypeInfo[];
  frequency: number;
  hasMultipleTypes: boolean;
  depth: number;
};

export type DiagramEdgeData = {
  confidence: "objectid" | "suffix" | "name";
};

export type ERNode = Node<ERNodeData, "erCollection">;
export type SchemaNode = Node<SchemaNodeData, "schemaField">;
export type DiagramEdge = Edge<DiagramEdgeData>;
