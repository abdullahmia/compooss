import type { Meta, StoryObj } from "@storybook/react";
import {
  BarChart3,
  Code2,
  FileText,
  Grid3X3,
  Palette,
  Settings,
  Shield,
  ShieldCheck,
} from "lucide-react";
import { useState } from "react";
import { Tabs, type TabItem } from "./tabs";

const meta = {
  title: "UI/Tabs",
  component: Tabs,
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: ["underline", "pill"],
    },
  },
} satisfies Meta<typeof Tabs>;

export default meta;
type Story = StoryObj<typeof meta>;

// ─── Shared tab data ──────────────────────────────────────────────────────────

const collectionTabs: TabItem[] = [
  { id: "documents", label: "Documents", icon: <FileText className="h-3.5 w-3.5" /> },
  { id: "aggregations", label: "Aggregations", icon: <BarChart3 className="h-3.5 w-3.5" /> },
  { id: "schema", label: "Schema", icon: <Grid3X3 className="h-3.5 w-3.5" /> },
  { id: "explain", label: "Explain Plan", icon: <Code2 className="h-3.5 w-3.5" /> },
  { id: "indexes", label: "Indexes", icon: <Grid3X3 className="h-3.5 w-3.5" /> },
  { id: "validation", label: "Validation", icon: <ShieldCheck className="h-3.5 w-3.5" /> },
];

const settingsTabs: TabItem[] = [
  { id: "general", label: "General", icon: <Settings className="h-3.5 w-3.5" /> },
  { id: "privacy", label: "Privacy", icon: <Shield className="h-3.5 w-3.5" /> },
  { id: "theme", label: "Theme", icon: <Palette className="h-3.5 w-3.5" /> },
];

const simpleTabs: TabItem[] = [
  { id: "tab1", label: "Tab 1" },
  { id: "tab2", label: "Tab 2" },
  { id: "tab3", label: "Tab 3" },
];

// ─── Playground ───────────────────────────────────────────────────────────────

/** Fully interactive — tweak every prop from the Controls panel. */
export const Playground: Story = {
  args: {
    variant: "underline",
    items: simpleTabs,
    activeTab: "tab1",
    onTabChange: () => {},
  },
};

// ─── Variants ─────────────────────────────────────────────────────────────────

export const Underline: Story = {
  args: {
    variant: "underline",
    items: simpleTabs,
    activeTab: "tab1",
    onTabChange: () => {},
  },
};

export const Pill: Story = {
  args: {
    variant: "pill",
    items: simpleTabs,
    activeTab: "tab1",
    onTabChange: () => {},
  },
};

// ─── With Icons ───────────────────────────────────────────────────────────────

export const UnderlineWithIcons: Story = {
  name: "Underline · With Icons",
  args: {
    variant: "underline",
    items: collectionTabs,
    activeTab: "documents",
    onTabChange: () => {},
  },
};

export const PillWithIcons: Story = {
  name: "Pill · With Icons",
  args: {
    variant: "pill",
    items: settingsTabs,
    activeTab: "general",
    onTabChange: () => {},
  },
};

// ─── With Disabled Tab ────────────────────────────────────────────────────────

export const WithDisabledTab: Story = {
  name: "Underline · With Disabled Tab",
  args: {
    variant: "underline",
    items: [
      { id: "tab1", label: "Tab 1" },
      { id: "tab2", label: "Tab 2" },
      { id: "tab3", label: "Tab 3 (disabled)", disabled: true },
    ],
    activeTab: "tab1",
    onTabChange: () => {},
  },
};

export const PillWithDisabledTab: Story = {
  name: "Pill · With Disabled Tab",
  args: {
    variant: "pill",
    items: [
      { id: "general", label: "General", icon: <Settings className="h-3.5 w-3.5" /> },
      { id: "privacy", label: "Privacy", icon: <Shield className="h-3.5 w-3.5" /> },
      { id: "theme", label: "Theme (disabled)", icon: <Palette className="h-3.5 w-3.5" />, disabled: true },
    ],
    activeTab: "general",
    onTabChange: () => {},
  },
};

// ─── Interactive examples ─────────────────────────────────────────────────────

function InteractiveUnderline() {
  const [active, setActive] = useState("documents");
  return (
    <div className="w-full">
      <Tabs
        variant="underline"
        items={collectionTabs}
        activeTab={active}
        onTabChange={setActive}
      />
      <div className="p-4 text-xs text-muted-foreground">
        Active tab: <span className="text-primary font-medium">{active}</span>
      </div>
    </div>
  );
}

export const InteractiveUnderlineExample: Story = {
  name: "Example · Collection Tabs (Interactive)",
  args: {
    items: collectionTabs,
    activeTab: "documents",
    onTabChange: () => {},
  },
  render: () => <InteractiveUnderline />,
};

function InteractivePill() {
  const [active, setActive] = useState("general");
  return (
    <div className="w-40 border-r border-border">
      <Tabs
        variant="pill"
        items={settingsTabs}
        activeTab={active}
        onTabChange={setActive}
      />
      <div className="p-3 text-xs text-muted-foreground">
        Active: <span className="text-primary font-medium">{active}</span>
      </div>
    </div>
  );
}

export const InteractivePillExample: Story = {
  name: "Example · Settings Sidebar (Interactive)",
  args: {
    items: settingsTabs,
    activeTab: "general",
    onTabChange: () => {},
  },
  render: () => <InteractivePill />,
};

// ─── Different active states ──────────────────────────────────────────────────

export const UnderlineSecondActive: Story = {
  name: "Underline · Second Tab Active",
  args: {
    variant: "underline",
    items: collectionTabs,
    activeTab: "aggregations",
    onTabChange: () => {},
  },
};

export const PillSecondActive: Story = {
  name: "Pill · Second Tab Active",
  args: {
    variant: "pill",
    items: settingsTabs,
    activeTab: "privacy",
    onTabChange: () => {},
  },
};

// ─── All variants at a glance ─────────────────────────────────────────────────

/** Visual reference — all meaningful states side by side. */
export const AllVariants: Story = {
  args: {
    items: simpleTabs,
    activeTab: "tab1",
    onTabChange: () => {},
  },
  render: () => (
    <div className="flex flex-col gap-8 p-6">
      {/* Underline */}
      <div>
        <p className="text-xs font-medium text-muted-foreground mb-3">
          Underline (used in CollectionView)
        </p>
        <Tabs
          variant="underline"
          items={collectionTabs}
          activeTab="documents"
          onTabChange={() => {}}
        />
      </div>

      {/* Underline simple */}
      <div>
        <p className="text-xs font-medium text-muted-foreground mb-3">
          Underline · Simple (no icons)
        </p>
        <Tabs
          variant="underline"
          items={simpleTabs}
          activeTab="tab2"
          onTabChange={() => {}}
        />
      </div>

      {/* Pill */}
      <div>
        <p className="text-xs font-medium text-muted-foreground mb-3">
          Pill (used in SettingsModal sidebar)
        </p>
        <div className="w-40">
          <Tabs
            variant="pill"
            items={settingsTabs}
            activeTab="general"
            onTabChange={() => {}}
          />
        </div>
      </div>

      {/* Pill simple */}
      <div>
        <p className="text-xs font-medium text-muted-foreground mb-3">
          Pill · Simple (no icons)
        </p>
        <div className="w-40">
          <Tabs
            variant="pill"
            items={simpleTabs}
            activeTab="tab1"
            onTabChange={() => {}}
          />
        </div>
      </div>
    </div>
  ),
};
