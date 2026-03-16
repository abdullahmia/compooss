"use client";

import {
  EmptyState,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
} from "@compooss/ui";
import {
  closestCenter,
  DndContext,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { BarChart3, Layers, Plus, Wand2 } from "lucide-react";
import { useCallback, useState } from "react";
import { StageCard } from "./stage-card";
import {
  STAGE_CATEGORIES,
  STAGE_TEMPLATES,
} from "./stage-templates";
import type { UseAggregationPipeline } from "./use-aggregation-pipeline";

interface PipelineBuilderProps {
  pipeline: UseAggregationPipeline;
  onOpenWizard: () => void;
}

export function PipelineBuilder({ pipeline, onOpenWizard }: PipelineBuilderProps) {
  const [showAddMenu, setShowAddMenu] = useState(false);
  const [filterCategory, setFilterCategory] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event;
      if (!over || active.id === over.id) return;
      const oldIndex = pipeline.stages.findIndex((s) => s.id === active.id);
      const newIndex = pipeline.stages.findIndex((s) => s.id === over.id);
      if (oldIndex !== -1 && newIndex !== -1) {
        pipeline.reorderStages(oldIndex, newIndex);
      }
    },
    [pipeline],
  );

  const handleAddStage = useCallback(
    (operator: string) => {
      pipeline.addStage(operator);
      setShowAddMenu(false);
      setFilterCategory(null);
    },
    [pipeline],
  );

  const handleCloseMenu = useCallback(() => {
    setShowAddMenu(false);
    setFilterCategory(null);
  }, []);

  const filteredTemplates = filterCategory
    ? STAGE_TEMPLATES.filter((t) => t.category === filterCategory)
    : STAGE_TEMPLATES;

  if (pipeline.stages.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center min-h-[300px]">
        <EmptyState
          icon={<BarChart3 className="h-12 w-12 text-muted-foreground" />}
          title="No aggregation stages"
          description="Start building your pipeline by adding a stage."
          primaryAction={{
            label: "Add Stage",
            onClick: () => setShowAddMenu(true),
          }}
          secondaryAction={{
            label: "Use Wizard",
            onClick: onOpenWizard,
          }}
        />
        <AddStageModal
          open={showAddMenu}
          templates={filteredTemplates}
          filterCategory={filterCategory}
          onFilterCategory={setFilterCategory}
          onSelect={handleAddStage}
          onClose={handleCloseMenu}
        />
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto scrollbar-thin p-4 space-y-3">
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={pipeline.stages.map((s) => s.id)}
          strategy={verticalListSortingStrategy}
        >
          {pipeline.stages.map((stage, idx) => (
            <StageCard
              key={stage.id}
              stage={stage}
              index={idx}
              error={pipeline.stageErrors.get(stage.id)}
              previewDocs={pipeline.stageResults.get(stage.id)}
              onUpdate={pipeline.updateStage}
              onRemove={pipeline.removeStage}
              onDuplicate={pipeline.duplicateStage}
              onToggle={pipeline.toggleStage}
              onFocus={(id) => pipeline.setFocusedStageId(id)}
              onRunPartial={pipeline.runPartialPipeline}
            />
          ))}
        </SortableContext>
      </DndContext>

      {/* Add stage bar */}
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => setShowAddMenu(true)}
          className="flex items-center gap-2 px-3 py-2 rounded-lg border border-dashed border-border text-muted-foreground hover:border-primary hover:text-primary transition-colors text-xs"
        >
          <Plus className="h-3.5 w-3.5" />
          Add Stage
        </button>
        <button
          type="button"
          onClick={onOpenWizard}
          className="flex items-center gap-2 px-3 py-2 rounded-lg border border-dashed border-border text-muted-foreground hover:border-primary hover:text-primary transition-colors text-xs"
        >
          <Wand2 className="h-3.5 w-3.5" />
          Stage Wizard
        </button>
      </div>

      <AddStageModal
        open={showAddMenu}
        templates={filteredTemplates}
        filterCategory={filterCategory}
        onFilterCategory={setFilterCategory}
        onSelect={handleAddStage}
        onClose={handleCloseMenu}
      />
    </div>
  );
}

function AddStageModal({
  open,
  templates,
  filterCategory,
  onFilterCategory,
  onSelect,
  onClose,
}: {
  open: boolean;
  templates: typeof STAGE_TEMPLATES;
  filterCategory: string | null;
  onFilterCategory: (cat: string | null) => void;
  onSelect: (operator: string) => void;
  onClose: () => void;
}) {
  return (
    <Modal open={open} onClose={onClose}>
      <ModalContent size="lg">
        <ModalHeader
          icon={<Layers className="h-4 w-4" />}
          title="Add Aggregation Stage"
          onClose={onClose}
        />

        {/* Category filter tabs */}
        <div className="flex items-center gap-1.5 px-5 py-2.5 border-b border-border overflow-x-auto scrollbar-thin">
          <button
            type="button"
            onClick={() => onFilterCategory(null)}
            className={`px-3 py-1.5 rounded-md text-xs whitespace-nowrap transition-colors ${
              filterCategory === null
                ? "bg-primary text-primary-foreground"
                : "bg-muted/50 text-muted-foreground hover:bg-muted"
            }`}
          >
            All
          </button>
          {STAGE_CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => onFilterCategory(cat.id)}
              className={`px-3 py-1.5 rounded-md text-xs whitespace-nowrap transition-colors ${
                filterCategory === cat.id
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted/50 text-muted-foreground hover:bg-muted"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        <ModalBody className="!p-0">
          <div className="max-h-[400px] overflow-y-auto scrollbar-thin">
            <div className="grid grid-cols-1 gap-px bg-border/30">
              {templates.map((t) => (
                <button
                  key={t.operator}
                  type="button"
                  onClick={() => onSelect(t.operator)}
                  className="w-full text-left px-5 py-3 hover:bg-muted/50 transition-colors bg-card"
                >
                  <span className="text-sm font-mono font-medium text-foreground">
                    {t.operator}
                  </span>
                  <p className="text-xs text-muted-foreground mt-0.5 leading-snug">
                    {t.description}
                  </p>
                </button>
              ))}
            </div>
          </div>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
