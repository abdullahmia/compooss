"use client";

import { Button, IconButton, Input } from "@compooss/ui";
import { createDatabaseSchema, type TCreateDatabaseFormData } from "@/lib/schemas";
import { useCreateDatabase } from "@/lib/services/database/database.service";
import { zodResolver } from "@hookform/resolvers/zod";
import { Database, X } from "lucide-react";
import { useForm } from "react-hook-form";

type Props = {
  onClose: () => void;
};

export const CreateDatabaseModal: React.FC<Props> = ({ onClose }) => {
  const { mutateAsync: createDatabase, isPending } = useCreateDatabase({
    onSuccess: () => {
      onClose();
    },
  });

  const form = useForm<TCreateDatabaseFormData>({
    resolver: zodResolver(createDatabaseSchema),
    defaultValues: {
      dbName: "",
      collectionName: "",
    },
  });

  const handleSubmit = async (values: TCreateDatabaseFormData) => {
    await createDatabase(values);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-background/10 backdrop-blur-xs"
        onClick={onClose}
      />
      <div className="relative bg-card border border-border rounded-lg shadow-xl w-full max-w-md mx-4">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <div className="flex items-center gap-2">
            <Database className="h-4 w-4 text-primary" />
            <h2 className="text-sm font-semibold text-foreground">
              Create Database
            </h2>
          </div>
          <IconButton
            type="button"
            onClick={onClose}
            icon={<X className="h-4 w-4" />}
            variant="ghost"
            size="sm"
            label="Close"
          />
        </div>

        <form onSubmit={form.handleSubmit(handleSubmit)}>
          <div className="px-5 py-5 space-y-4">
            <div>
              <Input
                hookForm={form as unknown as import("react-hook-form").UseFormReturn<Record<string, unknown>>}
                name="dbName"
                label="Database Name"
                placeholder="e.g. my_database"
                variant="default"
                inputSize="md"
                autoFocus
              />
            </div>
            <div>
              <Input
                hookForm={form as unknown as import("react-hook-form").UseFormReturn<Record<string, unknown>>}
                name="collectionName"
                label="Collection Name"
                placeholder="e.g. my_collection"
                variant="default"
                inputSize="md"
              />
            </div>
            <div className="bg-secondary/50 border border-border rounded-sm p-3">
              <p className="text-[11px] text-muted-foreground">
                Before MongoDB can save your new database, a collection name
                must also be specified at the time of creation.
              </p>
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 px-5 py-4 border-t border-border">
            <Button
              type="button"
              onClick={onClose}
              variant="outline"
              size="md"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isPending}
              variant="primary"
              size="md"
              loading={isPending}
            >
              {isPending ? "Creating…" : "Create Database"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
