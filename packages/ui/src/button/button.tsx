import { cn } from "../lib/utils";
import { cva, type VariantProps } from "class-variance-authority";
import { Loader2 } from "lucide-react";
import { type ButtonHTMLAttributes, forwardRef, type ReactNode } from "react";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-1 font-normal cursor-pointer transition-colors disabled:pointer-events-none disabled:opacity-50 rounded-sm",
  {
    variants: {
      variant: {
        /**
         * Primary call-to-action button.
         * Matches solid primary buttons used for submits / confirmations.
         */
        primary:
          "bg-primary text-primary-foreground hover:bg-primary/90",

        /**
         * Low-emphasis text-style button.
         * Matches small textual buttons and links.
         */
        ghost: "text-primary hover:text-primary/80",

        /**
         * Secondary / cancel-style button.
         * Matches outlined cancel buttons in modals.
         */
        outline:
          "border border-border text-muted-foreground hover:text-foreground hover:bg-secondary",

        /**
         * Card-style button used for large, full-width navigation tiles
         * (e.g. feature cards on the welcome view).
         */
        card:
          "w-full justify-start text-left bg-card border border-border hover:border-primary/30 hover:bg-card/80",

        /**
         * Menu/list item button for dropdowns and command lists.
         */
        menu:
          "w-full justify-start text-left text-xs hover:bg-muted/50",
      },
      size: {
        sm: "px-2.5 py-1.5 text-xs",
        md: "px-4 py-2 text-xs",
        lg: "px-6 py-2.5 text-sm",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  },
);

export interface ButtonProps
  extends
    ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  loading?: boolean;
  icon?: ReactNode;
  iconPosition?: "left" | "right";
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      children,
      loading = false,
      icon,
      iconPosition = "left",
      disabled,
      ...props
    },
    ref,
  ) => {
    const isDisabled = disabled || loading;

    const resolvedIcon = loading ? (
      <Loader2 className="h-3.5 w-3.5 animate-spin" />
    ) : icon ? (
      <span className="flex items-center justify-center">{icon}</span>
    ) : null;

    return (
      <button
        ref={ref}
        disabled={isDisabled}
        className={cn(buttonVariants({ variant, size }), className)}
        {...props}
      >
        {iconPosition === "left" && resolvedIcon}
        {children}
        {iconPosition === "right" && resolvedIcon}
      </button>
    );
  },
);

Button.displayName = "Button";

export { Button, buttonVariants };
