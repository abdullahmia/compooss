import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Database, Search } from "lucide-react";
import { useForm } from "react-hook-form";
import { Input, type InputProps } from "./input";

function InputWithForm(props: Omit<InputProps, "hookForm" | "name"> & { name?: string }) {
  const name = props.name ?? "field";
  const form = useForm({
    defaultValues: { [name]: (props as InputProps & { defaultValue?: string }).defaultValue ?? "" },
  });
  return <Input {...props} name={name} hookForm={form} />;
}

const meta = {
  title: "UI/Input",
  component: InputWithForm,
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
    label: { control: "text" },
  },
  args: {
    placeholder: "Type something...",
    disabled: false,
    iconPosition: "left",
  },
} satisfies Meta<typeof InputWithForm>;

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

export const SearchVariant: Story = {
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

function AllVariantsForm() {
  const form = useForm({
    defaultValues: {
      default1: "",
      default2: "",
      default3: "With value",
      search1: "",
      search2: "",
      mono1: "",
      mono2: "60000",
      mono3: "",
      size1: "",
      size2: "",
      size3: "",
    },
  });
  return (
    <div className="flex flex-col gap-6 p-6 max-w-md">
      <div className="space-y-3">
        <p className="text-xs font-medium text-muted-foreground">Default</p>
        <Input hookForm={form} name="default1" variant="default" placeholder="Default input" />
        <Input hookForm={form} name="default2" variant="default" placeholder="Disabled" disabled />
        <Input hookForm={form} name="default3" variant="default" placeholder="With value" />
      </div>
      <div className="space-y-3">
        <p className="text-xs font-medium text-muted-foreground">Search</p>
        <Input
          hookForm={form}
          name="search1"
          variant="search"
          icon={<Search className="h-3.5 w-3.5" />}
          placeholder="Search..."
        />
        <Input
          hookForm={form}
          name="search2"
          variant="search"
          icon={<Search className="h-3.5 w-3.5" />}
          placeholder="Disabled search"
          disabled
        />
      </div>
      <div className="space-y-3">
        <p className="text-xs font-medium text-muted-foreground">Mono</p>
        <Input hookForm={form} name="mono1" variant="mono" placeholder='{ field: "value" }' />
        <Input hookForm={form} name="mono2" variant="mono" />
        <Input hookForm={form} name="mono3" variant="mono" placeholder="Disabled" disabled />
      </div>
      <div className="space-y-3">
        <p className="text-xs font-medium text-muted-foreground">Sizes</p>
        <Input hookForm={form} name="size1" variant="default" inputSize="sm" placeholder="Small" />
        <Input hookForm={form} name="size2" variant="default" inputSize="md" placeholder="Medium" />
        <Input hookForm={form} name="size3" variant="default" inputSize="lg" placeholder="Large" />
      </div>
    </div>
  );
}

/** Visual reference — all meaningful states side by side. */
export const AllVariants: Story = {
  render: () => <AllVariantsForm />,
};
