"use client";

import { apiClient } from "@/lib/config/api.config";
import { ENDPOINTS } from "@/lib/constants";
import { useGetCollections } from "@/lib/services/collections/collection.service";
import type { DiagramEdge, ERNode } from "@/lib/types/diagram.type";
import {
  applyDagreLayout,
  buildERNodes,
  inferRelationships,
} from "@/lib/utils";
import { DIAGRAM_LAYOUT } from "@/lib/constants";
import type { ApiResponse, SchemaAnalysisResult } from "@compooss/types";
import { useQueries } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { DIAGRAM_QUERY_KEYS } from "./diagram-query.key";

export const useERDiagramData = (db: string) => {
  const [analyzeTriggered, setAnalyzeTriggered] = useState(false);

  const { data: collections = [], isLoading: collectionsLoading } =
    useGetCollections(db);

  const schemaQueries = useQueries({
    queries: collections.map((col) => ({
      queryKey: DIAGRAM_QUERY_KEYS.schemaForDiagram(db, col.name),
      queryFn: async () => {
        const res = await apiClient.post<ApiResponse<SchemaAnalysisResult>>(
          ENDPOINTS.schema.root(db, col.name),
          { sampleSize: 500 },
        );
        return res.data;
      },
      enabled: analyzeTriggered && !!db && !!col.name,
      staleTime: 5 * 60 * 1000,
    })),
  });

  const isAnalyzing =
    analyzeTriggered && schemaQueries.some((q) => q.isPending || q.isFetching);

  const schemas = useMemo(() => {
    const map = new Map<string, SchemaAnalysisResult>();
    schemaQueries.forEach((q, i) => {
      const col = collections[i];
      if (q.data && col) map.set(col.name, q.data);
    });
    return map;
  }, [schemaQueries, collections]);

  const { erNodes, erEdges } = useMemo(() => {
    if (!collections.length) return { erNodes: [], erEdges: [] };

    const baseNodes = buildERNodes(collections, schemas);

    const edges: DiagramEdge[] = analyzeTriggered
      ? inferRelationships(collections, schemas)
      : [];

    const layoutedNodes = applyDagreLayout<ERNode, DiagramEdge>(
      baseNodes,
      edges,
      DIAGRAM_LAYOUT.er,
    );

    return { erNodes: layoutedNodes, erEdges: edges };
  }, [collections, schemas, analyzeTriggered]);

  const analyzeAll = () => setAnalyzeTriggered(true);

  return {
    collections,
    erNodes,
    erEdges,
    isLoading: collectionsLoading,
    isAnalyzing,
    analyzeTriggered,
    analyzeAll,
  };
};
