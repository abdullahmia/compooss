import { Palette } from "lucide-react";

export const AppearanceSettings: React.FC = () => {
  return (
    <div>
      <h3 className="text-xs font-semibold text-foreground mb-3 flex items-center gap-1.5">
        <Palette className="h-3.5 w-3.5 text-primary" />
        Appearance
      </h3>
      <div className="grid grid-cols-3 gap-2">
        {["Dark", "Light", "System"].map((theme) => (
          <button
            key={theme}
            className={`p-3 rounded-sm border text-xs font-medium transition-colors ${
              theme === "Dark"
                ? "border-primary bg-primary/15 text-primary"
                : "border-border text-muted-foreground hover:border-primary/30 hover:text-foreground"
            }`}
          >
            {theme}
          </button>
        ))}
      </div>
      <p className="text-[10px] text-muted-foreground mt-3">
        Choose your preferred theme. Currently using the dark theme.
      </p>
    </div>
  );
};
