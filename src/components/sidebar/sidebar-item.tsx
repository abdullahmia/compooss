"use client";

import { ConfirmDestructiveModal } from "@/components/confirm-destructive-modal";
import { useDeleteDatabase } from "@/lib/services/v2/database/database.service";
import {
  useDeleteCollection,
  useGetCollections,
} from "@/lib/services/v2/collections/collection.service";
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
  const [deleteDbModalOpen, setDeleteDbModalOpen] = useState(false);
  const [collectionToDelete, setCollectionToDelete] =
    useState<TCollection | null>(null);

  const { data: collections } = useGetCollections(db.name, {
    enabled: isExpanded,
  });

  const { mutateAsync: deleteDatabase, isPending: isDeletingDb } =
    useDeleteDatabase({
      onSuccess: () => setDeleteDbModalOpen(false),
    });

  const { mutateAsync: deleteCollection, isPending: isDeletingCol } =
    useDeleteCollection(db.name, {
      onSuccess: () => setCollectionToDelete(null),
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

  const handleDeleteDbClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setDeleteDbModalOpen(true);
  };

  const handleConfirmDeleteDb = async () => {
    await deleteDatabase(db.name);
  };

  const handleDeleteCollectionClick = (
    e: React.MouseEvent,
    collection: TCollection,
  ) => {
    e.stopPropagation();
    setCollectionToDelete(collection);
  };

  const handleConfirmDeleteCollection = async () => {
    if (!collectionToDelete) return;
    await deleteCollection(collectionToDelete.name);
  };

  return (
    <>
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
              onClick={handleDeleteDbClick}
            />
          </div>
        </div>

        {isExpanded && (
          <div className="ml-4">
            {collections?.map((col) => (
              <div
                key={col.name}
                className="group/col flex items-center w-full hover:bg-sidebar-accent transition-colors"
              >
                <button
                  type="button"
                  onClick={() => handleSelectCollection(col)}
                  className="flex-1 flex items-center gap-1.5 pl-5 pr-2 py-1.5 text-xs text-sidebar-foreground cursor-pointer text-left min-w-0"
                >
                  <Table className="h-3 w-3 shrink-0" />
                  <span className="truncate">{col.name}</span>
                </button>
                <div className="flex items-center shrink-0 pr-2">
                  <Badge
                    variant="subtle"
                    size="sm"
                    className="shrink-0 transition-transform duration-200 ease-out group-hover/col:-translate-x-1"
                  >
                    {col.documentCount.toLocaleString()}
                  </Badge>
                  <IconButton
                    icon={<Trash2 className="h-3 w-3" />}
                    label="Delete collection"
                    variant="danger"
                    size="sm"
                    className="opacity-0 translate-x-1 group-hover/col:opacity-100 group-hover/col:translate-x-0 transition-all duration-200 ease-out shrink-0"
                    onClick={(e) => handleDeleteCollectionClick(e, col)}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <ConfirmDestructiveModal
        open={deleteDbModalOpen}
        onClose={() => setDeleteDbModalOpen(false)}
        title="Delete database"
        icon={<Trash2 className="h-4 w-4" />}
        description={
          <>
            Are you sure you want to delete <strong>{db.name}</strong>? This
            will remove the database and all its collections. This action cannot
            be undone.
          </>
        }
        onConfirm={handleConfirmDeleteDb}
        isPending={isDeletingDb}
      />

      <ConfirmDestructiveModal
        open={!!collectionToDelete}
        onClose={() => setCollectionToDelete(null)}
        title="Delete collection"
        icon={<Trash2 className="h-4 w-4" />}
        description={
          <>
            Are you sure you want to delete{" "}
            <strong>{collectionToDelete?.name}</strong> from{" "}
            <strong>{db.name}</strong>? All documents in this collection will
            be removed. This action cannot be undone.
          </>
        }
        onConfirm={handleConfirmDeleteCollection}
        isPending={isDeletingCol}
      />
    </>
  );
};
