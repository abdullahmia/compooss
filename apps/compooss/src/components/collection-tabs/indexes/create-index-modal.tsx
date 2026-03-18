"use client";

import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@compooss/ui";
import { Button, Input, Toggle } from "@compooss/ui";
import {
  createIndexSchema,
  type TCreateIndexFormValues,
  type TIndexFieldForm,
} from "@/lib/schemas/index.schema";
import {
  useCreateIndex,
  type CreateIndexPayload,
} from "@/lib/services/indexes/indexes.service";
import { zodResolver } from "@hookform/resolvers/zod";
import { Grid3X3, Minus, Plus } from "lucide-react";
import {
  useForm,
  useFieldArray,
  Controller,
  type Resolver,
} from "react-hook-form";
import type { IndexField } from "@compooss/types";

const DIRECTION_OPTIONS: { value: TIndexFieldForm["direction"]; label: string }[] = [
  { value: "1", label: "1 (asc)" },
  { value: "-1", label: "-1 (desc)" },
  { value: "text", label: "text" },
  { value: "2dsphere", label: "2dsphere" },
  { value: "2d", label: "2d" },
  { value: "hashed", label: "hashed" },
];

function toApiDirection(
  d: TIndexFieldForm["direction"],
): IndexField["direction"] {
  if (d === "1") return 1;
  if (d === "-1") return -1;
  return d;
}

type Props = {
  open: boolean;
  dbName: string;
  collectionName: string;
  onClose: () => void;
};

const defaultField: TIndexFieldForm = { field: "", direction: "1" };

