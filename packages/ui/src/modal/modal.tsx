import { cn } from "../lib/utils";
import { cva, type VariantProps } from "class-variance-authority";
import { X } from "lucide-react";
import { forwardRef, type HTMLAttributes, type ReactNode } from "react";

// ─── Modal Overlay ────────────────────────────────────────────────────────────

export interface ModalOverlayProps extends HTMLAttributes<HTMLDivElement> {
  onClose?: () => void;
}

const ModalOverlay = forwardRef<HTMLDivElement, ModalOverlayProps>(
  ({ className, onClose, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "absolute inset-0 bg-background/10 backdrop-blur-xs",
        className
      )}
      onClick={onClose}
      {...props}
    />
  )
);
ModalOverlay.displayName = "ModalOverlay";

// ─── Modal Content ────────────────────────────────────────────────────────────

const modalContentVariants = cva(
  "relative bg-card border border-border rounded-lg shadow-xl mx-4",
  {
    variants: {
      size: {
        sm: "w-full max-w-sm",
        md: "w-full max-w-md",
        lg: "w-full max-w-lg",
        xl: "w-full max-w-xl",
      },
    },
    defaultVariants: {
      size: "md",
    },
  }
);

export interface ModalContentProps
  extends HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof modalContentVariants> {}

const ModalContent = forwardRef<HTMLDivElement, ModalContentProps>(
  ({ className, size, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(modalContentVariants({ size }), className)}
      {...props}
    />
  )
);
ModalContent.displayName = "ModalContent";

// ─── Modal Header ─────────────────────────────────────────────────────────────

export interface ModalHeaderProps extends HTMLAttributes<HTMLDivElement> {
  icon?: ReactNode;
  title: string;
  onClose?: () => void;
}

const ModalHeader = forwardRef<HTMLDivElement, ModalHeaderProps>(
  ({ className, icon, title, onClose, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "flex items-center justify-between px-5 py-4 border-b border-border",
        className
      )}
      {...props}
    >
      <div className="flex items-center gap-2">
        {icon && <span className="text-primary">{icon}</span>}
        <h2 className="text-sm font-semibold text-foreground">{title}</h2>
      </div>
      {onClose && (
        <button
          onClick={onClose}
          className="p-1 text-muted-foreground hover:text-foreground rounded-sm hover:bg-secondary transition-colors"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  )
);
ModalHeader.displayName = "ModalHeader";

// ─── Modal Body ───────────────────────────────────────────────────────────────

const ModalBody = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("px-5 py-5 space-y-4", className)}
      {...props}
    />
  )
);
ModalBody.displayName = "ModalBody";

// ─── Modal Footer ─────────────────────────────────────────────────────────────

const ModalFooter = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "flex items-center justify-end gap-2 px-5 py-4 border-t border-border",
        className
      )}
      {...props}
    />
  )
);
ModalFooter.displayName = "ModalFooter";

// ─── Modal Root ───────────────────────────────────────────────────────────────

export interface ModalProps {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
}

function Modal({ open, onClose, children }: ModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <ModalOverlay onClose={onClose} />
      {children}
    </div>
  );
}

Modal.displayName = "Modal";

export {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  modalContentVariants,
};
