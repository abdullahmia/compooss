"use client";

import { Clock, Leaf, Star, StarOff, Trash2 } from "lucide-react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  ConnectionSchema,
  TConnectionSchema,
} from "@/lib/schemas/connection.schema";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button/button";
import { Input } from "../ui/input/input";
import { useRouter } from "next/navigation";
import {
  createConnection,
  deleteConnection,
} from "@/lib/services/connection";
import type { ConnectionDTO } from "@/lib/types";
import { formatDistanceToNow } from "date-fns";

interface NewConnectionProps {
  savedConnections: ConnectionDTO[];
}

export function NewConnection({ savedConnections }: NewConnectionProps) {
  const form = useForm<TConnectionSchema>({
    resolver: zodResolver(ConnectionSchema),
    defaultValues: {
      connectionString: "mongodb://localhost:27017",
      connectionName: "",
      isFavorite: false,
    },
  });

  const router = useRouter();

  const isFavorite = useWatch({
    control: form.control,
    name: "isFavorite",
  });

  const onFormSubmit = async (data: TConnectionSchema) => {
    try {
      await createConnection(data);
      router.push("/");
    } catch (error) {
      console.error("Failed to create connection:", error);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteConnection(id);
      router.refresh();
    } catch (error) {
      console.error("Failed to delete connection:", error);
    }
  };

  const handleSaveAsFavorite = () => {
    form.setValue("isFavorite", !form.getValues("isFavorite"));
  };

  return (
    <div className="h-screen flex flex-col bg-background">
      <div className="h-11 flex items-center gap-2 px-4 bg-topbar border-b border-border shrink-0">
        <Leaf className="h-5 w-5 text-primary" />
        <span className="font-semibold text-sm text-foreground tracking-tight">
          Compooss
        </span>
      </div>

      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-2xl">
          <div className="text-center mb-8">
            <div className="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-5">
              <Leaf className="h-10 w-10 text-primary" />
            </div>
            <h1 className="text-2xl font-bold text-foreground mb-2">
              New Connection
            </h1>
            <p className="text-sm text-muted-foreground">
              Connect to a MongoDB deployment
            </p>
          </div>

          <form
            onSubmit={form.handleSubmit(onFormSubmit)}
            className="bg-card border border-border rounded-lg p-5 mb-6"
          >
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 block">
              Connection String
            </label>

            <Input
              hookForm={form}
              name="connectionString"
              placeholder="mongodb://localhost:27017"
              variant="default"
              inputSize="lg"
              className="w-full"
            />

            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 mt-4 block">
              Connection Name
            </label>

            <Input
              hookForm={form}
              name="connectionName"
              placeholder="e.g. Local Development"
              variant="default"
              inputSize="lg"
              className="w-full"
            />

            <div className="flex items-center gap-3 mt-4">
              <Button type="submit">Connect</Button>
              <Button
                variant="ghost"
                type="button"
                icon={
                  <Star
                    className={cn(
                      "h-3 w-3 transition-colors",
                      isFavorite && "fill-warning text-warning",
                    )}
                  />
                }
                onClick={handleSaveAsFavorite}
              >
                Save as favorite
              </Button>
            </div>
          </form>

          {savedConnections.length > 0 && (
            <div>
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                Saved Connections
              </h3>
              <div className="space-y-2">
                {savedConnections.map((conn) => (
                  <div
                    key={conn.id}
                    className="bg-card border border-border rounded-lg p-4 hover:border-primary/30 transition-colors group cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <button className="text-muted-foreground hover:text-warning transition-colors">
                        <StarOff className="h-4 w-4" />
                      </button>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium text-foreground">
                            {conn.name}
                          </span>
                        </div>
                        <span className="text-xs font-mono text-muted-foreground truncate block mt-0.5">
                          {conn.lastUsedAt
                            ? formatDistanceToNow(new Date(conn.lastUsedAt), {
                                addSuffix: true,
                              })
                            : "Never used"}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {formatDistanceToNow(new Date(conn.createdAt), {
                            addSuffix: true,
                          })}
                        </span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(conn.id);
                          }}
                          className="p-1 text-muted-foreground hover:text-destructive rounded-sm opacity-0 group-hover:opacity-100 transition-all"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                          }}
                          className="bg-primary/15 text-primary px-3 py-1 rounded-sm text-xs font-medium hover:bg-primary/25 transition-colors opacity-0 group-hover:opacity-100"
                        >
                          Connect
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
