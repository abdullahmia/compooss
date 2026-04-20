import type { Collection, SchemaAnalysisResult, SchemaField } from "@compooss/types";
import type { DiagramEdge, ERNode, SchemaNode } from "@/lib/types/diagram.type";
import {
  DIAGRAM_ER_HEADER_HEIGHT,
  DIAGRAM_ER_MAX_FIELDS_HEIGHT,
  DIAGRAM_ER_ROW_HEIGHT,
  DIAGRAM_MAX_SCHEMA_DEPTH,
  DIAGRAM_NODE_SIZE,
} from "@/lib/constants";

function countVisibleRows(fields: SchemaField[]): number {
  // Children start collapsed, so only top-level fields contribute to initial height
  return fields.length;
}

export function buildERNodes(
  collections: Collection[],
  schemas?: Map<string, SchemaAnalysisResult>,
): ERNode[] {
  return collections.map((col) => {
    const schema = schemas?.get(col.name);
    const fields = schema?.fields ?? [];
    const rows = countVisibleRows(fields);
    const rawHeight = DIAGRAM_ER_HEADER_HEIGHT + rows * DIAGRAM_ER_ROW_HEIGHT + (rows > 0 ? 8 : 0);
    const height = Math.min(rawHeight, DIAGRAM_ER_HEADER_HEIGHT + DIAGRAM_ER_MAX_FIELDS_HEIGHT + 8);

    return {
      id: col.name,
      type: "erCollection" as const,
      position: { x: 0, y: 0 },
      data: {
        label: col.name,
        docCount: col.documentCount,
        isAnalyzed: !!schema,
        fields,
      },
      width: DIAGRAM_NODE_SIZE.entityWidth,
      height: schema ? height : DIAGRAM_NODE_SIZE.entityHeight,
    };
  });
}

export function buildSchemaNodes(
  fields: SchemaField[],
  parentId?: string,
  currentDepth = 0,
): SchemaNode[] {
  if (currentDepth >= DIAGRAM_MAX_SCHEMA_DEPTH) return [];

  const nodes: SchemaNode[] = [];

  for (const field of fields) {
    nodes.push({
      id: field.path,
      type: "schemaField" as const,
      position: { x: 0, y: 0 },
      parentId,
      data: {
        name: field.name,
        types: field.types,
        frequency: field.frequency,
        hasMultipleTypes: field.hasMultipleTypes,
        depth: field.depth,
      },
      width: DIAGRAM_NODE_SIZE.fieldWidth,
      height: DIAGRAM_NODE_SIZE.fieldHeight,
    });

    if (field.children && field.children.length > 0) {
      nodes.push(
        ...buildSchemaNodes(field.children, field.path, currentDepth + 1),
      );
    }
  }

  return nodes;
}

export function buildSchemaEdges(
  fields: SchemaField[],
  parentPath?: string,
): DiagramEdge[] {
  const edges: DiagramEdge[] = [];

  for (const field of fields) {
    if (parentPath) {
      edges.push({
        id: `${parentPath}→${field.path}`,
        source: parentPath,
        target: field.path,
        data: { confidence: "name" },
        style: { strokeWidth: 1.5 },
      });
    }

    if (field.children && field.children.length > 0) {
      edges.push(...buildSchemaEdges(field.children, field.path));
    }
  }

  return edges;
}

function singularize(name: string): string {
  if (name.endsWith("ies")) return name.slice(0, -3) + "y";
  if (name.endsWith("ses") || name.endsWith("xes") || name.endsWith("zes"))
    return name.slice(0, -2);
  if (name.endsWith("s") && name.length > 3) return name.slice(0, -1);
  return name;
}

function pluralize(name: string): string {
  if (name.endsWith("y")) return name.slice(0, -1) + "ies";
  if (
    name.endsWith("s") ||
    name.endsWith("x") ||
    name.endsWith("z") ||
    name.endsWith("sh") ||
    name.endsWith("ch")
  )
    return name + "es";
  return name + "s";
}

function matchCollection(
  candidate: string,
  collectionNames: Set<string>,
): string | null {
  const lower = candidate.toLowerCase();
  if (collectionNames.has(lower)) return lower;
  const plural = pluralize(lower);
  if (collectionNames.has(plural)) return plural;
  const singular = singularize(lower);
  if (collectionNames.has(singular)) return singular;
  return null;
}

export function inferRelationships(
  collections: Collection[],
  schemas: Map<string, SchemaAnalysisResult>,
): DiagramEdge[] {
  const collectionNames = new Set(collections.map((c) => c.name.toLowerCase()));
  const seen = new Set<string>();
  const edges: DiagramEdge[] = [];

  for (const col of collections) {
    const schema = schemas.get(col.name);
    if (!schema) continue;

    for (const field of schema.fields) {
      if (field.name === "_id") continue;

      let candidate: string | null = null;
      let confidence: NonNullable<DiagramEdge["data"]>["confidence"] = "suffix";

      const hasObjectId = field.types.some((t) => t.type === "ObjectId");
      const hasArrayOfObjectId =
        field.types.some((t) => t.type === "Array") &&
        (field.children ?? []).some((c) =>
          c.types.some((t) => t.type === "ObjectId"),
        );

      if (hasObjectId || hasArrayOfObjectId) {
        confidence = "objectid";
        const stripped = field.name
          .replace(/_?[Ii][Dd]s?$/, "")
          .replace(/_?[Ii][Dd]$/, "")
          .trim();
        if (stripped) candidate = matchCollection(stripped, collectionNames);
      }

      if (!candidate) {
        confidence = "name";
        candidate = matchCollection(field.name, collectionNames);
      }

      if (!candidate) {
        confidence = "suffix";
        const stripped = field.name.replace(/[_-]?(id|ref|key)s?$/i, "").trim();
        if (stripped && stripped !== field.name) {
          candidate = matchCollection(stripped, collectionNames);
        }
      }

      if (!candidate || candidate === col.name.toLowerCase()) continue;

      const targetCol = collections.find(
        (c) => c.name.toLowerCase() === candidate,
      );
      if (!targetCol) continue;

      const edgeKey = `${col.name}→${targetCol.name}`;
      if (seen.has(edgeKey)) continue;
      seen.add(edgeKey);

      edges.push({
        id: edgeKey,
        source: col.name,
        target: targetCol.name,
        label: field.name,
        data: { confidence },
        animated: false,
        style: { strokeWidth: 2 },
      });
    }
  }

  return edges;
}
