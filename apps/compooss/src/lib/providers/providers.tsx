"use client";

import { queryClient } from "@/lib/config/query.config";
import { QueryClientProvider } from "@tanstack/react-query";
import React from "react";
import { Toaster } from "sonner";
import { ConnectionProvider } from "./connection-provider";
import { ShellProvider } from "./shell-provider";

export const Providers: React.FC<React.PropsWithChildren> = ({ children }) => {
  return (
    <QueryClientProvider client={queryClient}>
      <ConnectionProvider>
        <ShellProvider>{children}</ShellProvider>
      </ConnectionProvider>
      <Toaster position="top-right" />
    </QueryClientProvider>
  );
};
