"use client";

import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
} from "@compooss/ui";
import { Eye, Loader2 } from "lucide-react";
import { useCallback, useState } from "react";

type Props = {
  open: boolean;
  isCreating: boolean;
  onClose: () => void;
  onCreate: (viewName: string) => void;
};

export const CreateViewModal: React.FC<Props> = ({
  open,
  isCreating,
  onClose,
  onCreate,
}) => {
  const [viewName, setViewName] = useState("");

  const handleCreate = useCallback(() => {
    if (!viewName.trim()) return;
    onCreate(viewName.trim());
    setViewName("");
  }, [viewName, onCreate]);

  return (
    <Modal open={open} onClose={onClose}>
      <ModalContent size="sm">
        <ModalHeader
          icon={<Eye className="h-4 w-4" />}
          title="Create View from Pipeline"
          onClose={onClose}
        />
        <ModalBody>
          <div>
            <label className="text-xs text-muted-foreground mb-1.5 block">
              View Name
            </label>
            <Input
              variant="default"
              value={viewName}
              onChange={(e) => setViewName(e.target.value)}
              placeholder="my_view"
              onKeyDown={(e) => e.key === "Enter" && handleCreate()}
            />
            <p className="text-[11px] text-muted-foreground mt-1.5">
              Creates a new view in the current database using the pipeline.
            </p>
          </div>
        </ModalBody>
        <ModalFooter>
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button
            variant="primary"
            icon={
              isCreating ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <Eye className="h-3.5 w-3.5" />
              )
            }
            onClick={handleCreate}
            disabled={!viewName.trim() || isCreating}
          >
            {isCreating ? "Creating..." : "Create View"}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
