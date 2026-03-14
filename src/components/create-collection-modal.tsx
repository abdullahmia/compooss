"use client";

import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@/components/ui/modal/modal";
import { Input } from "@/components/ui/input/input";
import {
  createCollectionSchema,
  type TCreateCollectionInput,
} from "@/lib/schemas/collection.schema";
import { useCreateCollection } from "@/lib/services/v2/collections/collection.service";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus } from "lucide-react";
import { useForm } from "react-hook-form";

type Props = {
  open: boolean;
  dbName: string;
  onClose: () => void;
};

export function CreateCollectionModal({ open, dbName, onClose }: Props) {
  const { mutateAsync: createCollection, isPending } = useCreateCollection(
    dbName,
    {
      onSuccess: () => {
        form.reset();
        onClose();
      },
      onError: (error) => {
        console.error(error);
      },
    },
  );

  const form = useForm<TCreateCollectionInput>({
    resolver: zodResolver(createCollectionSchema),
    defaultValues: {
      collectionName: "",
    },
  });

  const handleSubmit = async (values: TCreateCollectionInput) => {
    await createCollection(values.collectionName);
  };

  return (
    <Modal open={open} onClose={onClose}>
      <ModalContent size="sm">
        <ModalHeader
          title="Create collection"
          icon={<Plus className="h-4 w-4" />}
          onClose={onClose}
        />
        <form onSubmit={form.handleSubmit(handleSubmit)}>
          <ModalBody>
            <Input
              hookForm={form}
              name="collectionName"
              label="Collection name"
              placeholder="e.g. my_collection"
              variant="default"
              inputSize="md"
              autoFocus
            />
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
              {isPending ? "Creating…" : "Create"}
            </button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
}
