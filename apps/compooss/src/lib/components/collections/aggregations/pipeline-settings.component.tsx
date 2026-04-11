"use client";

import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Toggle,
  Input,
} from "@compooss/ui";
import { Settings } from "lucide-react";
import { useCallback, useState } from "react";
import type { PipelineSettings } from "@/lib/components/collections/aggregations/use-aggregation-pipeline";

type Props = {
  open: boolean;
  settings: PipelineSettings;
  onClose: () => void;
  onApply: (settings: PipelineSettings) => void;
};

const PREVIEW_LIMITS = [10, 20, 50, 100, 200] as const;

export const PipelineSettingsModal: React.FC<Props> = ({
  open,
  settings,
  onClose,
  onApply,
}) => {
  const [local, setLocal] = useState<PipelineSettings>(settings);

  const handleApply = useCallback(() => {
    onApply(local);
    onClose();
  }, [local, onApply, onClose]);

  const update = <K extends keyof PipelineSettings>(
    key: K,
    value: PipelineSettings[K],
  ) => {
    setLocal((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <Modal open={open} onClose={onClose}>
      <ModalContent size="md">
        <ModalHeader
          icon={<Settings className="h-4 w-4" />}
          title="Pipeline Settings"
          onClose={onClose}
        />
        <ModalBody>
          <div className="space-y-5">
            <div>
              <label className="text-xs text-muted-foreground mb-1.5 block">
                Preview Document Limit
              </label>
              <select
                value={local.previewLimit}
                onChange={(e) => update("previewLimit", Number(e.target.value))}
                className="h-8 w-full rounded border border-border bg-background px-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              >
                {PREVIEW_LIMITS.map((n) => (
                  <option key={n} value={n}>
                    {n} documents
                  </option>
                ))}
              </select>
              <p className="text-[11px] text-muted-foreground mt-1">
                Maximum number of documents returned in previews and results.
              </p>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label className="text-xs text-muted-foreground">
                  Sampling Mode
                </label>
                <Toggle
                  size="sm"
                  checked={local.sampleMode}
                  onChange={(v: boolean) => update("sampleMode", v)}
                />
              </div>
              <p className="text-[11px] text-muted-foreground mt-1">
                Use $sample to randomly select documents before running the pipeline.
                Useful for large collections.
              </p>
              {local.sampleMode && (
                <div className="mt-2">
                  <label className="text-[11px] text-muted-foreground mb-1 block">
                    Sample Size
                  </label>
                  <Input
                    variant="mono"
                    type="number"
                    value={local.sampleSize}
                    onChange={(e) =>
                      update("sampleSize", Math.max(1, Number(e.target.value) || 1000))
                    }
                    min={1}
                  />
                </div>
              )}
            </div>

            <div>
              <label className="text-xs text-muted-foreground mb-1.5 block">
                Max Execution Time (ms)
              </label>
              <Input
                variant="mono"
                type="number"
                value={local.maxTimeMS}
                onChange={(e) =>
                  update("maxTimeMS", Math.max(1000, Number(e.target.value) || 60000))
                }
                min={1000}
                step={1000}
              />
              <p className="text-[11px] text-muted-foreground mt-1">
                Maximum time allowed for the aggregation to run before timing out.
              </p>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label className="text-xs text-muted-foreground">
                  Allow Disk Use
                </label>
                <Toggle
                  size="sm"
                  checked={local.allowDiskUse}
                  onChange={(v: boolean) => update("allowDiskUse", v)}
                />
              </div>
              <p className="text-[11px] text-muted-foreground mt-1">
                Allow stages to write temporary data to disk when they exceed the
                100MB memory limit.
              </p>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label className="text-xs text-muted-foreground">
                  Auto Preview
                </label>
                <Toggle
                  size="sm"
                  checked={local.autoPreview}
                  onChange={(v: boolean) => update("autoPreview", v)}
                />
              </div>
              <p className="text-[11px] text-muted-foreground mt-1">
                Automatically run stage previews when editing pipeline stages.
              </p>
            </div>
          </div>
        </ModalBody>
        <ModalFooter>
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleApply}>
            Apply Settings
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
