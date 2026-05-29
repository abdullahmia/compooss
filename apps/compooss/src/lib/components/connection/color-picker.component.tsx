"use client";

import { CONNECTION_COLORS } from "@compooss/types";
import { cn } from "@compooss/ui";

type Props = {
  value?: string;
  onChange: (color: string | undefined) => void;
};

export const ColorPicker: React.FC<Props> = ({ value, onChange }) => {
  return (
    <div className="flex items-center gap-2 p-1.5 rounded-xl bg-black/[0.03] dark:bg-white/[0.04] border border-black/[0.05] dark:border-white/[0.06]">
      {/* None option */}
      <button
        type="button"
        onClick={() => onChange(undefined)}
        title="No color"
        className={cn(
          "relative w-6 h-6 rounded-lg transition-all duration-150 overflow-hidden shrink-0",
          !value
            ? "ring-2 ring-offset-1 ring-foreground/30 scale-110"
            : "hover:scale-105 opacity-60 hover:opacity-100",
        )}
        style={{
          background:
            "repeating-linear-gradient(-45deg, transparent, transparent 3px, hsl(var(--border)) 3px, hsl(var(--border)) 4px)",
          backgroundColor: "hsl(var(--muted))",
        }}
      />

      {/* Divider */}
      <div className="w-px h-4 bg-black/[0.08] dark:bg-white/[0.08] shrink-0" />

      {/* Color swatches */}
      {CONNECTION_COLORS.map((color) => (
        <button
          key={color}
          type="button"
          onClick={() => onChange(color)}
          title={color}
          className={cn(
            "w-6 h-6 rounded-lg transition-all duration-150 shrink-0",
            value === color ? "scale-110" : "hover:scale-105",
          )}
          style={{
            backgroundColor: color,
            boxShadow:
              value === color
                ? `0 0 0 2px hsl(var(--background)), 0 0 0 3.5px ${color}`
                : `0 1px 3px ${color}50`,
          }}
        />
      ))}
    </div>
  );
};
