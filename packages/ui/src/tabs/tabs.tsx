import { cn } from "../lib/utils";
import { cva, type VariantProps } from "class-variance-authority";
import { type ReactNode } from "react";

const tabListVariants = cva("flex", {
  variants: {
    variant: {
      underline: "border-b border-border bg-tab-inactive",
      pill: "bg-muted/20 p-2 space-y-0.5 flex-col",
    },
  },
  defaultVariants: {
    variant: "underline",
  },
});

const tabTriggerVariants = cva(
  "flex items-center gap-1.5 text-xs font-medium transition-colors cursor-pointer disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        underline: "px-4 py-2 border-b-2",
        pill: "w-full px-3 py-2 rounded-sm",
      },
      active: {
        true: "",
        false: "",
      },
    },
    compoundVariants: [
      {
        variant: "underline",
        active: true,
        class: "border-primary text-primary bg-tab-active",
      },
      {
        variant: "underline",
        active: false,
        class:
          "border-transparent text-muted-foreground hover:text-foreground hover:bg-secondary/50",
      },
      {
        variant: "pill",
        active: true,
        class: "bg-primary/15 text-primary",
      },
      {
        variant: "pill",
        active: false,
        class: "text-muted-foreground hover:text-foreground hover:bg-secondary",
      },
    ],
    defaultVariants: {
      variant: "underline",
      active: false,
    },
  }
);

export interface TabItem {
  id: string;
  label: string;
  icon?: ReactNode;
  disabled?: boolean;
}

export interface TabsProps extends VariantProps<typeof tabListVariants> {
  items: TabItem[];
  activeTab: string;
  onTabChange: (id: string) => void;
  className?: string;
}

function Tabs({ items, activeTab, onTabChange, variant, className }: TabsProps) {
  return (
    <div className={cn(tabListVariants({ variant }), className)} role="tablist">
      {items.map((item) => (
        <button
          key={item.id}
          role="tab"
          aria-selected={activeTab === item.id}
          disabled={item.disabled}
          onClick={() => onTabChange(item.id)}
          className={cn(
            tabTriggerVariants({
              variant: variant ?? "underline",
              active: activeTab === item.id,
            })
          )}
        >
          {item.icon}
          {item.label}
        </button>
      ))}
    </div>
  );
}

Tabs.displayName = "Tabs";

export { Tabs, tabListVariants, tabTriggerVariants };
