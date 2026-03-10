import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";
import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from "react";

const iconButtonVariants = cva(
  "inline-flex items-center justify-center transition-colors disabled:pointer-events-none disabled:opacity-50 shrink-0 cursor-pointer",
  {
    variants: {
      variant: {
        default:
          "text-muted-foreground hover:text-foreground rounded-sm hover:bg-secondary",
        ghost:
          "text-muted-foreground hover:text-foreground",
        toolbar:
          "text-muted-foreground hover:text-primary rounded-sm hover:bg-sidebar-accent",
        active:
          "bg-primary/15 text-primary rounded-sm",
        danger:
          "text-muted-foreground hover:text-destructive rounded-sm hover:bg-secondary",
      },
      size: {
        sm: "p-1",
        md: "p-1.5",
        lg: "p-2",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  }
);

export interface IconButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof iconButtonVariants> {
  icon: ReactNode;
  label?: string;
}

const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ className, variant, size, icon, label, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(iconButtonVariants({ variant, size }), className)}
        title={label}
        aria-label={label}
        {...props}
      >
        {icon}
      </button>
    );
  }
);

IconButton.displayName = "IconButton";

export { IconButton, iconButtonVariants };
