'use client';

import { useGetCollections } from "@/lib/services/v2/collections/collection.service";
import { TCollection } from "@/lib/types/collections.types";
import { TDatabase } from "@/lib/types/database.types";
import { ChevronDown, ChevronRight, DatabaseBackupIcon, Table } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React, { useState } from "react";
import { Badge } from "../ui/badge/badge";

type Props = {
  db: TDatabase
}

export const SidebarItem: React.FC<Props> = ({ db }) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isExpanded, setIsExpanded] = useState<boolean>(false);

  const { data: collections } = useGetCollections(db.name, {
    enabled: isExpanded,
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
  }

  return (
    <div key={db.name}>
      <button
        onClick={toggleDb}
        className="w-full flex items-center gap-1.5 px-3 py-1.5 text-xs hover:bg-sidebar-accent transition-colors group cursor-pointer"
      >
        {isExpanded ? (
          <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
        ) : (
          <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" />
        )}
        <DatabaseBackupIcon className="h-3.5 w-3.5 text-primary" />
        <span className="font-medium text-sidebar-foreground">
          {db.name}
        </span>
        <Badge variant="subtle" size="sm" className="ml-auto">
          {db.sizeOnDisk}
        </Badge>
      </button>

      {isExpanded && (
        <div className="ml-4">
          {
            collections?.map((col) => {
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
            })
          }
        </div>
      )}
    </div>
  )
}