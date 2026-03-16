"use client";

import type {
  AggregationResult,
  AggregationStage,
  SavedPipeline,
} from "@compooss/types";
import { useCallback, useMemo, useRef, useState } from "react";
import { useRunAggregation, useCreateView } from "@/lib/services/v2/aggregation/aggregation.service";
import { getTemplateForOperator } from "./stage-templates";
import { toast } from "sonner";

export interface PipelineSettings {
  previewLimit: number;
  sampleMode: boolean;
  sampleSize: number;
  maxTimeMS: number;
  allowDiskUse: boolean;
  autoPreview: boolean;
}

const DEFAULT_SETTINGS: PipelineSettings = {
  previewLimit: 20,
  sampleMode: false,
  sampleSize: 1000,
  maxTimeMS: 60000,
  allowDiskUse: true,
  autoPreview: false,
};

function generateId(): string {
  return Math.random().toString(36).slice(2, 11);
}

function createStage(operator: string): AggregationStage {
  const template = getTemplateForOperator(operator);
  return {
    id: generateId(),
    stageOperator: operator,
    value: template?.snippet ?? "{}",
    enabled: true,
    collapsed: false,
  };
}

function getStorageKey(namespace: string): string {
  return `compooss:pipelines:${namespace}`;
}

function loadSavedPipelines(namespace: string): SavedPipeline[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(getStorageKey(namespace));
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function persistSavedPipelines(namespace: string, pipelines: SavedPipeline[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(getStorageKey(namespace), JSON.stringify(pipelines));
}

function buildPipelineJson(stages: AggregationStage[]): Record<string, unknown>[] | null {
  const enabledStages = stages.filter((s) => s.enabled);
  const result: Record<string, unknown>[] = [];
  for (const stage of enabledStages) {
    try {
      const parsed = JSON.parse(stage.value);
      result.push({ [stage.stageOperator]: parsed });
    } catch {
      return null;
    }
  }
  return result;
}

export type PipelineMode = "builder" | "text";

export function useAggregationPipeline(dbName: string, collectionName: string) {
  const namespace = `${dbName}.${collectionName}`;

  const [stages, setStages] = useState<AggregationStage[]>([]);
  const [mode, setMode] = useState<PipelineMode>("builder");
  const [results, setResults] = useState<AggregationResult | null>(null);
  const [stageResults, setStageResults] = useState<
    Map<string, Record<string, unknown>[]>
  >(new Map());
  const [error, setError] = useState<string | null>(null);
  const [focusedStageId, setFocusedStageId] = useState<string | null>(null);
  const [settings, setSettings] = useState<PipelineSettings>(DEFAULT_SETTINGS);
  const [savedPipelines, setSavedPipelines] = useState<SavedPipeline[]>(() =>
    loadSavedPipelines(namespace),
  );

  const abortRef = useRef<AbortController | null>(null);

  const runAggregation = useRunAggregation(dbName, collectionName, {
    onSuccess: (data) => {
      setResults(data);
      setError(null);
    },
    onError: (err) => {
      setError(err.message);
    },
  });

  const createView = useCreateView(dbName, collectionName);

  const stageErrors = useMemo(() => {
    const errors = new Map<string, string>();
    for (const stage of stages) {
      if (!stage.enabled) continue;
      try {
        JSON.parse(stage.value);
      } catch (e) {
        errors.set(
          stage.id,
          e instanceof Error ? e.message : "Invalid JSON",
        );
      }
    }
    return errors;
  }, [stages]);

  const hasErrors = stageErrors.size > 0;

  const pipelineJson = useMemo(() => buildPipelineJson(stages), [stages]);

  const pipelineText = useMemo(() => {
    if (!pipelineJson) return "[]";
    return JSON.stringify(pipelineJson, null, 2);
  }, [pipelineJson]);

  const addStage = useCallback((operator: string, atIndex?: number) => {
    const stage = createStage(operator);
    setStages((prev) => {
      if (atIndex !== undefined && atIndex >= 0 && atIndex <= prev.length) {
        const next = [...prev];
        next.splice(atIndex, 0, stage);
        return next;
      }
      return [...prev, stage];
    });
    return stage.id;
  }, []);

  const removeStage = useCallback((id: string) => {
    setStages((prev) => prev.filter((s) => s.id !== id));
    setStageResults((prev) => {
      const next = new Map(prev);
      next.delete(id);
      return next;
    });
  }, []);

  const duplicateStage = useCallback((id: string) => {
    setStages((prev) => {
      const idx = prev.findIndex((s) => s.id === id);
      if (idx === -1) return prev;
      const clone: AggregationStage = {
        ...prev[idx],
        id: generateId(),
        collapsed: false,
      };
      const next = [...prev];
      next.splice(idx + 1, 0, clone);
      return next;
    });
  }, []);

  const updateStage = useCallback(
    (id: string, updates: Partial<Pick<AggregationStage, "stageOperator" | "value" | "enabled" | "collapsed">>) => {
      setStages((prev) =>
        prev.map((s) => (s.id === id ? { ...s, ...updates } : s)),
      );
    },
    [],
  );

  const toggleStage = useCallback((id: string) => {
    setStages((prev) =>
      prev.map((s) => (s.id === id ? { ...s, enabled: !s.enabled } : s)),
    );
  }, []);

  const reorderStages = useCallback((fromIndex: number, toIndex: number) => {
    setStages((prev) => {
      const next = [...prev];
      const [moved] = next.splice(fromIndex, 1);
      next.splice(toIndex, 0, moved);
      return next;
    });
  }, []);

  const clearPipeline = useCallback(() => {
    setStages([]);
    setResults(null);
    setStageResults(new Map());
    setError(null);
  }, []);

  const runPipeline = useCallback(() => {
    if (hasErrors || !pipelineJson) {
      setError("Fix JSON errors in stages before running.");
      return;
    }
    setError(null);
    runAggregation.mutate({
      pipeline: pipelineJson,
      options: {
        limit: settings.previewLimit,
        maxTimeMS: settings.maxTimeMS,
        allowDiskUse: settings.allowDiskUse,
        sampleSize: settings.sampleMode ? settings.sampleSize : undefined,
      },
    });
  }, [hasErrors, pipelineJson, runAggregation, settings]);

  const runPartialPipeline = useCallback(
    (upToStageId: string) => {
      const idx = stages.findIndex((s) => s.id === upToStageId);
      if (idx === -1) return;

      const enabledStages = stages.slice(0, idx + 1).filter((s) => s.enabled);
      const partialPipeline: Record<string, unknown>[] = [];
      for (const stage of enabledStages) {
        try {
          const parsed = JSON.parse(stage.value);
          partialPipeline.push({ [stage.stageOperator]: parsed });
        } catch {
          toast.error("Fix JSON errors before running.");
          return;
        }
      }

      runAggregation.mutate(
        {
          pipeline: partialPipeline,
          options: {
            limit: settings.previewLimit,
            maxTimeMS: settings.maxTimeMS,
            allowDiskUse: settings.allowDiskUse,
            sampleSize: settings.sampleMode ? settings.sampleSize : undefined,
          },
        },
        {
          onSuccess: (data) => {
            setStageResults((prev) => {
              const next = new Map(prev);
              next.set(upToStageId, data.documents);
              return next;
            });
          },
        },
      );
    },
    [stages, runAggregation, settings],
  );

  const stopPipeline = useCallback(() => {
    abortRef.current?.abort();
    abortRef.current = null;
  }, []);

  const savePipeline = useCallback(
    (name: string) => {
      const pipeline: SavedPipeline = {
        id: generateId(),
        name,
        namespace,
        stages: [...stages],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        isFavorite: false,
      };
      const updated = [...savedPipelines, pipeline];
      setSavedPipelines(updated);
      persistSavedPipelines(namespace, updated);
      toast.success(`Pipeline "${name}" saved.`);
      return pipeline.id;
    },
    [stages, namespace, savedPipelines],
  );

  const loadPipeline = useCallback(
    (id: string) => {
      const pipeline = savedPipelines.find((p) => p.id === id);
      if (!pipeline) return;
      setStages(pipeline.stages.map((s) => ({ ...s, id: generateId() })));
      setResults(null);
      setStageResults(new Map());
      setError(null);
      toast.success(`Pipeline "${pipeline.name}" loaded.`);
    },
    [savedPipelines],
  );

  const deleteSavedPipeline = useCallback(
    (id: string) => {
      const updated = savedPipelines.filter((p) => p.id !== id);
      setSavedPipelines(updated);
      persistSavedPipelines(namespace, updated);
    },
    [savedPipelines, namespace],
  );

  const toggleFavorite = useCallback(
    (id: string) => {
      const updated = savedPipelines.map((p) =>
        p.id === id ? { ...p, isFavorite: !p.isFavorite } : p,
      );
      setSavedPipelines(updated);
      persistSavedPipelines(namespace, updated);
    },
    [savedPipelines, namespace],
  );

  const exportPipelineJson = useCallback(() => {
    if (!pipelineJson) return "";
    return JSON.stringify(pipelineJson, null, 2);
  }, [pipelineJson]);

  const copyForBackendCode = useCallback(() => {
    if (!pipelineJson) return "";
    const lines = pipelineJson.map((s) => `  ${JSON.stringify(s)}`).join(",\n");
    return `db.${collectionName}.aggregate([\n${lines}\n])`;
  }, [pipelineJson, collectionName]);

  const importFromText = useCallback((text: string) => {
    try {
      const parsed = JSON.parse(text);
      if (!Array.isArray(parsed)) {
        setError("Pipeline must be a JSON array.");
        return false;
      }
      const newStages: AggregationStage[] = parsed.map((stageObj: Record<string, unknown>) => {
        const operator = Object.keys(stageObj)[0] ?? "$match";
        const body = stageObj[operator];
        return {
          id: generateId(),
          stageOperator: operator,
          value: JSON.stringify(body, null, 2),
          enabled: true,
          collapsed: false,
        };
      });
      setStages(newStages);
      setResults(null);
      setStageResults(new Map());
      setError(null);
      return true;
    } catch (e) {
      setError(e instanceof Error ? e.message : "Invalid JSON");
      return false;
    }
  }, []);

  const handleCreateView = useCallback(
    (viewName: string) => {
      if (!pipelineJson) {
        toast.error("Fix pipeline errors first.");
        return;
      }
      createView.mutate({ viewName, pipeline: pipelineJson });
    },
    [pipelineJson, createView],
  );

  return {
    stages,
    mode,
    setMode,
    results,
    stageResults,
    error,
    setError,
    stageErrors,
    hasErrors,
    focusedStageId,
    setFocusedStageId,
    settings,
    setSettings,
    pipelineJson,
    pipelineText,

    addStage,
    removeStage,
    duplicateStage,
    updateStage,
    toggleStage,
    reorderStages,
    clearPipeline,

    runPipeline,
    runPartialPipeline,
    stopPipeline,
    isRunning: runAggregation.isPending,

    savedPipelines,
    savePipeline,
    loadPipeline,
    deleteSavedPipeline,
    toggleFavorite,

    exportPipelineJson,
    copyForBackendCode,
    importFromText,
    handleCreateView,
    isCreatingView: createView.isPending,
  };
}

export type UseAggregationPipeline = ReturnType<typeof useAggregationPipeline>;
