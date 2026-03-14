import { cn } from "../lib/utils";
import { cva, type VariantProps } from "class-variance-authority";
import { forwardRef, type HTMLAttributes } from "react";

const badgeVariants = cva(
  "inline-flex items-center font-normal transition-colors",
  {
    variants: {
      variant: {
        default:
          "bg-primary/15 text-primary",
        subtle:
          "text-muted-foreground",
        success:
          "bg-success/15 text-success",
        warning:
          "bg-warning/15 text-warning",
        destructive:
          "bg-destructive/15 text-destructive",
        info:
          "bg-info/15 text-info",
        outline:
          "border border-border text-muted-foreground",
      },
      size: {
        sm: "text-[10px] px-1.5 py-0.5 rounded-sm",
        md: "text-xs px-2 py-0.5 rounded-sm",
        lg: "text-xs px-2.5 py-1 rounded-sm",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "sm",
    },
  }
);

export interface BadgeProps
  extends HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <span
        ref={ref}
        className={cn(badgeVariants({ variant, size }), className)}
        {...props}
      />
    );
  }
);

Badge.displayName = "Badge";

export { Badge, badgeVariants };
