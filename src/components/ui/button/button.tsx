import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";
import { Loader2 } from "lucide-react";
import { type ButtonHTMLAttributes, forwardRef, type ReactNode } from "react";

const buttonVariants = cva(
  "transition-colors font-normal disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        primary:
          "bg-primary text-primary-foreground px-6 py-2.5 rounded-sm text-sm hover:bg-primary/90",
        ghost:
          "text-xs text-primary hover:text-primary/80 flex items-center gap-0.5",
      },
    },
    defaultVariants: {
      variant: "primary",
    },
  }
);

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
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
      children,
      loading = false,
      icon,
      iconPosition = "left",
      disabled,
      ...props
    },
    ref
  ) => {
    const isDisabled = disabled || loading;

    const resolvedIcon = loading ? (
      <Loader2 className="h-3.5 w-3.5 animate-spin" />
    ) : icon ? (
      <span className="flex items-center justify-center">
        {icon}
      </span>
    ) : null;

    return (
      <button
        ref={ref}
        disabled={isDisabled}
        className={cn(
          buttonVariants({ variant }),
          "flex items-center gap-1",
          className
        )}
        {...props}
      >
        {iconPosition === "left" && resolvedIcon}
        {children}
        {iconPosition === "right" && resolvedIcon}
      </button>
    );
  }
);

Button.displayName = "Button";

export { Button, buttonVariants };