export function CreateIndexModal({
  open,
  dbName,
  collectionName,
  onClose,
}: Props) {
  const { mutateAsync: createIndex, isPending } = useCreateIndex(
    dbName,
    collectionName,
    {
      onSuccess: () => {
        form.reset({
          fields: [defaultField],
          name: "",
          unique: false,
          sparse: false,
          hidden: false,
          expireAfterSeconds: undefined,
          partialFilterExpression: "",
        });
        onClose();
      },
      onError: (err) => console.error(err),
    },
  );

  const form = useForm<TCreateIndexFormValues>({
    resolver: zodResolver(createIndexSchema) as Resolver<TCreateIndexFormValues>,
    defaultValues: {
      fields: [defaultField],
      name: "",
      unique: false,
      sparse: false,
      hidden: false,
      expireAfterSeconds: undefined,
      partialFilterExpression: "",
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "fields",
  });

  const handleSubmit = async (values: TCreateIndexFormValues) => {
    const payload: CreateIndexPayload = {
      fields: values.fields.map((f) => ({
        field: f.field,
        direction: toApiDirection(f.direction),
      })),
      name: values.name?.trim() || undefined,
      unique: values.unique,
      sparse: values.sparse,
      hidden: values.hidden,
      expireAfterSeconds:
        values.expireAfterSeconds != null && values.expireAfterSeconds > 0
          ? values.expireAfterSeconds
          : undefined,
      partialFilterExpression: (() => {
        const s = values.partialFilterExpression?.trim();
        if (!s || s === "" || s === "{}") return undefined;
        try {
          const parsed = JSON.parse(s) as Record<string, unknown>;
          return Object.keys(parsed).length > 0 ? parsed : undefined;
        } catch {
          return undefined;
        }
      })(),
    };
    await createIndex(payload);
  };

  const hasSingleField = form.watch("fields").length === 1;

  return (
    <Modal open={open} onClose={onClose}>
      <ModalContent size="lg">
        <ModalHeader
          title="Create index"
          icon={<Grid3X3 className="h-4 w-4" />}
          onClose={onClose}
        />
        <form onSubmit={form.handleSubmit(handleSubmit)}>
          <ModalBody className="space-y-5">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-foreground">
                  Index fields
                </span>
                <Button
                  type="button"
                  variant="ghost"
                  icon={<Plus className="h-3.5 w-3.5" />}
                  onClick={() => append({ field: "", direction: "1" })}
                >
                  Add field
                </Button>
              </div>
              <div className="space-y-3">
                {fields.map((item, index) => (
                  <div
                    key={item.id}
                    className="flex items-center gap-2 flex-wrap"
                  >
                    <div className="flex-1 min-w-[140px]">
                      <Input
                        hookForm={
                          form as unknown as import("react-hook-form").UseFormReturn<Record<string, unknown>>
                        }
                        name={`fields.${index}.field`}
                        label={index === 0 ? "Field name" : undefined}
                        placeholder="e.g. email"
                        variant="default"
                        inputSize="md"
                      />
                    </div>
                    <div className="w-[140px]">
                      <label className="block text-xs font-medium text-muted-foreground mb-1">
                        Type
                      </label>
                      <select
                        className="w-full h-9 text-sm font-mono px-3 py-1.5 rounded-sm border border-border bg-secondary text-foreground focus:border-primary focus:ring-1 focus:ring-primary/30 outline-hidden"
                        {...form.register(`fields.${index}.direction`)}
                      >
                        {DIRECTION_OPTIONS.map((opt) => (
                          <option key={opt.value} value={opt.value}>
                            {opt.label}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="pt-6">
                      <Button
                        type="button"
                        variant="ghost"
                        icon={<Minus className="h-3.5 w-3.5" />}
                        onClick={() => remove(index)}
                        disabled={fields.length <= 1}
                        aria-label="Remove field"
                      />
                    </div>
                  </div>
                ))}
              </div>
              {form.formState.errors.fields?.root?.message && (
                <p className="text-xs text-destructive mt-1">
                  {form.formState.errors.fields.root.message}
                </p>
              )}
            </div>

            <div className="border-t border-border pt-4 space-y-4">
              <span className="text-sm font-medium text-foreground">
                Options
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Input
                    hookForm={
                      form as unknown as import("react-hook-form").UseFormReturn<Record<string, unknown>>
                    }
                    name="name"
                    label="Index name (optional)"
                    placeholder="Auto-generated if empty"
                    variant="default"
                    inputSize="md"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-xs font-medium text-muted-foreground">
                    TTL (expireAfterSeconds)
                  </span>
                  <input
                    type="number"
                    min={0}
                    max={2147483647}
                    placeholder="Optional"
                    disabled={!hasSingleField}
                    className="w-full h-9 text-sm font-mono px-3 py-1.5 rounded-sm border border-border bg-secondary text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-1 focus:ring-primary/30 outline-hidden disabled:opacity-50"
                    {...form.register("expireAfterSeconds", {
                      setValueAs: (v) =>
                        v === "" || Number.isNaN(Number(v))
                          ? undefined
                          : Number(v),
                    })}
                  />
                  {!hasSingleField && (
                    <p className="text-xs text-muted-foreground">
                      TTL requires exactly one field
                    </p>
                  )}
                </div>
              </div>
              <div className="flex flex-wrap gap-6">
                <Controller
                  name="unique"
                  control={form.control}
                  render={({ field }) => (
                    <label className="flex items-center gap-2 cursor-pointer">
                      <Toggle
                        checked={field.value}
                        onChange={field.onChange}
                        label="Unique"
                      />
                      <span className="text-xs font-medium text-foreground">
                        Unique
                      </span>
                    </label>
                  )}
                />
                <Controller
                  name="sparse"
                  control={form.control}
                  render={({ field }) => (
                    <label className="flex items-center gap-2 cursor-pointer">
                      <Toggle
                        checked={field.value}
                        onChange={field.onChange}
                        label="Sparse"
                      />
                      <span className="text-xs font-medium text-foreground">
                        Sparse
                      </span>
                    </label>
                  )}
                />
                <Controller
                  name="hidden"
                  control={form.control}
                  render={({ field }) => (
                    <label className="flex items-center gap-2 cursor-pointer">
                      <Toggle
                        checked={field.value}
                        onChange={field.onChange}
                        label="Hidden"
                      />
                      <span className="text-xs font-medium text-foreground">
                        Hidden
                      </span>
                    </label>
                  )}
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1">
                  Partial filter expression (JSON, optional)
                </label>
                <textarea
                  className="w-full min-h-[80px] text-sm font-mono px-3 py-2 rounded-sm border border-border bg-secondary text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-1 focus:ring-primary/30 outline-hidden resize-y"
                  placeholder='e.g. { "status": "active" }'
                  {...form.register("partialFilterExpression")}
                />
              </div>
            </div>
          </ModalBody>
          <ModalFooter>
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-muted-foreground hover:text-foreground rounded-sm border border-border hover:bg-secondary transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isPending}
              className="px-4 py-2 text-xs font-medium bg-primary text-primary-foreground rounded-sm hover:bg-primary/90 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {isPending ? "Creating…" : "Create index"}
            </button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
}
