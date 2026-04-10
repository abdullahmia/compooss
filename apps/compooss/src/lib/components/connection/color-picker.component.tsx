"use client";

import { CONNECTION_COLORS } from "@compooss/types";
import { cn } from "@compooss/ui";
import { Check, X } from "lucide-react";

type Props = {
  value?: string;
  onChange: (color: string | undefined) => void;
};

export const ColorPicker: React.FC<Props> = ({ value, onChange }) => {
  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        onClick={() => onChange(undefined)}
        className={cn(
          "w-6 h-6 rounded-lg border-2 transition-all flex items-center justify-center",
          !value
            ? "border-foreground/50 bg-background"
            : "border-border bg-background hover:border-muted-foreground",
        )}
        title="No color"
      >
        {!value ? (
          <X className="h-3 w-3 text-muted-foreground" />
        ) : null}
      </button>
      {CONNECTION_COLORS.map((color) => (
        <button
          key={color}
          type="button"
          onClick={() => onChange(color)}
          className={cn(
            "w-6 h-6 rounded-lg border-2 transition-all flex items-center justify-center",
            value === color
              ? "border-white/40 scale-110 shadow-sm"
              : "border-transparent hover:scale-110 hover:shadow-sm",
          )}
          style={{ backgroundColor: color }}
          title={color}
        >
          {value === color && (
            <Check className="h-3 w-3 text-white drop-shadow-sm" />
          )}
        </button>
      ))}
    </div>
  );
};
