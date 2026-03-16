"use client";

import React, { createContext, useCallback, useContext, useState } from "react";

interface ShellContextValue {
  isOpen: boolean;
  toggle: () => void;
  open: () => void;
  close: () => void;
}

const ShellContext = createContext<ShellContextValue>({
  isOpen: false,
  toggle: () => {},
  open: () => {},
  close: () => {},
});

export function ShellProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);

  const toggle = useCallback(() => setIsOpen((prev) => !prev), []);
  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);

  return (
    <ShellContext.Provider value={{ isOpen, toggle, open, close }}>
      {children}
    </ShellContext.Provider>
  );
}

export function useShellPanel() {
  return useContext(ShellContext);
}
