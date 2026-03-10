import type { Meta, StoryObj } from "@storybook/react";
import { Database, Search } from "lucide-react";
import { Input } from "./input";

const meta = {
  title: "UI/Input",
  component: Input,
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: ["default", "search", "mono"],
    },
    inputSize: {
      control: "select",
      options: ["sm", "md", "lg"],
    },
    iconPosition: {
      control: "select",
      options: ["left", "right"],
    },
    disabled: { control: "boolean" },
    placeholder: { control: "text" },
  },
  args: {
    placeholder: "Type something...",
    disabled: false,
    iconPosition: "left",
  },
} satisfies Meta<typeof Input>;

export default meta;
type Story = StoryObj<typeof meta>;

// ─── Playground ───────────────────────────────────────────────────────────────

/** Fully interactive — tweak every prop from the Controls panel. */
export const Playground: Story = {
  args: {
    variant: "default",
    placeholder: "Type something...",
  },
};

// ─── Variants ─────────────────────────────────────────────────────────────────

export const Default: Story = {
  args: {
    variant: "default",
    placeholder: "mongodb://localhost:27017",
  },
};

export const Search_: Story = {
  name: "Search",
  args: {
    variant: "search",
    placeholder: "Filter databases...",
    icon: <Search className="h-3.5 w-3.5" />,
  },
};

export const Mono: Story = {
  args: {
    variant: "mono",
    placeholder: '{ field: "value" }',
  },
};

// ─── Sizes ────────────────────────────────────────────────────────────────────

export const SizeSmall: Story = {
  name: "Size · Small",
  args: {
    variant: "default",
    inputSize: "sm",
    placeholder: "Small input",
  },
};

export const SizeMedium: Story = {
  name: "Size · Medium",
  args: {
    variant: "default",
    inputSize: "md",
    placeholder: "Medium input",
  },
};

export const SizeLarge: Story = {
  name: "Size · Large",
  args: {
    variant: "default",
    inputSize: "lg",
    placeholder: "Large input",
  },
};

// ─── With Icon ────────────────────────────────────────────────────────────────

export const WithIconLeft: Story = {
  name: "Icon · Left",
  args: {
    variant: "search",
    icon: <Search className="h-3.5 w-3.5" />,
    iconPosition: "left",
    placeholder: "Search...",
  },
};

export const WithIconRight: Story = {
  name: "Icon · Right",
  args: {
    variant: "search",
    icon: <Database className="h-3.5 w-3.5" />,
    iconPosition: "right",
    placeholder: "Search databases...",
  },
};

// ─── Disabled ─────────────────────────────────────────────────────────────────

export const DefaultDisabled: Story = {
  name: "Default · Disabled",
  args: {
    variant: "default",
    disabled: true,
    placeholder: "Disabled input",
  },
};

export const SearchDisabled: Story = {
  name: "Search · Disabled",
  args: {
    variant: "search",
    disabled: true,
    icon: <Search className="h-3.5 w-3.5" />,
    placeholder: "Disabled search",
  },
};

export const MonoDisabled: Story = {
  name: "Mono · Disabled",
  args: {
    variant: "mono",
    disabled: true,
    placeholder: "Disabled mono",
  },
};

// ─── With Value ───────────────────────────────────────────────────────────────

export const WithValue: Story = {
  args: {
    variant: "default",
    defaultValue: "mongodb://localhost:27017",
  },
};

export const MonoWithValue: Story = {
  name: "Mono · With Value",
  args: {
    variant: "mono",
    defaultValue: "60000",
  },
};

// ─── All variants at a glance ─────────────────────────────────────────────────

/** Visual reference — all meaningful states side by side. */
export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-col gap-6 p-6 max-w-md">
      {/* Default variants */}
      <div className="space-y-3">
        <p className="text-xs font-medium text-muted-foreground">Default</p>
        <Input variant="default" placeholder="Default input" />
        <Input variant="default" placeholder="Disabled" disabled />
        <Input variant="default" defaultValue="With value" />
      </div>

      {/* Search variants */}
      <div className="space-y-3">
        <p className="text-xs font-medium text-muted-foreground">Search</p>
        <Input
          variant="search"
          icon={<Search className="h-3.5 w-3.5" />}
          placeholder="Search..."
        />
        <Input
          variant="search"
          icon={<Search className="h-3.5 w-3.5" />}
          placeholder="Disabled search"
          disabled
        />
      </div>

      {/* Mono variants */}
      <div className="space-y-3">
        <p className="text-xs font-medium text-muted-foreground">Mono</p>
        <Input variant="mono" placeholder='{ field: "value" }' />
        <Input variant="mono" defaultValue="60000" />
        <Input variant="mono" placeholder="Disabled" disabled />
      </div>

      {/* Sizes */}
      <div className="space-y-3">
        <p className="text-xs font-medium text-muted-foreground">Sizes</p>
        <Input variant="default" inputSize="sm" placeholder="Small" />
        <Input variant="default" inputSize="md" placeholder="Medium" />
        <Input variant="default" inputSize="lg" placeholder="Large" />
      </div>
    </div>
  ),
};
