"use client";

type Props = {
  label: string;
  cols?: string;
  children: React.ReactNode;
};

export const FieldRow: React.FC<Props> = ({ label, cols = "120px", children }) => {
  return (
    <div
      className="grid items-center gap-2"
      style={{ gridTemplateColumns: `${cols} 1fr` }}
    >
      <label className="text-[11px] font-medium text-muted-foreground text-right">
        {label}
      </label>
      {children}
    </div>
  );
};
