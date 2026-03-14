"use client";

import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@/components/ui/modal/modal";
import { useDeleteDatabase } from "@/lib/services/v2/database/database.service";
import { useGetCollections } from "@/lib/services/v2/collections/collection.service";
import { TCollection } from "@/lib/types/collections.types";
import { TDatabase } from "@/lib/types/database.types";
import {
  ChevronDown,
  ChevronRight,
  DatabaseBackupIcon,
  Table,
  Trash2,
} from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React, { useState } from "react";
import { Badge } from "../ui/badge/badge";
import { IconButton } from "../ui/icon-button/icon-button";

type Props = {
  db: TDatabase;
};

export const SidebarItem: React.FC<Props> = ({ db }) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  const { data: collections } = useGetCollections(db.name, {
    enabled: isExpanded,
  });

  const { mutateAsync: deleteDatabase, isPending: isDeleting } =
    useDeleteDatabase({
      onSuccess: () => setDeleteModalOpen(false),
    });

  const toggleDb = async () => {
    setIsExpanded(!isExpanded);
  };

  const handleSelectCollection = (collection: TCollection) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("db", db.name);
    params.set("collection", collection.name);

    const queryString = params.toString();
    router.push(queryString ? `${pathname}?${queryString}` : pathname);
  };

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    await deleteDatabase(db.name);
  };

  return (
    <div key={db.name}>
      <div className="group flex items-center w-full hover:bg-sidebar-accent transition-colors">
        <button
          type="button"
          onClick={toggleDb}
          className="flex-1 flex items-center gap-1.5 px-3 py-1.5 text-xs cursor-pointer text-left min-w-0"
        >
          {isExpanded ? (
            <ChevronDown className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
          ) : (
            <ChevronRight className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
          )}
          <DatabaseBackupIcon className="h-3.5 w-3.5 text-primary shrink-0" />
          <span className="font-medium text-sidebar-foreground truncate">
            {db.name}
          </span>
        </button>
        <div className="flex items-center shrink-0 pr-1">
          <Badge
            variant="subtle"
            size="sm"
            className="shrink-0 transition-transform duration-200 ease-out group-hover:-translate-x-2"
          >
            {db.sizeOnDisk}
          </Badge>
          <IconButton
            icon={<Trash2 className="h-3 w-3" />}
            label="Delete database"
            variant="danger"
            size="sm"
            className="opacity-0 translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200 ease-out shrink-0"
            onClick={handleDeleteClick}
          />
        </div>
      </div>

      <Modal open={deleteModalOpen} onClose={() => setDeleteModalOpen(false)}>
        <ModalContent size="sm">
          <ModalHeader
            title="Delete database"
            icon={<Trash2 className="h-4 w-4" />}
            onClose={() => setDeleteModalOpen(false)}
          />
          <ModalBody>
            <p className="text-sm text-muted-foreground">
              Are you sure you want to delete <strong>{db.name}</strong>? This
              will remove the database and all its collections. This action
              cannot be undone.
            </p>
          </ModalBody>
          <ModalFooter>
            <button
              type="button"
              onClick={() => setDeleteModalOpen(false)}
              className="px-4 py-2 text-xs font-medium text-muted-foreground hover:text-foreground rounded-sm border border-border hover:bg-secondary transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleConfirmDelete}
              disabled={isDeleting}
              className="px-4 py-2 text-xs font-medium bg-destructive text-destructive-foreground rounded-sm hover:bg-destructive/90 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {isDeleting ? "Deleting…" : "Delete"}
            </button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {isExpanded && (
        <div className="ml-4">
          {collections?.map((col) => {
            return (
              <button
                key={col.name}
                onClick={() => handleSelectCollection(col)}
                className={`w-full flex items-center gap-1.5 pl-5 pr-3 py-1.5 text-xs transition-colors text-sidebar-foreground hover:bg-sidebar-accent cursor-pointer`}
              >
                <Table className="h-3 w-3 shrink-0" />
                <span className="truncate">{col.name}</span>
                <Badge variant="subtle" size="sm" className="ml-auto">
                  {col.documentCount.toLocaleString()}
                </Badge>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};
