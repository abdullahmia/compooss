import type { Meta, StoryObj } from "@storybook/react";
import { ArrowRight, Plus, Save, Trash2 } from "lucide-react";
import { Button } from "./button";

const meta = {
  title: "UI/Button",
  component: Button,
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: ["primary", "ghost"],
    },
    iconPosition: {
      control: "select",
      options: ["left", "right"],
    },
    loading: { control: "boolean" },
    disabled: { control: "boolean" },
    children: { control: "text" },
  },
  args: {
    children: "Button",
    loading: false,
    disabled: false,
    iconPosition: "left",
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

// ─── Playground ───────────────────────────────────────────────────────────────

/** Fully interactive — tweak every prop from the Controls panel. */
export const Playground: Story = {
  args: {
    variant: "primary",
    children: "Click me",
  },
};

// ─── Variants ─────────────────────────────────────────────────────────────────

export const Primary: Story = {
  args: {
    variant: "primary",
    children: "Primary",
  },
};

export const Ghost: Story = {
  args: {
    variant: "ghost",
    children: "Save as favorite",
    icon: <Plus className="h-3.5 w-3.5" />,
  },
};

// ─── Loading states ───────────────────────────────────────────────────────────

export const PrimaryLoading: Story = {
  args: {
    variant: "primary",
    loading: true,
    children: "Saving…",
  },
};

export const GhostLoading: Story = {
  args: {
    variant: "ghost",
    loading: true,
    children: "Uploading…",
  },
};

// ─── Disabled states ──────────────────────────────────────────────────────────

export const PrimaryDisabled: Story = {
  args: {
    variant: "primary",
    disabled: true,
    children: "Disabled",
  },
};

export const GhostDisabled: Story = {
  args: {
    variant: "ghost",
    disabled: true,
    children: "Disabled",
    icon: <Plus className="h-3.5 w-3.5" />,
  },
};

// ─── Icon — left (default) ────────────────────────────────────────────────────

export const PrimaryIconLeft: Story = {
  args: {
    variant: "primary",
    icon: <Save className="h-3.5 w-3.5" />,
    iconPosition: "left",
    children: "Save",
  },
};

export const GhostIconLeft: Story = {
  args: {
    variant: "ghost",
    icon: <Plus className="h-3.5 w-3.5" />,
    iconPosition: "left",
    children: "Add item",
  },
};

// ─── Icon — right ─────────────────────────────────────────────────────────────

export const PrimaryIconRight: Story = {
  args: {
    variant: "primary",
    icon: <ArrowRight className="h-3.5 w-3.5" />,
    iconPosition: "right",
    children: "Continue",
  },
};

export const GhostIconRight: Story = {
  args: {
    variant: "ghost",
    icon: <ArrowRight className="h-3.5 w-3.5" />,
    iconPosition: "right",
    children: "See all",
  },
};

// ─── Icon + Loading (icon is replaced by spinner) ─────────────────────────────

export const PrimaryIconLoading: Story = {
  name: "Primary · Icon + Loading",
  args: {
    variant: "primary",
    icon: <Save className="h-3.5 w-3.5" />,
    loading: true,
    children: "Saving…",
  },
};

export const GhostIconLoading: Story = {
  name: "Ghost · Icon + Loading",
  args: {
    variant: "ghost",
    icon: <Plus className="h-3.5 w-3.5" />,
    loading: true,
    children: "Adding…",
  },
};

// ─── Destructive-flavoured (className override) ───────────────────────────────

/** Shows how `className` can override colours without a new variant. */
export const PrimaryDanger: Story = {
  name: "Primary · Danger (className override)",
  args: {
    variant: "primary",
    icon: <Trash2 className="h-3.5 w-3.5" />,
    iconPosition: "left",
    children: "Delete",
    className: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
  },
};

// ─── All variants at a glance ─────────────────────────────────────────────────

/** Visual reference — all meaningful states side by side. */
export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-col gap-6 p-6">
      {/* Primary row */}
      <div className="flex flex-wrap items-center gap-3">
        <Button variant="primary">Primary</Button>
        <Button variant="primary" icon={<Save className="h-3.5 w-3.5" />}>Icon left</Button>
        <Button variant="primary" icon={<ArrowRight className="h-3.5 w-3.5" />} iconPosition="right">Icon right</Button>
        <Button variant="primary" loading>Loading</Button>
        <Button variant="primary" disabled>Disabled</Button>
        <Button
          variant="primary"
          icon={<Trash2 className="h-3.5 w-3.5" />}
          className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
        >
          Danger
        </Button>
      </div>

      {/* Ghost row */}
      <div className="flex flex-wrap items-center gap-4">
        <Button variant="ghost">Ghost</Button>
        <Button variant="ghost" icon={<Plus className="h-3.5 w-3.5" />}>Icon left</Button>
        <Button variant="ghost" icon={<ArrowRight className="h-3.5 w-3.5" />} iconPosition="right">Icon right</Button>
        <Button variant="ghost" loading>Loading</Button>
        <Button variant="ghost" disabled>Disabled</Button>
      </div>
    </div>
  ),
};