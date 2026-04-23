const NAME_WIDTHS = ["w-20", "w-28", "w-16", "w-24", "w-20"];

type Props = {
  count?: number;
};

export const SidebarCollectionSkeleton: React.FC<Props> = ({ count = 5 }) => {
  return (
    <div className="animate-pulse">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="flex items-center w-full py-1.5 pl-5 pr-2"
          aria-hidden
        >
          <div className="h-3 w-3 bg-muted rounded shrink-0" />
          <div
            className={`ml-1.5 h-3 bg-muted rounded ${NAME_WIDTHS[i % NAME_WIDTHS.length]}`}
          />
          <div className="ml-auto h-4 w-8 bg-muted rounded" />
        </div>
      ))}
    </div>
  );
};
