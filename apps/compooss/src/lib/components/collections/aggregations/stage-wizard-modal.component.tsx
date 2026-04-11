"use client";

import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Checkbox,
  IconButton,
  Input,
} from "@compooss/ui";
import { Plus, Trash2, Wand2 } from "lucide-react";
import { useCallback, useState } from "react";

type Props = {
  open: boolean;
  onClose: () => void;
  onAddStage: (operator: string, value: string) => void;
};

type WizardStep = "select" | "configure";

const WIZARD_STAGES = [
  { operator: "$match", label: "$match", description: "Filter documents" },
  { operator: "$group", label: "$group", description: "Group and aggregate" },
  { operator: "$project", label: "$project", description: "Shape output fields" },
  { operator: "$sort", label: "$sort", description: "Order documents" },
  { operator: "$lookup", label: "$lookup", description: "Join collections" },
  { operator: "$unwind", label: "$unwind", description: "Flatten arrays" },
] as const;

type MatchRow = { field: string; op: string; value: string };
type GroupAccumulator = { field: string; accumulator: string; expression: string };
type SortField = { field: string; direction: "1" | "-1" };
type ProjectField = { field: string; include: boolean };

const MATCH_OPERATORS = [
  { value: "$eq", label: "equals" },
  { value: "$ne", label: "not equal" },
  { value: "$gt", label: "greater than" },
  { value: "$gte", label: "greater or equal" },
  { value: "$lt", label: "less than" },
  { value: "$lte", label: "less or equal" },
  { value: "$in", label: "in array" },
  { value: "$regex", label: "matches regex" },
  { value: "$exists", label: "exists" },
];

const GROUP_ACCUMULATORS = [
  { value: "$sum", label: "$sum" },
  { value: "$avg", label: "$avg" },
  { value: "$min", label: "$min" },
  { value: "$max", label: "$max" },
  { value: "$first", label: "$first" },
  { value: "$last", label: "$last" },
  { value: "$push", label: "$push" },
  { value: "$addToSet", label: "$addToSet" },
  { value: "$count", label: "$count" },
];


