"use client";

import { useCallback, useEffect, useState } from "react";
import { THEME_STORAGE_KEY, type ThemeSkin } from "@/lib/constants";

export function useThemeSkin() {
  const [skin, setSkinState] = useState<ThemeSkin>("standard");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const stored = (localStorage.getItem(THEME_STORAGE_KEY) as ThemeSkin) ?? "standard";
    setSkinState(stored);
    document.documentElement.setAttribute("data-theme", stored);
    setMounted(true);
  }, []);

  const setSkin = useCallback((next: ThemeSkin) => {
    try {
      localStorage.setItem(THEME_STORAGE_KEY, next);
    } catch {}
    document.documentElement.setAttribute("data-theme", next);
    setSkinState(next);
  }, []);

  return { skin, setSkin, mounted };
}
