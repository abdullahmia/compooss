"use client";

import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";

type ViewTransition = {
  ready: Promise<void>;
  finished: Promise<void>;
};

export const ThemeSwitcher: React.FC = () => {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => setMounted(true), []);

  if (!mounted) return <div className="w-8 h-8" />;

  const handleToggle = (e: React.MouseEvent<HTMLButtonElement>) => {
    const newTheme = theme === "dark" ? "light" : "dark";

    if (!("startViewTransition" in document)) {
      setTheme(newTheme);
      return;
    }

    const x = e.clientX;
    const y = e.clientY;
    const maxRadius = Math.hypot(
      Math.max(x, window.innerWidth - x),
      Math.max(y, window.innerHeight - y)
    );

    const isDarkToLight = theme === "dark";

    if (isDarkToLight) {
      document.documentElement.dataset.themeTransition = "dark-to-light";
    } else {
      delete document.documentElement.dataset.themeTransition;
    }

    const transition = (
      document as Document & {
        startViewTransition: (cb: () => void) => ViewTransition;
      }
    ).startViewTransition(() => setTheme(newTheme));

    transition.finished.then(() => {
      delete document.documentElement.dataset.themeTransition;
    });

    transition.ready.then(() => {
      if (isDarkToLight) {
        document.documentElement.animate(
          {
            clipPath: [
              `circle(${maxRadius}px at ${x}px ${y}px)`,
              `circle(0px at ${x}px ${y}px)`,
            ],
          },
          {
            duration: 480,
            easing: "ease-in-out",
            fill: "forwards",
            pseudoElement: "::view-transition-old(root)",
          }
        );
      } else {
        document.documentElement.animate(
          {
            clipPath: [
              `circle(0px at ${x}px ${y}px)`,
              `circle(${maxRadius}px at ${x}px ${y}px)`,
            ],
          },
          {
            duration: 480,
            easing: "ease-in-out",
            fill: "forwards",
            pseudoElement: "::view-transition-new(root)",
          }
        );
      }
    });
  };

  return (
    <button
      onClick={handleToggle}
      className="w-8 h-8 flex items-center justify-center rounded-md cursor-pointer hover:bg-secondary transition-colors text-foreground"
      aria-label="Toggle theme"
    >
      {theme === "dark" ? (
        <Sun className="h-4 w-4" />
      ) : (
        <Moon className="h-4 w-4" />
      )}
    </button>
  );
};
