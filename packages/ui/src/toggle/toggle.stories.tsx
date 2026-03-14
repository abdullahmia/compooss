import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { Toggle } from "./toggle";

const meta = {
  title: "UI/Toggle",
  component: Toggle,
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: ["default", "primary"],
    },
    size: {
      control: "select",
      options: ["sm", "md", "lg"],
    },
    checked: { control: "boolean" },
    disabled: { control: "boolean" },
    label: { control: "text" },
  },
  args: {
    checked: false,
    disabled: false,
    label: "Toggle",
  },
} satisfies Meta<typeof Toggle>;

export default meta;
type Story = StoryObj<typeof meta>;

// ─── Playground ───────────────────────────────────────────────────────────────

/** Fully interactive — tweak every prop from the Controls panel. */
export const Playground: Story = {
  args: {
    variant: "default",
    checked: false,
    label: "Toggle me",
  },
};

// ─── States ───────────────────────────────────────────────────────────────────

export const Unchecked: Story = {
  args: {
    checked: false,
    label: "Unchecked",
  },
};

export const Checked: Story = {
  args: {
    checked: true,
    label: "Checked",
  },
};

export const DisabledUnchecked: Story = {
  name: "Disabled · Unchecked",
  args: {
    checked: false,
    disabled: true,
    label: "Disabled unchecked",
  },
};

export const DisabledChecked: Story = {
  name: "Disabled · Checked",
  args: {
    checked: true,
    disabled: true,
    label: "Disabled checked",
  },
};

// ─── Sizes ────────────────────────────────────────────────────────────────────

export const SizeSmall: Story = {
  name: "Size · Small",
  args: {
    size: "sm",
    checked: true,
    label: "Small toggle",
  },
};

export const SizeMedium: Story = {
  name: "Size · Medium",
  args: {
    size: "md",
    checked: true,
    label: "Medium toggle",
  },
};

export const SizeLarge: Story = {
  name: "Size · Large",
  args: {
    size: "lg",
    checked: true,
    label: "Large toggle",
  },
};

// ─── Interactive example ──────────────────────────────────────────────────────

function ToggleRow({ label, defaultChecked = false }: { label: string; defaultChecked?: boolean }) {
  const [checked, setChecked] = useState(defaultChecked);
  return (
    <label className="flex items-center justify-between py-1.5 cursor-pointer">
      <span className="text-xs text-foreground">{label}</span>
      <Toggle checked={checked} onChange={setChecked} label={label} />
    </label>
  );
}

export const SettingsExample: Story = {
  name: "Example · Settings Panel",
  render: () => (
    <div className="w-72 p-4 bg-card rounded-lg border border-border space-y-1">
      <h3 className="text-xs font-semibold text-foreground mb-3">Settings</h3>
      <ToggleRow label="Enable DevTools" />
      <ToggleRow label="Automatic Updates" defaultChecked />
      <ToggleRow label="Usage Statistics" defaultChecked />
      <ToggleRow label="Crash Reports" defaultChecked />
    </div>
  ),
};

// ─── All variants at a glance ─────────────────────────────────────────────────

/** Visual reference — all meaningful states side by side. */
export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-col gap-6 p-6">
      {/* States */}
      <div>
        <p className="text-xs font-medium text-muted-foreground mb-3">States</p>
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <Toggle checked={false} label="Off" />
            <span className="text-xs text-muted-foreground">Off</span>
          </div>
          <div className="flex items-center gap-2">
            <Toggle checked={true} label="On" />
            <span className="text-xs text-muted-foreground">On</span>
          </div>
          <div className="flex items-center gap-2">
            <Toggle checked={false} disabled label="Disabled off" />
            <span className="text-xs text-muted-foreground">Disabled off</span>
          </div>
          <div className="flex items-center gap-2">
            <Toggle checked={true} disabled label="Disabled on" />
            <span className="text-xs text-muted-foreground">Disabled on</span>
          </div>
        </div>
      </div>

      {/* Sizes */}
      <div>
        <p className="text-xs font-medium text-muted-foreground mb-3">Sizes</p>
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <Toggle size="sm" checked={true} label="Small" />
            <span className="text-xs text-muted-foreground">Small</span>
          </div>
          <div className="flex items-center gap-2">
            <Toggle size="md" checked={true} label="Medium" />
            <span className="text-xs text-muted-foreground">Medium</span>
          </div>
          <div className="flex items-center gap-2">
            <Toggle size="lg" checked={true} label="Large" />
            <span className="text-xs text-muted-foreground">Large</span>
          </div>
        </div>
      </div>
    </div>
  ),
};
