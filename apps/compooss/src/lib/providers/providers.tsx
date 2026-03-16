"use client";

import { queryClient } from "@/lib/config/query.config";
import { QueryClientProvider } from "@tanstack/react-query";
import React from "react";
import { Toaster } from "sonner";
import { ShellProvider } from "./shell-provider";

export const Providers: React.FC<React.PropsWithChildren> = ({ children }) => {
  return (
    <QueryClientProvider client={queryClient}>
      <ShellProvider>
        {children}
      </ShellProvider>
      <Toaster position="top-right" />
    </QueryClientProvider>
  );
};
