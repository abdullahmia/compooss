"use client";

import { CONNECTION_COLORS } from "@compooss/types";
import { cn } from "@compooss/ui";
import { Check } from "lucide-react";

interface ColorPickerProps {
  value?: string;
  onChange: (color: string | undefined) => void;
}

export function ColorPicker({ value, onChange }: ColorPickerProps) {
  return (
    <div className="flex items-center gap-1.5">
      <button
        type="button"
        onClick={() => onChange(undefined)}
        className={cn(
          "w-5 h-5 rounded-full border-2 transition-all flex items-center justify-center",
          !value
            ? "border-foreground bg-background"
            : "border-border bg-background hover:border-muted-foreground",
        )}
        title="No color"
      >
        {!value && <Check className="h-3 w-3 text-foreground" />}
      </button>
      {CONNECTION_COLORS.map((color) => (
        <button
          key={color}
          type="button"
          onClick={() => onChange(color)}
          className={cn(
            "w-5 h-5 rounded-full border-2 transition-all flex items-center justify-center",
            value === color
              ? "border-foreground scale-110"
              : "border-transparent hover:scale-110",
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
}
