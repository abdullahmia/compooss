"use client";

import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "./modal/modal";
import type { ReactNode } from "react";

export interface ConfirmDestructiveModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  icon?: ReactNode;
  description: ReactNode;
  onConfirm: () => void | Promise<void>;
  confirmLabel?: string;
  isPending?: boolean;
}

function pendingLabel(label: string): string {
  if (label === "Delete") return "Deleting…";
  if (label.endsWith("e")) return `${label.slice(0, -1)}ing…`;
  return `${label}ing…`;
}

export function ConfirmDestructiveModal({
  open,
  onClose,
  title,
  icon,
  description,
  onConfirm,
  confirmLabel = "Delete",
  isPending = false,
}: ConfirmDestructiveModalProps) {
  return (
    <Modal open={open} onClose={onClose}>
      <ModalContent size="sm">
        <ModalHeader title={title} icon={icon} onClose={onClose} />
        <ModalBody>
          <p className="text-sm text-muted-foreground">{description}</p>
        </ModalBody>
        <ModalFooter>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-muted-foreground hover:text-foreground rounded-sm border border-border hover:bg-secondary transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isPending}
            className="px-4 py-2 text-xs font-medium bg-destructive text-destructive-foreground rounded-sm hover:bg-destructive/90 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {isPending ? pendingLabel(confirmLabel) : confirmLabel}
          </button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
