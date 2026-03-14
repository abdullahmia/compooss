import type { Meta, StoryObj } from "@storybook/react";
import {
  Copy,
  HelpCircle,
  Pencil,
  Plus,
  RefreshCw,
  Settings,
  Trash2,
  Code2,
  FileText,
  Grid3X3,
  SlidersHorizontal,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { IconButton } from "./icon-button";

const meta = {
  title: "UI/IconButton",
  component: IconButton,
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: ["default", "ghost", "toolbar", "active", "danger"],
    },
    size: {
      control: "select",
      options: ["sm", "md", "lg"],
    },
    disabled: { control: "boolean" },
    label: { control: "text" },
  },
  args: {
    icon: <Settings className="h-4 w-4" />,
    label: "Settings",
    disabled: false,
  },
} satisfies Meta<typeof IconButton>;

export default meta;
type Story = StoryObj<typeof meta>;

// ─── Playground ───────────────────────────────────────────────────────────────

/** Fully interactive — tweak every prop from the Controls panel. */
export const Playground: Story = {
  args: {
    variant: "default",
    icon: <Settings className="h-4 w-4" />,
    label: "Settings",
  },
};

// ─── Variants ─────────────────────────────────────────────────────────────────

export const Default: Story = {
  args: {
    variant: "default",
    icon: <Settings className="h-4 w-4" />,
    label: "Settings",
  },
};

export const Ghost: Story = {
  args: {
    variant: "ghost",
    icon: <HelpCircle className="h-4 w-4" />,
    label: "Help",
  },
};

export const Toolbar: Story = {
  args: {
    variant: "toolbar",
    icon: <Plus className="h-3.5 w-3.5" />,
    label: "Create Database",
  },
};

export const Active: Story = {
  args: {
    variant: "active",
    icon: <FileText className="h-3.5 w-3.5" />,
    label: "List view (active)",
  },
};

export const Danger: Story = {
  args: {
    variant: "danger",
    icon: <Trash2 className="h-3 w-3" />,
    label: "Delete Document",
  },
};

// ─── Sizes ────────────────────────────────────────────────────────────────────

export const SizeSmall: Story = {
  name: "Size · Small",
  args: {
    variant: "default",
    size: "sm",
    icon: <ChevronLeft className="h-3.5 w-3.5" />,
    label: "Previous",
  },
};

export const SizeMedium: Story = {
  name: "Size · Medium",
  args: {
    variant: "default",
    size: "md",
    icon: <Settings className="h-3.5 w-3.5" />,
    label: "Settings",
  },
};

export const SizeLarge: Story = {
  name: "Size · Large",
  args: {
    variant: "default",
    size: "lg",
    icon: <Settings className="h-4 w-4" />,
    label: "Settings",
  },
};

// ─── Disabled ─────────────────────────────────────────────────────────────────

export const DefaultDisabled: Story = {
  name: "Default · Disabled",
  args: {
    variant: "default",
    disabled: true,
    icon: <Settings className="h-4 w-4" />,
    label: "Settings (disabled)",
  },
};

export const ToolbarDisabled: Story = {
  name: "Toolbar · Disabled",
  args: {
    variant: "toolbar",
    disabled: true,
    icon: <Plus className="h-3.5 w-3.5" />,
    label: "Create (disabled)",
  },
};

// ─── Real-world examples ──────────────────────────────────────────────────────

export const TopBarActions: Story = {
  name: "Example · TopBar Actions",
  render: () => (
    <div className="flex items-center gap-1 p-3 bg-topbar rounded-sm">
      <IconButton
        variant="default"
        icon={<Settings className="h-4 w-4" />}
        label="Settings"
      />
      <IconButton
        variant="default"
        icon={<HelpCircle className="h-4 w-4" />}
        label="Help"
      />
    </div>
  ),
};

export const SidebarActions: Story = {
  name: "Example · Sidebar Actions",
  render: () => (
    <div className="flex items-center gap-1 p-2 bg-sidebar rounded-sm">
      <IconButton
        variant="toolbar"
        icon={<Plus className="h-3.5 w-3.5" />}
        label="Create Database"
      />
      <IconButton
        variant="toolbar"
        icon={<RefreshCw className="h-3.5 w-3.5" />}
        label="Refresh"
      />
    </div>
  ),
};

