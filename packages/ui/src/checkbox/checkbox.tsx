"use client";

import { cn } from "../lib/utils";
import { forwardRef, type InputHTMLAttributes } from "react";

export interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {}

const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, ...props }, ref) => {
    return (
      <input
        type="checkbox"
        ref={ref}
        className={cn(
          "rounded border-border accent-primary cursor-pointer disabled:cursor-not-allowed disabled:opacity-50",
          className,
        )}
        {...props}
      />
    );
  },
);

Checkbox.displayName = "Checkbox";

export { Checkbox };
