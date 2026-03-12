"use client";

import { Input } from "@/components/ui/input/input";
import {
  createDatabaseSchema,
  type TCreateDatabaseInput,
} from "@/lib/schemas/database.schema";
import { createDatabaseAction } from "@/lib/services/database/database.action";
import { zodResolver } from "@hookform/resolvers/zod";
import { Database, X } from "lucide-react";
import { useForm } from "react-hook-form";

interface ICreateDatabaseModalProps {
  open: boolean;
  onClose: () => void;
  onCreated?: () => void;
}

export function CreateDatabaseModal({
  open,
  onClose,
  onCreated,
}: ICreateDatabaseModalProps) {
  const form = useForm<TCreateDatabaseInput>({
    resolver: zodResolver(createDatabaseSchema),
    defaultValues: {
      dbName: "",
      collectionName: "",
    },
  });

  if (!open) return null;

  const handleSubmit = async (values: TCreateDatabaseInput) => {
    try {
      await createDatabaseAction({
        dbName: values.dbName.trim(),
        collectionName: values.collectionName.trim(),
      });
      form.reset();
      onClose();
      onCreated?.();
    } catch (err: any) {
      // map to field or form error as you see fit
      form.setError("dbName", { message: err.message ?? "Unable to create database." });
    }
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
          <button
            type="button"
            onClick={onClose}
            className="p-1 text-muted-foreground hover:text-foreground rounded-sm hover:bg-secondary transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <form onSubmit={form.handleSubmit(handleSubmit)}>
          <div className="px-5 py-5 space-y-4">
            <div>
              <Input
                hookForm={form}
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
                hookForm={form}
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
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-muted-foreground hover:text-foreground rounded-sm border border-border hover:bg-secondary transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={form.formState.isSubmitting}
              className="px-4 py-2 text-xs font-medium bg-primary text-primary-foreground rounded-sm hover:bg-primary/90 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {form.formState.isSubmitting ? "Creating…" : "Create Database"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
