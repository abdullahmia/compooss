import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";
import { forwardRef, type InputHTMLAttributes, type ReactNode } from "react";

const inputVariants = cva(
  "text-foreground outline-hidden transition-colors placeholder:text-muted-foreground disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default:
          "w-full bg-secondary text-sm font-mono px-3 py-2 rounded-sm border border-border focus:border-primary focus:ring-1 focus:ring-primary/30",
        search:
          "bg-transparent text-xs placeholder:text-muted-foreground w-full",
        mono:
          "bg-secondary text-xs font-mono px-2 py-1 rounded-sm border border-border focus:border-primary w-full",
      },
      inputSize: {
        sm: "text-xs py-1 px-2",
        md: "text-sm py-2 px-3",
        lg: "text-sm py-2.5 px-4",
      },
    },
    defaultVariants: {
      variant: "default",
      inputSize: "md",
    },
  }
);

export interface InputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "size">,
    VariantProps<typeof inputVariants> {
  icon?: ReactNode;
  iconPosition?: "left" | "right";
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, variant, inputSize, icon, iconPosition = "left", ...props }, ref) => {
    if (icon) {
      return (
        <div
          className={cn(
            "flex items-center gap-2",
            variant === "search" &&
              "bg-secondary rounded-sm px-2 py-1.5",
            className
          )}
        >
          {iconPosition === "left" && (
            <span className="text-muted-foreground shrink-0 flex items-center">
              {icon}
            </span>
          )}
          <input
            ref={ref}
            className={cn(inputVariants({ variant, inputSize }), "flex-1")}
            {...props}
          />
          {iconPosition === "right" && (
            <span className="text-muted-foreground shrink-0 flex items-center">
              {icon}
            </span>
          )}
        </div>
      );
    }

    return (
      <input
        ref={ref}
        className={cn(inputVariants({ variant, inputSize }), className)}
        {...props}
      />
    );
  }
);

Input.displayName = "Input";

export { Input, inputVariants };
