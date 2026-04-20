"use client";

import { EmptyState } from "@compooss/ui";
import { Share2 } from "lucide-react";

type Props = {
  title: string;
  description: string;
  actionLabel: string;
  onAction: () => void;
};

export const DiagramEmpty: React.FC<Props> = ({
  title,
  description,
  actionLabel,
  onAction,
}) => {
  return (
    <div className="flex flex-1 items-center justify-center h-full">
      <EmptyState
        icon={<Share2 className="h-12 w-12 text-muted-foreground" />}
        title={title}
        description={description}
        primaryAction={{ label: actionLabel, onClick: onAction }}
      />
    </div>
  );
};
