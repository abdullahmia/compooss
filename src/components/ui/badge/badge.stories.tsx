import type { Meta, StoryObj } from "@storybook/react";
import { Badge } from "./badge";

const meta = {
  title: "UI/Badge",
  component: Badge,
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: ["default", "subtle", "success", "warning", "destructive", "info", "outline"],
    },
    size: {
      control: "select",
      options: ["sm", "md", "lg"],
    },
    children: { control: "text" },
  },
  args: {
    children: "Badge",
  },
} satisfies Meta<typeof Badge>;

export default meta;
type Story = StoryObj<typeof meta>;

// ─── Playground ───────────────────────────────────────────────────────────────

/** Fully interactive — tweak every prop from the Controls panel. */
export const Playground: Story = {
  args: {
    variant: "default",
    children: "Badge",
  },
};

// ─── Variants ─────────────────────────────────────────────────────────────────

export const Default: Story = {
  args: {
    variant: "default",
    children: "1,234 docs",
  },
};

export const Subtle: Story = {
  args: {
    variant: "subtle",
    children: "48.2 KB",
  },
};

export const Success: Story = {
  args: {
    variant: "success",
    children: "Connected",
  },
};

export const Warning: Story = {
  args: {
    variant: "warning",
    children: "Slow query",
  },
};

export const Destructive: Story = {
  args: {
    variant: "destructive",
    children: "Error",
  },
};

export const Info: Story = {
  args: {
    variant: "info",
    children: "3 indexes",
  },
};

export const Outline: Story = {
  args: {
    variant: "outline",
    children: "v7.0",
  },
};

// ─── Sizes ────────────────────────────────────────────────────────────────────

export const SizeSmall: Story = {
  name: "Size · Small",
  args: {
    variant: "default",
    size: "sm",
    children: "Small",
  },
};

export const SizeMedium: Story = {
  name: "Size · Medium",
  args: {
    variant: "default",
    size: "md",
    children: "Medium",
  },
};

export const SizeLarge: Story = {
  name: "Size · Large",
  args: {
    variant: "default",
    size: "lg",
    children: "Large",
  },
};

// ─── Real-world examples ──────────────────────────────────────────────────────

export const DocumentCount: Story = {
  name: "Example · Document Count",
  args: {
    variant: "default",
    size: "sm",
    children: "1,234 docs",
  },
};

export const CollectionSize: Story = {
  name: "Example · Collection Size",
  args: {
    variant: "subtle",
    size: "sm",
    children: "48.2 KB • 3 indexes • Avg: 256 B",
  },
};

export const DatabaseSize: Story = {
  name: "Example · Database Size",
  args: {
    variant: "subtle",
    size: "sm",
    children: "2.1 MB",
  },
};

// ─── All variants at a glance ─────────────────────────────────────────────────

/** Visual reference — all meaningful states side by side. */
export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-col gap-6 p-6">
      {/* Variants row */}
      <div>
        <p className="text-xs font-medium text-muted-foreground mb-3">Variants</p>
        <div className="flex flex-wrap items-center gap-3">
          <Badge variant="default">Default</Badge>
          <Badge variant="subtle">Subtle</Badge>
          <Badge variant="success">Success</Badge>
          <Badge variant="warning">Warning</Badge>
          <Badge variant="destructive">Destructive</Badge>
          <Badge variant="info">Info</Badge>
          <Badge variant="outline">Outline</Badge>
        </div>
      </div>

      {/* Sizes row */}
      <div>
        <p className="text-xs font-medium text-muted-foreground mb-3">Sizes</p>
        <div className="flex flex-wrap items-center gap-3">
          <Badge variant="default" size="sm">Small</Badge>
          <Badge variant="default" size="md">Medium</Badge>
          <Badge variant="default" size="lg">Large</Badge>
        </div>
      </div>

      {/* Real-world examples */}
      <div>
        <p className="text-xs font-medium text-muted-foreground mb-3">Real-world Usage</p>
        <div className="flex flex-wrap items-center gap-3">
          <Badge variant="default" size="sm">1,234 docs</Badge>
          <Badge variant="subtle" size="sm">48.2 KB</Badge>
          <Badge variant="success" size="sm">Connected</Badge>
          <Badge variant="warning" size="sm">Slow query</Badge>
          <Badge variant="destructive" size="sm">Error</Badge>
          <Badge variant="info" size="sm">3 indexes</Badge>
          <Badge variant="outline" size="sm">v7.0</Badge>
        </div>
      </div>
    </div>
  ),
};
