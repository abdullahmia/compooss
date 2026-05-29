export const THEME_STORAGE_KEY = "compooss-theme";

export type ThemeSkin =
  | "standard"
  | "retro"
  | "midnight"
  | "dracula"
  | "solarized"
  | "nord"
  | "mono"
  | "rose";

export type ThemeOption = {
  id: ThemeSkin;
  label: string;
  description: string;
  pattern: { corners: "sharp" | "soft" | "rounded" | "pill"; font: "Sans" | "Mono" };
  swatch: { bg: string; primary: string; accent: string };
};

export const THEME_OPTIONS: ThemeOption[] = [
  {
    id: "standard",
    label: "Standard",
    description: "Cool slate with an emerald accent — the default Compooss look.",
    pattern: { corners: "soft", font: "Sans" },
    swatch: { bg: "hsl(200 10% 12%)", primary: "hsl(145 63% 42%)", accent: "hsl(200 10% 20%)" },
  },
  {
    id: "retro",
    label: "Retro",
    description: "Warm vintage terminal — amber on sepia, sharp corners, monospace.",
    pattern: { corners: "sharp", font: "Mono" },
    swatch: { bg: "hsl(25 18% 10%)", primary: "hsl(28 80% 55%)", accent: "hsl(35 25% 25%)" },
  },
  {
    id: "midnight",
    label: "Midnight",
    description: "Deep indigo with a bright blue accent and generously rounded corners.",
    pattern: { corners: "rounded", font: "Sans" },
    swatch: { bg: "hsl(230 25% 9%)", primary: "hsl(220 90% 62%)", accent: "hsl(250 70% 65%)" },
  },
  {
    id: "dracula",
    label: "Dracula",
    description: "The cult purple-and-pink dark palette.",
    pattern: { corners: "soft", font: "Sans" },
    swatch: { bg: "hsl(231 15% 18%)", primary: "hsl(265 89% 78%)", accent: "hsl(326 100% 74%)" },
  },
  {
    id: "solarized",
    label: "Solarized",
    description: "The classic low-contrast tan & teal palette by Ethan Schoonover.",
    pattern: { corners: "sharp", font: "Sans" },
    swatch: { bg: "hsl(192 100% 11%)", primary: "hsl(205 69% 49%)", accent: "hsl(175 59% 40%)" },
  },
  {
    id: "nord",
    label: "Nord",
    description: "Arctic, muted blue-grey frost. Calm and rounded.",
    pattern: { corners: "rounded", font: "Sans" },
    swatch: { bg: "hsl(220 16% 22%)", primary: "hsl(213 32% 52%)", accent: "hsl(179 25% 65%)" },
  },
  {
    id: "mono",
    label: "Mono",
    description: "Pure grayscale, zero chroma, flat square corners. Maximum focus.",
    pattern: { corners: "sharp", font: "Sans" },
    swatch: { bg: "hsl(0 0% 8%)", primary: "hsl(0 0% 92%)", accent: "hsl(0 0% 55%)" },
  },
  {
    id: "rose",
    label: "Rosé",
    description: "Warm rose & coral sunset with extra-rounded, pill-like corners.",
    pattern: { corners: "pill", font: "Sans" },
    swatch: { bg: "hsl(340 20% 10%)", primary: "hsl(340 82% 66%)", accent: "hsl(20 90% 65%)" },
  },
] as const;
