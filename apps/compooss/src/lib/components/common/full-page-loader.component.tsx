"use client";

import { Leaf } from "lucide-react";

export const FullPageLoader: React.FC = () => {
  return (
    <div className="h-screen w-full flex flex-col items-center justify-center bg-background gap-6">
      <div className="relative flex items-center justify-center">
        <div className="absolute w-16 h-16 rounded-full border-2 border-primary/20 border-t-primary animate-spin" />
        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center animate-pulse">
          <Leaf className="h-4 w-4 text-primary" />
        </div>
      </div>

      <div className="flex flex-col items-center gap-1.5">
        <p className="text-sm font-medium text-foreground">Establishing your workspace</p>
        <p className="text-xs text-muted-foreground">Verifying connection & loading your data</p>
        <div className="flex gap-1 mt-1">
          <span className="w-1.5 h-1.5 rounded-full bg-primary/60 animate-bounce [animation-delay:0ms]" />
          <span className="w-1.5 h-1.5 rounded-full bg-primary/60 animate-bounce [animation-delay:150ms]" />
          <span className="w-1.5 h-1.5 rounded-full bg-primary/60 animate-bounce [animation-delay:300ms]" />
        </div>
      </div>
    </div>
  );
};
