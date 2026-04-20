"use client";

import "@xyflow/react/dist/style.css";

import { DiagramEmpty } from "@/lib/components/diagram/diagram-empty.component";
import { DiagramSkeleton } from "@/lib/components/diagram/diagram-skeleton.component";
import { ERCollectionNode } from "@/lib/components/diagram/nodes/er-collection-node.component";
import { DIAGRAM_EDGE_COLORS } from "@/lib/constants";
import { useERDiagramData } from "@/lib/services/diagram/diagram.service";
import type { DiagramEdge, ERNode } from "@/lib/types/diagram.type";
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
import { ERDiagramToolbar } from "./er-diagram-toolbar.component";

const ER_NODE_TYPES: NodeTypes = {
  erCollection: ERCollectionNode,
};

const edgeStyle = (edge: DiagramEdge) => ({
  stroke: DIAGRAM_EDGE_COLORS[edge.data?.confidence ?? "name"],
  strokeWidth: 2,
});

export const ERDiagram: React.FC = () => {
  const { dbName } = useParams<{ dbName: string }>();
  const {
    collections,
    erNodes,
    erEdges,
    isLoading,
    isAnalyzing,
    analyzeTriggered,
    analyzeAll,
  } = useERDiagramData(dbName);

  const styledEdges = useMemo(
    () => erEdges.map((edge) => ({ ...edge, style: edgeStyle(edge as DiagramEdge) })),
    [erEdges],
  );

  if (isLoading) return <DiagramSkeleton />;

  if (!analyzeTriggered) {
    return (
      <div className="flex flex-col flex-1 h-full overflow-hidden">
        <ERDiagramToolbar
          collectionCount={collections.length}
          isAnalyzing={false}
          analyzeTriggered={false}
          onAnalyzeAll={analyzeAll}
        />
        <DiagramEmpty
          title="Visualize collection relationships"
          description="Analyze schemas to detect ObjectId references and field name matches between collections."
          actionLabel="Analyze relationships"
          onAction={analyzeAll}
        />
      </div>
    );
  }

  return (
    <div className="flex flex-col flex-1 h-full overflow-hidden">
      <ERDiagramToolbar
        collectionCount={collections.length}
        isAnalyzing={isAnalyzing}
        analyzeTriggered={analyzeTriggered}
        onAnalyzeAll={analyzeAll}
      />
      {isAnalyzing ? (
        <DiagramSkeleton />
      ) : (
        // ReactFlow is unmounted while isAnalyzing=true (DiagramSkeleton shows),
        // so it remounts fresh after each analysis run. Using defaultNodes/
        // defaultEdges (uncontrolled) means React Flow owns position state
        // internally — dragging works without any useEffect/setState sync.
        <div className="flex-1 relative">
          <ReactFlowProvider>
            <ReactFlow<ERNode, DiagramEdge>
              defaultNodes={erNodes}
              defaultEdges={styledEdges}
              nodeTypes={ER_NODE_TYPES}
              fitView
              fitViewOptions={{ padding: 0.25, maxZoom: 0.85 }}
              minZoom={0.1}
              maxZoom={2}
              proOptions={{ hideAttribution: true }}
            >
              <Background variant={BackgroundVariant.Dots} gap={20} size={1} />
              <Controls />
              <MiniMap nodeStrokeWidth={3} zoomable pannable />
            </ReactFlow>
          </ReactFlowProvider>
        </div>
      )}
    </div>
  );
};