export const StageWizardModal: React.FC<Props> = ({
  open,
  onClose,
  onAddStage,
}) => {
  const [step, setStep] = useState<WizardStep>("select");
  const [selectedOp, setSelectedOp] = useState<string>("$match");

  const [matchRows, setMatchRows] = useState<MatchRow[]>([
    { field: "", op: "$eq", value: "" },
  ]);

  const [groupId, setGroupId] = useState("$field");
  const [groupAccumulators, setGroupAccumulators] = useState<GroupAccumulator[]>([
    { field: "count", accumulator: "$sum", expression: "1" },
  ]);

  const [projectFields, setProjectFields] = useState<ProjectField[]>([
    { field: "_id", include: true },
  ]);

  const [sortFields, setSortFields] = useState<SortField[]>([
    { field: "", direction: "-1" },
  ]);

  const [lookupFrom, setLookupFrom] = useState("");
  const [lookupLocalField, setLookupLocalField] = useState("");
  const [lookupForeignField, setLookupForeignField] = useState("_id");
  const [lookupAs, setLookupAs] = useState("joined");

  const [unwindPath, setUnwindPath] = useState("$arrayField");
  const [unwindPreserve, setUnwindPreserve] = useState(false);

  const resetForm = useCallback(() => {
    setStep("select");
    setMatchRows([{ field: "", op: "$eq", value: "" }]);
    setGroupId("$field");
    setGroupAccumulators([{ field: "count", accumulator: "$sum", expression: "1" }]);
    setProjectFields([{ field: "_id", include: true }]);
    setSortFields([{ field: "", direction: "-1" }]);
    setLookupFrom("");
    setLookupLocalField("");
    setLookupForeignField("_id");
    setLookupAs("joined");
    setUnwindPath("$arrayField");
    setUnwindPreserve(false);
  }, []);

  const handleClose = useCallback(() => {
    resetForm();
    onClose();
  }, [onClose, resetForm]);

  const handleSelectOp = useCallback((op: string) => {
    setSelectedOp(op);
    setStep("configure");
  }, []);

  const buildStageValue = useCallback((): string => {
    switch (selectedOp) {
      case "$match": {
        const obj: Record<string, unknown> = {};
        for (const row of matchRows) {
          if (!row.field) continue;
          if (row.op === "$eq") {
            obj[row.field] = tryParseValue(row.value);
          } else {
            obj[row.field] = { [row.op]: tryParseValue(row.value) };
          }
        }
        return JSON.stringify(obj, null, 2);
      }
      case "$group": {
        const obj: Record<string, unknown> = { _id: groupId.startsWith("$") ? groupId : `$${groupId}` };
        for (const acc of groupAccumulators) {
          if (!acc.field) continue;
          if (acc.accumulator === "$count") {
            obj[acc.field] = { $sum: 1 };
          } else {
            obj[acc.field] = { [acc.accumulator]: tryParseValue(acc.expression) };
          }
        }
        return JSON.stringify(obj, null, 2);
      }
      case "$project": {
        const obj: Record<string, unknown> = {};
        for (const pf of projectFields) {
          if (!pf.field) continue;
          obj[pf.field] = pf.include ? 1 : 0;
        }
        return JSON.stringify(obj, null, 2);
      }
      case "$sort": {
        const obj: Record<string, unknown> = {};
        for (const sf of sortFields) {
          if (!sf.field) continue;
          obj[sf.field] = Number(sf.direction);
        }
        return JSON.stringify(obj, null, 2);
      }
      case "$lookup": {
        return JSON.stringify(
          {
            from: lookupFrom,
            localField: lookupLocalField,
            foreignField: lookupForeignField,
            as: lookupAs,
          },
          null,
          2,
        );
      }
      case "$unwind": {
        return JSON.stringify(
          {
            path: unwindPath.startsWith("$") ? unwindPath : `$${unwindPath}`,
            preserveNullAndEmptyArrays: unwindPreserve,
          },
          null,
          2,
        );
      }
      default:
        return "{}";
    }
  }, [
    selectedOp,
    matchRows,
    groupId,
    groupAccumulators,
    projectFields,
    sortFields,
    lookupFrom,
    lookupLocalField,
    lookupForeignField,
    lookupAs,
    unwindPath,
    unwindPreserve,
  ]);

  const handleCreate = useCallback(() => {
    const value = buildStageValue();
    onAddStage(selectedOp, value);
    handleClose();
  }, [buildStageValue, selectedOp, onAddStage, handleClose]);

  return (
    <Modal open={open} onClose={handleClose}>
      <ModalContent size="lg" className="max-h-[85vh] flex flex-col">
        <ModalHeader
          icon={<Wand2 className="h-4 w-4" />}
          title={
            step === "select"
              ? "Stage Wizard"
              : `Configure ${selectedOp}`
          }
          onClose={handleClose}
        />
        <ModalBody className="flex-1 overflow-y-auto">
          {step === "select" ? (
            <div className="grid grid-cols-2 gap-2">
              {WIZARD_STAGES.map((ws) => (
                <button
                  key={ws.operator}
                  type="button"
                  onClick={() => handleSelectOp(ws.operator)}
                  className="text-left rounded-lg border border-border px-4 py-3 hover:bg-muted/50 hover:border-primary transition-colors"
                >
                  <span className="text-sm font-mono font-medium text-foreground">
                    {ws.label}
                  </span>
                  <p className="text-[11px] text-muted-foreground mt-0.5">
                    {ws.description}
                  </p>
                </button>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {selectedOp === "$match" && (
                <MatchConfigurator rows={matchRows} onChange={setMatchRows} />
              )}
              {selectedOp === "$group" && (
                <GroupConfigurator
                  groupId={groupId}
                  onGroupIdChange={setGroupId}
                  accumulators={groupAccumulators}
                  onAccumulatorsChange={setGroupAccumulators}
                />
              )}
              {selectedOp === "$project" && (
                <ProjectConfigurator fields={projectFields} onChange={setProjectFields} />
              )}
              {selectedOp === "$sort" && (
                <SortConfigurator fields={sortFields} onChange={setSortFields} />
              )}
              {selectedOp === "$lookup" && (
                <LookupConfigurator
                  from={lookupFrom}
                  localField={lookupLocalField}
                  foreignField={lookupForeignField}
                  as={lookupAs}
                  onFromChange={setLookupFrom}
                  onLocalFieldChange={setLookupLocalField}
                  onForeignFieldChange={setLookupForeignField}
                  onAsChange={setLookupAs}
                />
              )}
              {selectedOp === "$unwind" && (
                <UnwindConfigurator
                  path={unwindPath}
                  preserve={unwindPreserve}
                  onPathChange={setUnwindPath}
                  onPreserveChange={setUnwindPreserve}
                />
              )}

              <div>
                <label className="text-xs text-muted-foreground mb-1.5 block">
                  Generated JSON Preview
                </label>
                <pre className="text-[11px] font-mono text-muted-foreground bg-background border border-border rounded-sm p-3 max-h-[160px] overflow-auto">
                  {`{ "${selectedOp}": ${buildStageValue()} }`}
                </pre>
              </div>
            </div>
          )}
        </ModalBody>
        {step === "configure" && (
          <ModalFooter>
            <Button variant="ghost" onClick={() => setStep("select")}>
              Back
            </Button>
            <Button variant="primary" onClick={handleCreate}>
              Add Stage
            </Button>
          </ModalFooter>
        )}
      </ModalContent>
    </Modal>
  );
};

function tryParseValue(val: string): unknown {
  if (val === "true") return true;
  if (val === "false") return false;
  if (val === "null") return null;
  const num = Number(val);
  if (!Number.isNaN(num) && val.trim() !== "") return num;
  if (val.startsWith("$")) return val;
  try {
    return JSON.parse(val);
  } catch {
    return val;
  }
}

function MatchConfigurator({
  rows,
  onChange,
}: {
  rows: MatchRow[];
  onChange: (rows: MatchRow[]) => void;
}) {
  const addRow = () => onChange([...rows, { field: "", op: "$eq", value: "" }]);
  const removeRow = (i: number) => onChange(rows.filter((_, idx) => idx !== i));
  const updateRow = (i: number, patch: Partial<MatchRow>) =>
    onChange(rows.map((r, idx) => (idx === i ? { ...r, ...patch } : r)));

  return (
    <div className="space-y-3">
      <label className="text-xs text-muted-foreground">Conditions</label>
      {rows.map((row, i) => (
        <div key={i} className="flex items-center gap-2">
          <Input
            variant="mono"
            className="flex-1 w-auto"
            placeholder="field"
            value={row.field}
            onChange={(e) => updateRow(i, { field: e.target.value })}
          />
          <select
            value={row.op}
            onChange={(e) => updateRow(i, { op: e.target.value })}
            className="h-8 rounded border border-border bg-background px-2 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
          >
            {MATCH_OPERATORS.map((op) => (
              <option key={op.value} value={op.value}>
                {op.label}
              </option>
            ))}
          </select>
          <Input
            variant="mono"
            className="flex-1 w-auto"
            placeholder="value"
            value={row.value}
            onChange={(e) => updateRow(i, { value: e.target.value })}
          />
          <IconButton
            variant="danger"
            size="sm"
            icon={<Trash2 className="h-3 w-3" />}
            label="Remove"
            onClick={() => removeRow(i)}
            disabled={rows.length <= 1}
          />
        </div>
      ))}
      <Button
        variant="ghost"
        size="sm"
        icon={<Plus className="h-3 w-3" />}
        onClick={addRow}
        className="px-0 hover:underline"
      >
        Add condition
      </Button>
    </div>
  );
}

function GroupConfigurator({
  groupId,
  onGroupIdChange,
  accumulators,
  onAccumulatorsChange,
}: {
  groupId: string;
  onGroupIdChange: (v: string) => void;
  accumulators: GroupAccumulator[];
  onAccumulatorsChange: (a: GroupAccumulator[]) => void;
}) {
  const addAcc = () =>
    onAccumulatorsChange([
      ...accumulators,
      { field: "", accumulator: "$sum", expression: "1" },
    ]);
  const removeAcc = (i: number) =>
    onAccumulatorsChange(accumulators.filter((_, idx) => idx !== i));
  const updateAcc = (i: number, patch: Partial<GroupAccumulator>) =>
    onAccumulatorsChange(
      accumulators.map((a, idx) => (idx === i ? { ...a, ...patch } : a)),
    );

  return (
    <div className="space-y-4">
      <div>
        <label className="text-xs text-muted-foreground mb-1.5 block">
          Group By (_id)
        </label>
        <Input
          variant="mono"
          value={groupId}
          onChange={(e) => onGroupIdChange(e.target.value)}
          placeholder="$field or null"
        />
      </div>
      <div className="space-y-3">
        <label className="text-xs text-muted-foreground">Accumulators</label>
        {accumulators.map((acc, i) => (
          <div key={i} className="flex items-center gap-2">
            <Input
              variant="mono"
              className="flex-1 w-auto"
              placeholder="output field"
              value={acc.field}
              onChange={(e) => updateAcc(i, { field: e.target.value })}
            />
            <select
              value={acc.accumulator}
              onChange={(e) => updateAcc(i, { accumulator: e.target.value })}
              className="h-8 rounded border border-border bg-background px-2 text-xs font-mono text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
            >
              {GROUP_ACCUMULATORS.map((ga) => (
                <option key={ga.value} value={ga.value}>
                  {ga.label}
                </option>
              ))}
            </select>
            <Input
              variant="mono"
              className="flex-1 w-auto"
              placeholder="expression"
              value={acc.expression}
              onChange={(e) => updateAcc(i, { expression: e.target.value })}
            />
            <IconButton
              variant="danger"
              size="sm"
              icon={<Trash2 className="h-3 w-3" />}
              label="Remove"
              onClick={() => removeAcc(i)}
              disabled={accumulators.length <= 1}
            />
          </div>
        ))}
        <Button
          variant="ghost"
          size="sm"
          icon={<Plus className="h-3 w-3" />}
          onClick={addAcc}
          className="px-0 hover:underline"
        >
          Add accumulator
        </Button>
      </div>
    </div>
  );
}

function ProjectConfigurator({
  fields,
  onChange,
}: {
  fields: ProjectField[];
  onChange: (f: ProjectField[]) => void;
}) {
  const addField = () => onChange([...fields, { field: "", include: true }]);
  const removeField = (i: number) => onChange(fields.filter((_, idx) => idx !== i));
  const updateField = (i: number, patch: Partial<ProjectField>) =>
    onChange(fields.map((f, idx) => (idx === i ? { ...f, ...patch } : f)));

  return (
    <div className="space-y-3">
      <label className="text-xs text-muted-foreground">Fields</label>
      {fields.map((f, i) => (
        <div key={i} className="flex items-center gap-2">
          <Input
            variant="mono"
            className="flex-1 w-auto"
            placeholder="field name"
            value={f.field}
            onChange={(e) => updateField(i, { field: e.target.value })}
          />
          <select
            value={f.include ? "include" : "exclude"}
            onChange={(e) => updateField(i, { include: e.target.value === "include" })}
            className="h-8 rounded border border-border bg-background px-2 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
          >
            <option value="include">Include (1)</option>
            <option value="exclude">Exclude (0)</option>
          </select>
          <IconButton
            variant="danger"
            size="sm"
            icon={<Trash2 className="h-3 w-3" />}
            label="Remove"
            onClick={() => removeField(i)}
            disabled={fields.length <= 1}
          />
        </div>
      ))}
      <Button
        variant="ghost"
        size="sm"
        icon={<Plus className="h-3 w-3" />}
        onClick={addField}
        className="px-0 hover:underline"
      >
        Add field
      </Button>
    </div>
  );
}

function SortConfigurator({
  fields,
  onChange,
}: {
  fields: SortField[];
  onChange: (f: SortField[]) => void;
}) {
  const addField = () => onChange([...fields, { field: "", direction: "-1" }]);
  const removeField = (i: number) => onChange(fields.filter((_, idx) => idx !== i));
  const updateField = (i: number, patch: Partial<SortField>) =>
    onChange(fields.map((f, idx) => (idx === i ? { ...f, ...patch } : f)));

  return (
    <div className="space-y-3">
      <label className="text-xs text-muted-foreground">Sort Fields</label>
      {fields.map((f, i) => (
        <div key={i} className="flex items-center gap-2">
          <Input
            variant="mono"
            className="flex-1 w-auto"
            placeholder="field"
            value={f.field}
            onChange={(e) => updateField(i, { field: e.target.value })}
          />
          <select
            value={f.direction}
            onChange={(e) => updateField(i, { direction: e.target.value as "1" | "-1" })}
            className="h-8 rounded border border-border bg-background px-2 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
          >
            <option value="-1">Descending</option>
            <option value="1">Ascending</option>
          </select>
          <IconButton
            variant="danger"
            size="sm"
            icon={<Trash2 className="h-3 w-3" />}
            label="Remove"
            onClick={() => removeField(i)}
            disabled={fields.length <= 1}
          />
        </div>
      ))}
      <Button
        variant="ghost"
        size="sm"
        icon={<Plus className="h-3 w-3" />}
        onClick={addField}
        className="px-0 hover:underline"
      >
        Add field
      </Button>
    </div>
  );
}

function LookupConfigurator({
  from,
  localField,
  foreignField,
  as: asField,
  onFromChange,
  onLocalFieldChange,
  onForeignFieldChange,
  onAsChange,
}: {
  from: string;
  localField: string;
  foreignField: string;
  as: string;
  onFromChange: (v: string) => void;
  onLocalFieldChange: (v: string) => void;
  onForeignFieldChange: (v: string) => void;
  onAsChange: (v: string) => void;
}) {
  return (
    <div className="grid grid-cols-2 gap-3">
      <div>
        <label className="text-xs text-muted-foreground mb-1.5 block">
          From (collection)
        </label>
        <Input
          variant="mono"
          value={from}
          onChange={(e) => onFromChange(e.target.value)}
          placeholder="collection name"
        />
      </div>
      <div>
        <label className="text-xs text-muted-foreground mb-1.5 block">
          Local Field
        </label>
        <Input
          variant="mono"
          value={localField}
          onChange={(e) => onLocalFieldChange(e.target.value)}
          placeholder="localField"
        />
      </div>
      <div>
        <label className="text-xs text-muted-foreground mb-1.5 block">
          Foreign Field
        </label>
        <Input
          variant="mono"
          value={foreignField}
          onChange={(e) => onForeignFieldChange(e.target.value)}
          placeholder="_id"
        />
      </div>
      <div>
        <label className="text-xs text-muted-foreground mb-1.5 block">
          As (output field)
        </label>
        <Input
          variant="mono"
          value={asField}
          onChange={(e) => onAsChange(e.target.value)}
          placeholder="joined"
        />
      </div>
    </div>
  );
}

function UnwindConfigurator({
  path,
  preserve,
  onPathChange,
  onPreserveChange,
}: {
  path: string;
  preserve: boolean;
  onPathChange: (v: string) => void;
  onPreserveChange: (v: boolean) => void;
}) {
  return (
    <div className="space-y-3">
      <div>
        <label className="text-xs text-muted-foreground mb-1.5 block">
          Array Path
        </label>
        <Input
          variant="mono"
          value={path}
          onChange={(e) => onPathChange(e.target.value)}
          placeholder="$arrayField"
        />
      </div>
      <label className="flex items-center gap-2">
        <Checkbox
          checked={preserve}
          onChange={(e) => onPreserveChange(e.target.checked)}
        />
        <span className="text-xs text-muted-foreground">
          Preserve null and empty arrays
        </span>
      </label>
    </div>
  );
}
