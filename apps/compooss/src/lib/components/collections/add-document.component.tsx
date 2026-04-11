"use client";

import { DocumentFormModal } from "@/lib/components/collections/document-form-modal.component";
import { Plus } from "lucide-react";
import { useState } from "react";

type Props = {
  dbName: string;
  collectionName: string;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
};

export const AddDocument: React.FC<Props> = ({
  dbName,
  collectionName,
  open: controlledOpen,
  onOpenChange,
}) => {
  const [internalOpen, setInternalOpen] = useState(false);
  const open = controlledOpen ?? internalOpen;
  const setOpen = onOpenChange ?? setInternalOpen;
  const canAdd = !!dbName && !!collectionName;

  return (
    <>
      <button
        className="flex items-center gap-1 text-xs text-primary hover:text-primary/80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        type="button"
        onClick={() => setOpen(true)}
        disabled={!canAdd}
      >
        <Plus className="h-3.5 w-3.5" />
        Add Data
      </button>
      <DocumentFormModal
        open={open}
        onClose={() => setOpen(false)}
        mode="add"
        dbName={dbName}
        collectionName={collectionName}
      />
    </>
  );
};
