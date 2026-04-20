export const DiagramSkeleton: React.FC = () => {
  return (
    <div className="flex flex-1 items-center justify-center h-full w-full bg-muted/20">
      <div className="flex flex-col items-center gap-3">
        <div className="flex gap-4">
          {[140, 180, 120, 160].map((w, i) => (
            <div
              key={i}
              className="animate-pulse rounded-lg bg-muted"
              style={{ width: w, height: 60 }}
            />
          ))}
        </div>
        <div className="flex gap-6">
          {[160, 140, 120].map((w, i) => (
            <div
              key={i}
              className="animate-pulse rounded-lg bg-muted/60"
              style={{ width: w, height: 60 }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
