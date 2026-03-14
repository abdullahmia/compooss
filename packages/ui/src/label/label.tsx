import { cn } from "../lib/utils";
import { cva, type VariantProps } from "class-variance-authority";
import { forwardRef, type LabelHTMLAttributes } from "react";

const labelVariants = cva("block text-muted-foreground", {
  variants: {
    variant: {
      default: "text-xs font-medium mb-1.5",
      uppercase:
        "text-xs font-semibold uppercase tracking-wider mb-2",
      hint: "text-[11px] mb-1",
    },
    size: {
      sm: "text-[10px]",
      md: "text-xs",
      lg: "text-sm",
    },
  },
  defaultVariants: {
    variant: "default",
    size: "md",
  },
});

export interface LabelProps
  extends LabelHTMLAttributes<HTMLLabelElement>,
    VariantProps<typeof labelVariants> {}

const Label = forwardRef<HTMLLabelElement, LabelProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <label
        ref={ref}
        className={cn(labelVariants({ variant, size }), className)}
        {...props}
      />
    );
  }
);

Label.displayName = "Label";

export { Label, labelVariants };
