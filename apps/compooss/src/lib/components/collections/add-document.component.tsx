"use client";

import { DocumentFormModal } from "@/lib/components/collections/document-form-modal.component";
import { Button } from "@compooss/ui";
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
      <Button
        variant="ghost"
        size="sm"
        icon={<Plus className="h-3.5 w-3.5" />}
        onClick={() => setOpen(true)}
        disabled={!canAdd}
      >
        Add Data
      </Button>
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
