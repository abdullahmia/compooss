"use client";

import { THEME_OPTIONS } from "@/lib/constants";
import { useThemeSkin } from "@/lib/hooks/use-theme-skin.hook";
import { Check, Monitor, Moon, Palette, Sun } from "lucide-react";
import { useTheme } from "next-themes";

const MODES = [
  { label: "Light", value: "light", icon: Sun },
  { label: "Dark", value: "dark", icon: Moon },
  { label: "System", value: "system", icon: Monitor },
] as const;

const CORNER_LABEL: Record<string, string> = {
  sharp: "Sharp",
  soft: "Soft",
  rounded: "Rounded",
  pill: "Pill",
};

type SwatchColors = { bg: string; primary: string; accent: string };

const ThemePreview: React.FC<SwatchColors> = ({ bg, primary, accent }) => (
  <div className="relative h-[60px] w-full overflow-hidden flex shrink-0" style={{ backgroundColor: bg }}>
    {/* Sidebar column */}
    <div className="relative w-8 h-full shrink-0">
      <div className="absolute inset-0 opacity-[0.18]" style={{ backgroundColor: primary }} />
      <div className="relative flex flex-col items-center pt-2 pb-1.5 gap-1.5">
        <div className="w-3.5 h-3.5 rounded-sm" style={{ backgroundColor: primary }} />
        <div className="w-5 h-[2.5px] rounded-full opacity-35" style={{ backgroundColor: primary }} />
        <div className="w-5 h-[2.5px] rounded-full opacity-20" style={{ backgroundColor: primary }} />
        <div className="w-5 h-[2.5px] rounded-full opacity-20" style={{ backgroundColor: primary }} />
      </div>
    </div>

    {/* Sidebar divider */}
    <div className="w-px h-full opacity-20 shrink-0" style={{ backgroundColor: primary }} />

    {/* Main area */}
    <div className="flex flex-col flex-1 overflow-hidden">
      {/* Topbar */}
      <div className="relative flex items-center gap-1.5 px-2 h-6 shrink-0">
        <div className="absolute inset-0 opacity-10" style={{ backgroundColor: primary }} />
        <div className="relative flex-1 h-[2.5px] rounded-full opacity-20" style={{ backgroundColor: primary }} />
        <div className="relative w-5 h-[2.5px] rounded-full opacity-50" style={{ backgroundColor: accent }} />
        <div className="relative w-2.5 h-2.5 rounded-full opacity-70" style={{ backgroundColor: accent }} />
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 px-2 pt-1.5 pb-1 gap-1.5">
        <div className="flex gap-1 items-center">
          <div className="h-[2.5px] flex-1 rounded-full opacity-15" style={{ backgroundColor: primary }} />
          <div className="h-[2.5px] w-6 rounded-full opacity-10" style={{ backgroundColor: primary }} />
        </div>
        <div className="h-[2.5px] w-2/3 rounded-full opacity-10" style={{ backgroundColor: primary }} />
        <div className="mt-auto flex gap-1 items-center">
          <div className="h-[9px] w-8 rounded-sm" style={{ backgroundColor: primary }} />
          <div className="h-[9px] w-5 rounded-sm opacity-40" style={{ backgroundColor: accent }} />
        </div>
      </div>
    </div>
  </div>
);

export const AppearanceSettings: React.FC = () => {
  const { theme, setTheme } = useTheme();
  const { skin, setSkin, mounted } = useThemeSkin();

  const activeOption = THEME_OPTIONS.find((o) => o.id === skin);

  return (
    <div className="space-y-7">
      {/* ── Mode ── */}
      <div className="space-y-2.5">
        <h3 className="text-xs font-semibold text-foreground flex items-center gap-1.5">
          <Sun className="h-3.5 w-3.5 text-primary" />
          Mode
        </h3>
        <div className="flex items-center p-1 bg-muted rounded-lg gap-0.5">
          {MODES.map(({ label, value, icon: Icon }) => (
            <button
              key={value}
              onClick={() => setTheme(value)}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-md text-xs font-medium transition-all duration-150 ${
                theme === value
                  ? "bg-card text-foreground shadow-sm border border-border/50"
                  : "text-muted-foreground hover:text-foreground hover:bg-card/40"
              }`}
            >
              <Icon className="h-3.5 w-3.5" />
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* ── Theme ── */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-semibold text-foreground flex items-center gap-1.5">
            <Palette className="h-3.5 w-3.5 text-primary" />
            Theme
          </h3>
          {mounted && activeOption && (
            <span className="text-[10px] font-medium text-primary bg-primary/10 px-2 py-0.5 rounded-full">
              {activeOption.label}
            </span>
          )}
        </div>

        {!mounted ? (
          <div className="grid grid-cols-3 gap-2">
            {Array.from({ length: THEME_OPTIONS.length }).map((_, i) => (
              <div key={i} className="h-[94px] rounded-lg border border-border bg-muted animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-2">
            {THEME_OPTIONS.map((option) => {
              const isActive = skin === option.id;
              return (
                <button
                  key={option.id}
                  onClick={() => setSkin(option.id)}
                  className={`group relative flex flex-col overflow-hidden rounded-lg border text-left transition-all duration-200 ${
                    isActive
                      ? "border-primary ring-1 ring-primary/20 shadow-md"
                      : "border-border hover:border-primary/40 hover:shadow-sm"
                  }`}
                >
                  <ThemePreview {...option.swatch} />

                  {/* Active check */}
                  {isActive ? (
                    <span className="absolute top-1.5 right-1.5 flex h-[18px] w-[18px] items-center justify-center rounded-full bg-primary shadow">
                      <Check className="h-2.5 w-2.5 text-primary-foreground" strokeWidth={3} />
                    </span>
                  ) : (
                    <span className="absolute top-1.5 right-1.5 flex h-[18px] w-[18px] items-center justify-center rounded-full border border-white/25 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-150" />
                  )}

                  {/* Label + badges */}
                  <div className="flex items-center justify-between px-2.5 py-2 bg-card border-t border-border/40">
                    <div className="flex flex-col gap-1 min-w-0">
                      <p className={`text-xs font-semibold leading-none truncate ${isActive ? "text-primary" : "text-foreground"}`}>
                        {option.label}
                      </p>
                      <div className="flex items-center gap-1">
                        <span className="text-[9px] leading-none font-medium text-muted-foreground bg-muted px-1 py-0.5 rounded-sm">
                          {CORNER_LABEL[option.pattern.corners]}
                        </span>
                        <span className="text-[9px] leading-none font-medium text-muted-foreground bg-muted px-1 py-0.5 rounded-sm">
                          {option.pattern.font}
                        </span>
                      </div>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        )}

        <p className="text-[10px] text-muted-foreground">
          Theme and mode are independent pick any combination.
        </p>
      </div>
    </div>
  );
};
