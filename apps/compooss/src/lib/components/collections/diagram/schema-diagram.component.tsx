"use client";

import "@xyflow/react/dist/style.css";

import { DiagramEmpty } from "@/lib/components/diagram/diagram-empty.component";
import { DiagramSkeleton } from "@/lib/components/diagram/diagram-skeleton.component";
import { SchemaFieldNode } from "@/lib/components/diagram/nodes/schema-field-node.component";
import { DIAGRAM_EDGE_COLORS, DIAGRAM_LAYOUT } from "@/lib/constants";
import { SCHEMA_QUERY_KEYS } from "@/lib/services/schema/schema-query.key";
import { useAnalyzeSchema } from "@/lib/services/schema/schema.service";
import type { DiagramEdge, SchemaNode } from "@/lib/types/diagram.type";
import {
  applyDagreLayout,
  buildSchemaEdges,
  buildSchemaNodes,
} from "@/lib/utils";
import type { SchemaAnalysisResult } from "@compooss/types";
import {
  Background,
  BackgroundVariant,
  Controls,
  MiniMap,
  ReactFlow,
  ReactFlowProvider,
  type NodeTypes,
} from "@xyflow/react";
import { useParams } from "next/navigation";
import { useMemo } from "react";
import { useQueryClient } from "@tanstack/react-query";

const SCHEMA_NODE_TYPES: NodeTypes = {
  schemaField: SchemaFieldNode,
};

export const SchemaDiagram: React.FC = () => {
  const { dbName, collectionName } =
    useParams<{ dbName: string; collectionName: string }>();
  const queryClient = useQueryClient();

  const cachedSchema = queryClient.getQueryData<SchemaAnalysisResult>(
    SCHEMA_QUERY_KEYS.all(dbName, collectionName),
  );

  const analyze = useAnalyzeSchema(dbName, collectionName);

  const { nodes, edges } = useMemo(() => {
    if (!cachedSchema?.fields.length) return { nodes: [], edges: [] };

    const rawNodes = buildSchemaNodes(cachedSchema.fields);
    const rawEdges = buildSchemaEdges(cachedSchema.fields);
    const layoutedNodes = applyDagreLayout<SchemaNode, DiagramEdge>(
      rawNodes,
      rawEdges,
      {
        ...DIAGRAM_LAYOUT.schema,
        nodeWidth: 200,
        nodeHeight: 44,
      },
    );

    const styledEdges = rawEdges.map((e) => ({
      ...e,
      style: {
        stroke: DIAGRAM_EDGE_COLORS.name,
        strokeWidth: 1.5,
        opacity: 0.6,
      },
    }));

    return { nodes: layoutedNodes, edges: styledEdges };
  }, [cachedSchema]);

  if (analyze.isPending) return <DiagramSkeleton />;

  if (!cachedSchema) {
    return (
      <DiagramEmpty
        title="Visualize schema structure"
        description="Run a schema analysis to see fields, types, and nesting as an interactive diagram."
        actionLabel="Analyze schema"
        onAction={() => analyze.mutate({})}
      />
    );
  }

  return (
    <div className="flex-1 relative h-full">
      <ReactFlowProvider>
        <ReactFlow<SchemaNode, DiagramEdge>
          nodes={nodes}
          edges={edges}
          nodeTypes={SCHEMA_NODE_TYPES}
          fitView
          fitViewOptions={{ padding: 0.25 }}
          minZoom={0.2}
          maxZoom={2}
          proOptions={{ hideAttribution: true }}
        >
          <Background variant={BackgroundVariant.Dots} gap={20} size={1} />
          <Controls />
          <MiniMap
            zoomable
            pannable
            className="!bg-card !border-border"
          />
        </ReactFlow>
      </ReactFlowProvider>
    </div>
  );
};
