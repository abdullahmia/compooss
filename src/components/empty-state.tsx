"use client";

import { FileText } from "lucide-react";

export interface EmptyStateAction {
  label: string;
  onClick?: () => void;
  href?: string;
}

export interface EmptyStateProps {
  /** Icon shown above the title. Defaults to FileText. */
  icon?: React.ReactNode;
  /** Short headline (e.g. "No documents"). */
  title: string;
  /** Supporting text (e.g. "No documents match the current filter."). */
  description?: string;
  /** Optional primary CTA (e.g. "Add document"). */
  primaryAction?: EmptyStateAction;
  /** Optional secondary CTA. */
  secondaryAction?: EmptyStateAction;
  /** Optional class name for the root container. */
  className?: string;
}

export function EmptyState({
  icon,
  title,
  description,
  primaryAction,
  secondaryAction,
  className = "",
}: EmptyStateProps) {
  const Icon = icon ?? (
    <FileText className="h-12 w-12 text-muted-foreground" />
  );

  return (
    <div
      className={`flex flex-col items-center justify-center py-16 px-6 text-center max-w-sm mx-auto ${className}`}
    >
      <div className="flex items-center justify-center w-16 h-16 rounded-full bg-muted/50 text-muted-foreground mb-5">
        {Icon}
      </div>
      <h3 className="text-base font-semibold text-foreground mb-1.5">
        {title}
      </h3>
      {description && (
        <p className="text-sm text-muted-foreground leading-relaxed">
          {description}
        </p>
      )}
      {(primaryAction || secondaryAction) && (
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-6">
          {primaryAction && (primaryAction.onClick != null || primaryAction.href) && (
            primaryAction.href ? (
              <a
                href={primaryAction.href}
                className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-primary-foreground bg-primary rounded-md hover:bg-primary/90 transition-colors"
              >
                {primaryAction.label}
              </a>
            ) : (
              <button
                type="button"
                onClick={primaryAction.onClick}
                className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-primary-foreground bg-primary rounded-md hover:bg-primary/90 transition-colors"
              >
                {primaryAction.label}
              </button>
            )
          )}
          {secondaryAction && (secondaryAction.onClick != null || secondaryAction.href) && (
            secondaryAction.href ? (
              <a
                href={secondaryAction.href}
                className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-foreground border border-border rounded-md hover:bg-muted transition-colors"
              >
                {secondaryAction.label}
              </a>
            ) : (
              <button
                type="button"
                onClick={secondaryAction.onClick}
                className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-foreground border border-border rounded-md hover:bg-muted transition-colors"
              >
                {secondaryAction.label}
              </button>
            )
          )}
        </div>
      )}
    </div>
  );
}
