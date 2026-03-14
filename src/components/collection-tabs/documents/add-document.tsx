"use client";

import { DocumentFormModal } from "./document-form-modal";
import { Plus } from "lucide-react";
import { useState } from "react";

type AddDocumentProps = {
  dbName: string;
  collectionName: string;
};

export const AddDocument = ({ dbName, collectionName }: AddDocumentProps) => {
  const [open, setOpen] = useState(false);
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