export const ViewModeToggle: Story = {
  name: "Example · View Mode Toggle",
  render: () => (
    <div className="flex items-center gap-2 p-3 bg-card rounded-sm">
      <IconButton
        variant="active"
        icon={<FileText className="h-3.5 w-3.5" />}
        label="List view"
      />
      <IconButton
        variant="default"
        size="md"
        icon={<Code2 className="h-3.5 w-3.5" />}
        label="JSON view"
      />
      <IconButton
        variant="default"
        size="md"
        icon={<Grid3X3 className="h-3.5 w-3.5" />}
        label="Table view"
      />
    </div>
  ),
};

export const DocumentActions: Story = {
  name: "Example · Document Actions",
  render: () => (
    <div className="flex items-center gap-1 p-2 bg-card rounded-sm">
      <IconButton
        variant="default"
        size="md"
        icon={<Copy className="h-3 w-3" />}
        label="Clone Document"
      />
      <IconButton
        variant="default"
        size="md"
        icon={<Pencil className="h-3 w-3" />}
        label="Edit Document"
      />
      <IconButton
        variant="danger"
        size="md"
        icon={<Trash2 className="h-3 w-3" />}
        label="Delete Document"
      />
    </div>
  ),
};

export const QueryBarActions: Story = {
  name: "Example · QueryBar Actions",
  render: () => (
    <div className="flex items-center gap-1 p-2 bg-querybar rounded-sm">
      <IconButton
        variant="default"
        icon={<SlidersHorizontal className="h-3.5 w-3.5" />}
        label="Options"
      />
      <IconButton
        variant="default"
        icon={<RotateCcw className="h-3.5 w-3.5" />}
        label="Reset"
      />
    </div>
  ),
};

export const Pagination: Story = {
  name: "Example · Pagination",
  render: () => (
    <div className="flex items-center gap-1 p-2 bg-card rounded-sm">
      <IconButton
        variant="default"
        size="sm"
        icon={<ChevronLeft className="h-3.5 w-3.5" />}
        label="Previous page"
      />
      <span className="text-xs text-muted-foreground px-2">1 – 20</span>
      <IconButton
        variant="default"
        size="sm"
        icon={<ChevronRight className="h-3.5 w-3.5" />}
        label="Next page"
      />
    </div>
  ),
};

// ─── All variants at a glance ─────────────────────────────────────────────────

/** Visual reference — all meaningful states side by side. */
export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-col gap-6 p-6">
      {/* Variants */}
      <div>
        <p className="text-xs font-medium text-muted-foreground mb-3">Variants</p>
        <div className="flex flex-wrap items-center gap-3">
          <IconButton variant="default" icon={<Settings className="h-4 w-4" />} label="Default" />
          <IconButton variant="ghost" icon={<HelpCircle className="h-4 w-4" />} label="Ghost" />
          <IconButton variant="toolbar" icon={<Plus className="h-3.5 w-3.5" />} label="Toolbar" />
          <IconButton variant="active" icon={<FileText className="h-3.5 w-3.5" />} label="Active" />
          <IconButton variant="danger" icon={<Trash2 className="h-3 w-3" />} label="Danger" />
        </div>
      </div>

      {/* Sizes */}
      <div>
        <p className="text-xs font-medium text-muted-foreground mb-3">Sizes</p>
        <div className="flex flex-wrap items-center gap-3">
          <IconButton variant="default" size="sm" icon={<Settings className="h-3 w-3" />} label="Small" />
          <IconButton variant="default" size="md" icon={<Settings className="h-3.5 w-3.5" />} label="Medium" />
          <IconButton variant="default" size="lg" icon={<Settings className="h-4 w-4" />} label="Large" />
        </div>
      </div>

      {/* Disabled */}
      <div>
        <p className="text-xs font-medium text-muted-foreground mb-3">Disabled</p>
        <div className="flex flex-wrap items-center gap-3">
          <IconButton variant="default" disabled icon={<Settings className="h-4 w-4" />} label="Default disabled" />
          <IconButton variant="toolbar" disabled icon={<Plus className="h-3.5 w-3.5" />} label="Toolbar disabled" />
          <IconButton variant="danger" disabled icon={<Trash2 className="h-3 w-3" />} label="Danger disabled" />
        </div>
      </div>
    </div>
  ),
};
