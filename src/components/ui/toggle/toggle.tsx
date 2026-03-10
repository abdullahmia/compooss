import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";
import { forwardRef, type ButtonHTMLAttributes } from "react";

const toggleVariants = cva(
  "relative inline-flex shrink-0 cursor-pointer rounded-full transition-colors disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "",
        primary: "",
      },
      size: {
        sm: "w-7 h-4",
        md: "w-8 h-[18px]",
        lg: "w-10 h-5",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  }
);

const thumbSizeMap = {
  sm: "w-3 h-3",
  md: "w-3.5 h-3.5",
  lg: "w-4 h-4",
} as const;

const thumbTranslateMap = {
  sm: "translate-x-[13px]",
  md: "translate-x-[17px]",
  lg: "translate-x-[21px]",
} as const;

export interface ToggleProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "onChange">,
    VariantProps<typeof toggleVariants> {
  checked?: boolean;
  onChange?: (checked: boolean) => void;
  label?: string;
}

const Toggle = forwardRef<HTMLButtonElement, ToggleProps>(
  ({ className, variant, size = "md", checked = false, onChange, label, disabled, ...props }, ref) => {
    const resolvedSize = size ?? "md";

    return (
      <button
        ref={ref}
        type="button"
        role="switch"
        aria-checked={checked}
        aria-label={label}
        disabled={disabled}
        onClick={() => onChange?.(!checked)}
        className={cn(
          toggleVariants({ variant, size }),
          checked ? "bg-primary" : "bg-secondary border border-border",
          className
        )}
        {...props}
      >
        <span
          className={cn(
            "block rounded-full bg-primary-foreground absolute top-[1px] transition-transform",
            thumbSizeMap[resolvedSize],
            checked ? thumbTranslateMap[resolvedSize] : "translate-x-[1px]"
          )}
        />
      </button>
    );
  }
);

Toggle.displayName = "Toggle";

export { Toggle, toggleVariants };
