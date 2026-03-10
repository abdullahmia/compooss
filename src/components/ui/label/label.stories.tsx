import type { Meta, StoryObj } from "@storybook/react";
import { Input } from "../input/input";
import { Label } from "./label";

const meta = {
  title: "UI/Label",
  component: Label,
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: ["default", "uppercase", "hint"],
    },
    size: {
      control: "select",
      options: ["sm", "md", "lg"],
    },
    children: { control: "text" },
  },
  args: {
    children: "Label text",
  },
} satisfies Meta<typeof Label>;

export default meta;
type Story = StoryObj<typeof meta>;

// ─── Playground ───────────────────────────────────────────────────────────────

/** Fully interactive — tweak every prop from the Controls panel. */
export const Playground: Story = {
  args: {
    variant: "default",
    children: "Label text",
  },
};

// ─── Variants ─────────────────────────────────────────────────────────────────

export const Default: Story = {
  args: {
    variant: "default",
    children: "Database Name",
  },
};

export const Uppercase: Story = {
  args: {
    variant: "uppercase",
    children: "Connection String",
  },
};

export const Hint: Story = {
  args: {
    variant: "hint",
    children: "Max Time MS",
  },
};

// ─── Sizes ────────────────────────────────────────────────────────────────────

export const SizeSmall: Story = {
  name: "Size · Small",
  args: {
    variant: "default",
    size: "sm",
    children: "Small label",
  },
};

export const SizeMedium: Story = {
  name: "Size · Medium",
  args: {
    variant: "default",
    size: "md",
    children: "Medium label",
  },
};

export const SizeLarge: Story = {
  name: "Size · Large",
  args: {
    variant: "default",
    size: "lg",
    children: "Large label",
  },
};

// ─── With Input ───────────────────────────────────────────────────────────────

export const WithInputDefault: Story = {
  name: "Example · Default + Input",
  args: { children: "Database Name" },
  render: (args) => (
    <div className="max-w-sm">
      <Label {...args} />
      <Input variant="default" placeholder="e.g. my_database" />
    </div>
  ),
};

export const WithInputUppercase: Story = {
  name: "Example · Uppercase + Input",
  args: { children: "Connection String", variant: "uppercase" },
  render: (args) => (
    <div className="max-w-sm">
      <Label {...args} />
      <Input variant="default" placeholder="mongodb://localhost:27017" />
    </div>
  ),
};

export const WithInputHint: Story = {
  name: "Example · Hint + Input",
  args: { children: "Max Time MS", variant: "hint" },
  render: (args) => (
    <div className="max-w-sm">
      <Label {...args} />
      <Input variant="mono" defaultValue="60000" />
    </div>
  ),
};

// ─── Form example ─────────────────────────────────────────────────────────────

export const FormExample: Story = {
  name: "Example · Form Layout",
  args: { children: "Database Name" },
  render: () => (
    <div className="max-w-sm space-y-4 p-4 bg-card rounded-lg border border-border">
      <div>
        <Label variant="default">Database Name</Label>
        <Input variant="default" placeholder="e.g. my_database" />
      </div>
      <div>
        <Label variant="default">Collection Name</Label>
        <Input variant="default" placeholder="e.g. my_collection" />
      </div>
      <div>
        <Label variant="uppercase">Connection String</Label>
        <Input variant="default" placeholder="mongodb://localhost:27017" />
      </div>
      <div>
        <Label variant="hint">Max Time MS</Label>
        <Input variant="mono" defaultValue="60000" />
      </div>
    </div>
  ),
};

// ─── All variants at a glance ─────────────────────────────────────────────────

/** Visual reference — all meaningful states side by side. */
export const AllVariants: Story = {
  args: { children: "Label" },
  render: () => (
    <div className="flex flex-col gap-6 p-6 max-w-sm">
      {/* Variants */}
      <div className="space-y-4">
        <div>
          <p className="text-[10px] text-primary font-mono mb-1">variant=&quot;default&quot;</p>
          <Label variant="default">Database Name</Label>
          <Input variant="default" placeholder="e.g. my_database" />
        </div>
        <div>
          <p className="text-[10px] text-primary font-mono mb-1">variant=&quot;uppercase&quot;</p>
          <Label variant="uppercase">Connection String</Label>
          <Input variant="default" placeholder="mongodb://localhost:27017" />
        </div>
        <div>
          <p className="text-[10px] text-primary font-mono mb-1">variant=&quot;hint&quot;</p>
          <Label variant="hint">Max Time MS</Label>
          <Input variant="mono" defaultValue="60000" />
        </div>
      </div>

      {/* Sizes */}
      <div className="space-y-2">
        <p className="text-[10px] text-primary font-mono">Sizes</p>
        <Label variant="default" size="sm">Small label</Label>
        <Label variant="default" size="md">Medium label</Label>
        <Label variant="default" size="lg">Large label</Label>
      </div>
    </div>
  ),
};
