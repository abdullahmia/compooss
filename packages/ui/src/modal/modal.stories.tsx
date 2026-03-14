import type { Meta, StoryObj } from "@storybook/react";
import { Database, Settings } from "lucide-react";
import { useState } from "react";
import { Button } from "../button/button";
import { Input } from "../input/input";
import { Label } from "../label/label";
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "./modal";

const meta = {
  title: "UI/Modal",
  component: Modal,
  tags: ["autodocs"],
  argTypes: {
    open: { control: "boolean" },
  },
  args: {
    open: true,
    onClose: () => {},
    children: null,
  },
  parameters: {
    layout: "fullscreen",
  },
} satisfies Meta<typeof Modal>;

export default meta;
type Story = StoryObj<typeof meta>;

// ─── Playground ───────────────────────────────────────────────────────────────

/** Fully interactive — tweak every prop from the Controls panel. */
export const Playground: Story = {
  args: {
    open: true,
  },
  render: (args) => (
    <Modal {...args}>
      <ModalContent>
        <ModalHeader
          icon={<Settings className="h-4 w-4" />}
          title="Settings"
          onClose={args.onClose}
        />
        <ModalBody>
          <p className="text-sm text-muted-foreground">Modal content goes here.</p>
        </ModalBody>
        <ModalFooter>
          <Button variant="ghost" onClick={args.onClose}>
            Cancel
          </Button>
          <Button variant="primary">Save</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  ),
};

// ─── Sizes ────────────────────────────────────────────────────────────────────

export const SizeSmall: Story = {
  name: "Size · Small",
  args: { open: true },
  render: (args) => (
    <Modal {...args}>
      <ModalContent size="sm">
        <ModalHeader title="Small Modal" onClose={args.onClose} />
        <ModalBody>
          <p className="text-sm text-muted-foreground">A compact modal for simple confirmations.</p>
        </ModalBody>
        <ModalFooter>
          <Button variant="ghost" onClick={args.onClose}>Cancel</Button>
          <Button variant="primary">Confirm</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  ),
};

export const SizeMedium: Story = {
  name: "Size · Medium (default)",
  args: { open: true },
  render: (args) => (
    <Modal {...args}>
      <ModalContent size="md">
        <ModalHeader
          icon={<Database className="h-4 w-4" />}
          title="Create Database"
          onClose={args.onClose}
        />
        <ModalBody>
          <div>
            <Label>Database Name</Label>
            <Input variant="default" placeholder="e.g. my_database" />
          </div>
          <div>
            <Label>Collection Name</Label>
            <Input variant="default" placeholder="e.g. my_collection" />
          </div>
        </ModalBody>
        <ModalFooter>
          <Button variant="ghost" onClick={args.onClose}>Cancel</Button>
          <Button variant="primary">Create Database</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  ),
};

export const SizeLarge: Story = {
  name: "Size · Large",
  args: { open: true },
  render: (args) => (
    <Modal {...args}>
      <ModalContent size="lg">
        <ModalHeader
          icon={<Settings className="h-4 w-4" />}
          title="Settings"
          onClose={args.onClose}
        />
        <ModalBody>
          <p className="text-sm text-muted-foreground">
            A larger modal suitable for settings panels with more complex content.
          </p>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Max Time MS</Label>
              <Input variant="mono" defaultValue="60000" />
            </div>
            <div>
              <Label>Default Docs Per Page</Label>
              <Input variant="mono" defaultValue="20" />
            </div>
          </div>
        </ModalBody>
        <ModalFooter>
          <Button variant="ghost" onClick={args.onClose}>Cancel</Button>
          <Button variant="primary">Save Changes</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  ),
};

// ─── Without close button ─────────────────────────────────────────────────────

export const WithoutCloseButton: Story = {
  name: "Without Close Button",
  args: { open: true },
  render: (args) => (
    <Modal {...args}>
      <ModalContent size="sm">
        <ModalHeader title="Confirm Action" />
        <ModalBody>
          <p className="text-sm text-muted-foreground">
            Are you sure you want to proceed? This action cannot be undone.
          </p>
        </ModalBody>
        <ModalFooter>
          <Button variant="ghost" onClick={args.onClose}>Cancel</Button>
          <Button variant="primary" className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
            Delete
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  ),
};

// ─── Without footer ───────────────────────────────────────────────────────────

export const WithoutFooter: Story = {
  name: "Without Footer",
  args: { open: true },
  render: (args) => (
    <Modal {...args}>
      <ModalContent size="sm">
        <ModalHeader title="Information" onClose={args.onClose} />
        <ModalBody>
          <p className="text-sm text-muted-foreground">
            This is an informational modal with no actions required.
          </p>
        </ModalBody>
      </ModalContent>
    </Modal>
  ),
};

// ─── With icon header ─────────────────────────────────────────────────────────

export const WithIconHeader: Story = {
  name: "With Icon in Header",
  args: { open: true },
  render: (args) => (
    <Modal {...args}>
      <ModalContent>
        <ModalHeader
          icon={<Database className="h-4 w-4" />}
          title="Create Database"
          onClose={args.onClose}
        />
        <ModalBody>
          <p className="text-sm text-muted-foreground">Database creation form.</p>
        </ModalBody>
        <ModalFooter>
          <Button variant="ghost" onClick={args.onClose}>Cancel</Button>
          <Button variant="primary">Create</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  ),
};

// ─── Interactive example ──────────────────────────────────────────────────────

function InteractiveModal() {
  const [open, setOpen] = useState(false);
  return (
    <div className="p-8">
      <Button variant="primary" onClick={() => setOpen(true)}>
        Open Modal
      </Button>
      <Modal open={open} onClose={() => setOpen(false)}>
        <ModalContent>
          <ModalHeader
            icon={<Database className="h-4 w-4" />}
            title="Create Database"
            onClose={() => setOpen(false)}
          />
          <ModalBody>
            <div>
              <Label>Database Name</Label>
              <Input variant="default" placeholder="e.g. my_database" autoFocus />
            </div>
            <div>
              <Label>Collection Name</Label>
              <Input variant="default" placeholder="e.g. my_collection" />
            </div>
            <div className="bg-secondary/50 border border-border rounded-sm p-3">
              <p className="text-[11px] text-muted-foreground">
                Before MongoDB can save your new database, a collection name must also be specified.
              </p>
            </div>
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" onClick={() => setOpen(false)}>Cancel</Button>
            <Button variant="primary">Create Database</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
}

export const Interactive: Story = {
  name: "Example · Interactive",
  args: { open: true },
  render: () => <InteractiveModal />,
};

// ─── Closed state ─────────────────────────────────────────────────────────────

export const Closed: Story = {
  args: { open: false },
  render: (args) => (
    <div className="p-8">
      <p className="text-sm text-muted-foreground">Modal is closed (open = false). Nothing renders.</p>
      <Modal {...args}>
        <ModalContent>
          <ModalHeader title="Hidden Modal" />
          <ModalBody>
            <p>You should not see this.</p>
          </ModalBody>
        </ModalContent>
      </Modal>
    </div>
  ),
};
