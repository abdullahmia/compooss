"use client";

import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  IconButton,
  Badge,
  Input,
} from "@compooss/ui";
import type { SavedPipeline } from "@compooss/types";
import {
  BookOpen,
  Save,
  Star,
  Trash2,
} from "lucide-react";
import { useCallback, useMemo, useState } from "react";

type Props = {
  open: boolean;
  mode: "save" | "load";
  savedPipelines: SavedPipeline[];
  onClose: () => void;
  onSave: (name: string) => void;
  onLoad: (id: string) => void;
  onDelete: (id: string) => void;
  onToggleFavorite: (id: string) => void;
};

export const SavePipelineModal: React.FC<Props> = ({
  open,
  mode,
  savedPipelines,
  onClose,
  onSave,
  onLoad,
  onDelete,
  onToggleFavorite,
}) => {
  const [name, setName] = useState("");
  const [search, setSearch] = useState("");
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);

  const filteredPipelines = useMemo(() => {
    let result = savedPipelines;
    if (showFavoritesOnly) {
      result = result.filter((p) => p.isFavorite);
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter((p) => p.name.toLowerCase().includes(q));
    }
    return result.sort(
      (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
    );
  }, [savedPipelines, search, showFavoritesOnly]);

  const handleSave = useCallback(() => {
    if (!name.trim()) return;
    onSave(name.trim());
    setName("");
    onClose();
  }, [name, onSave, onClose]);

  const handleLoad = useCallback(
    (id: string) => {
      onLoad(id);
      onClose();
    },
    [onLoad, onClose],
  );

  return (
    <Modal open={open} onClose={onClose}>
      <ModalContent size="lg">
        <ModalHeader
          icon={
            mode === "save" ? (
              <Save className="h-4 w-4" />
            ) : (
              <BookOpen className="h-4 w-4" />
            )
          }
          title={mode === "save" ? "Save Pipeline" : "Load Pipeline"}
          onClose={onClose}
        />
        <ModalBody>
          {mode === "save" ? (
            <div className="space-y-3">
              <div>
                <label className="text-xs text-muted-foreground mb-1.5 block">
                  Pipeline Name
                </label>
                <Input
                  variant="default"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="My aggregation pipeline"
                  onKeyDown={(e) => e.key === "Enter" && handleSave()}
                />
              </div>
              {savedPipelines.length > 0 && (
                <div>
                  <p className="text-xs text-muted-foreground mb-2">
                    Existing saved pipelines ({savedPipelines.length})
                  </p>
                  <div className="max-h-[200px] overflow-y-auto scrollbar-thin space-y-1">
                    {savedPipelines.map((p) => (
                      <div
                        key={p.id}
                        className="flex items-center justify-between px-3 py-2 rounded border border-border bg-card/50"
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          {p.isFavorite && (
                            <Star className="h-3 w-3 text-yellow-500 fill-yellow-500 shrink-0" />
                          )}
                          <span className="text-xs text-foreground truncate">
                            {p.name}
                          </span>
                          <Badge variant="subtle" size="sm">
                            {p.stages.length} stages
                          </Badge>
                        </div>
                        <span className="text-[10px] text-muted-foreground shrink-0 ml-2">
                          {new Date(p.updatedAt).toLocaleDateString()}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Input
                  variant="compact"
                  className="bg-transparent flex-1"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search pipelines..."
                />
                <button
                  type="button"
                  onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
                  className={`flex items-center gap-1 px-2.5 py-1.5 rounded text-xs border transition-colors ${
                    showFavoritesOnly
                      ? "border-yellow-500/50 bg-yellow-500/10 text-yellow-500"
                      : "border-border text-muted-foreground hover:bg-muted/50"
                  }`}
                >
                  <Star className="h-3 w-3" />
                  Favorites
                </button>
              </div>

              {filteredPipelines.length === 0 ? (
                <div className="py-8 text-center text-sm text-muted-foreground">
                  {savedPipelines.length === 0
                    ? "No saved pipelines yet."
                    : "No pipelines match your search."}
                </div>
              ) : (
                <div className="max-h-[400px] overflow-y-auto scrollbar-thin space-y-1">
                  {filteredPipelines.map((p) => (
                    <div
                      key={p.id}
                      className="flex items-center justify-between px-3 py-2.5 rounded border border-border bg-card/50 hover:bg-card/80 transition-colors group"
                    >
                      <button
                        type="button"
                        onClick={() => handleLoad(p.id)}
                        className="flex items-center gap-2 min-w-0 flex-1 text-left"
                      >
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            {p.isFavorite && (
                              <Star className="h-3 w-3 text-yellow-500 fill-yellow-500 shrink-0" />
                            )}
                            <span className="text-xs font-medium text-foreground truncate">
                              {p.name}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className="text-[10px] text-muted-foreground">
                              {p.stages.length} stages
                            </span>
                            <span className="text-[10px] text-muted-foreground">
                              {new Date(p.updatedAt).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      </button>
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <IconButton
                          variant="default"
                          size="sm"
                          icon={
                            <Star
                              className={`h-3 w-3 ${
                                p.isFavorite
                                  ? "text-yellow-500 fill-yellow-500"
                                  : ""
                              }`}
                            />
                          }
                          label="Toggle favorite"
                          onClick={() => onToggleFavorite(p.id)}
                        />
                        <IconButton
                          variant="danger"
                          size="sm"
                          icon={<Trash2 className="h-3 w-3" />}
                          label="Delete"
                          onClick={() => onDelete(p.id)}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </ModalBody>
        {mode === "save" && (
          <ModalFooter>
            <Button variant="ghost" onClick={onClose}>
              Cancel
            </Button>
            <Button
              variant="primary"
              icon={<Save className="h-3.5 w-3.5" />}
              onClick={handleSave}
              disabled={!name.trim()}
            >
              Save Pipeline
            </Button>
          </ModalFooter>
        )}
      </ModalContent>
    </Modal>
  );
};
