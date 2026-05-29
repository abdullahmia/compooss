"use client";

import { THEME_OPTIONS } from "@/lib/constants";
import { useThemeSkin } from "@/lib/hooks/use-theme-skin.hook";
import { Monitor, Moon, Palette, Sun } from "lucide-react";
import { useTheme } from "next-themes";

const MODES = [
  { label: "Light", value: "light", icon: <Sun className="h-3.5 w-3.5" /> },
  { label: "Dark", value: "dark", icon: <Moon className="h-3.5 w-3.5" /> },
  { label: "System", value: "system", icon: <Monitor className="h-3.5 w-3.5" /> },
] as const;

const CORNER_LABEL: Record<string, string> = {
  sharp: "Sharp",
  soft: "Soft",
  rounded: "Rounded",
  pill: "Pill",
};

export const AppearanceSettings: React.FC = () => {
  const { theme, setTheme } = useTheme();
  const { skin, setSkin, mounted } = useThemeSkin();

  return (
    <div className="space-y-6">
      {/* ── Mode ── */}
      <div>
        <h3 className="text-xs font-semibold text-foreground mb-3 flex items-center gap-1.5">
          <Sun className="h-3.5 w-3.5 text-primary" />
          Mode
        </h3>
        <div className="grid grid-cols-3 gap-2">
          {MODES.map(({ label, value, icon }) => (
            <button
              key={value}
              onClick={() => setTheme(value)}
              className={`flex items-center justify-center gap-1.5 p-3 rounded-sm border text-xs font-medium transition-colors ${
                theme === value
                  ? "border-primary bg-primary/15 text-primary"
                  : "border-border text-muted-foreground hover:border-primary/30 hover:text-foreground"
              }`}
            >
              {icon}
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* ── Theme ── */}
      <div>
        <h3 className="text-xs font-semibold text-foreground mb-3 flex items-center gap-1.5">
          <Palette className="h-3.5 w-3.5 text-primary" />
          Theme
        </h3>
        {!mounted ? (
          <div className="grid grid-cols-2 gap-2">
            {Array.from({ length: THEME_OPTIONS.length }).map((_, i) => (
              <div key={i} className="h-20 rounded-sm border border-border bg-muted animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-2">
            {THEME_OPTIONS.map((option) => {
              const isActive = skin === option.id;
              return (
                <button
                  key={option.id}
                  onClick={() => setSkin(option.id)}
                  className={`group relative flex flex-col gap-2 p-3 rounded-sm border text-left transition-colors ${
                    isActive
                      ? "border-primary bg-primary/10"
                      : "border-border hover:border-primary/30 hover:bg-muted/50"
                  }`}
                >
                  {/* Swatch row */}
                  <div className="flex items-center gap-1.5">
                    <span
                      className="w-6 h-6 rounded-sm shrink-0 border border-white/10"
                      style={{ backgroundColor: option.swatch.bg }}
                    />
                    <span
                      className="w-4 h-4 rounded-full shrink-0"
                      style={{ backgroundColor: option.swatch.primary }}
                    />
                    <span
                      className="w-3 h-3 rounded-full shrink-0"
                      style={{ backgroundColor: option.swatch.accent }}
                    />
                    {isActive && (
                      <span className="ml-auto w-1.5 h-1.5 rounded-full bg-primary" />
                    )}
                  </div>

                  {/* Label + pattern badge */}
                  <div>
                    <p className={`text-xs font-semibold leading-none ${isActive ? "text-primary" : "text-foreground"}`}>
                      {option.label}
                    </p>
                    <p className="text-[10px] text-muted-foreground mt-0.5">
                      {CORNER_LABEL[option.pattern.corners]} · {option.pattern.font}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        )}
        <p className="text-[10px] text-muted-foreground mt-3">
          Theme and mode are independent pick any combination.
        </p>
      </div>
    </div>
  );
};
