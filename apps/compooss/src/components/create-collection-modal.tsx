"use client";

import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@compooss/ui";
import { Input } from "@compooss/ui";
import {
  createCollectionSchema,
  type TCreateCollectionInput,
} from "@/lib/schemas/collection.schema";
import { useCreateCollection } from "@/lib/services/collections/collection.service";
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
              hookForm={form as unknown as import("react-hook-form").UseFormReturn<Record<string, unknown>>}
              name="collectionName"
              label="Collection name"
              placeholder="e.g. my_collection"
              variant="default"
              inputSize="md"
              autoFocus
            />
          </ModalBody>
          <ModalFooter>
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
              {isPending ? "Creating…" : "Create"}
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
}
