interface CollectionsSkeletonProps {
  /** Number of skeleton rows. Defaults to 5. */
  rowCount?: number;
}

export function CollectionsSkeleton({ rowCount = 5 }: CollectionsSkeletonProps) {
  return (
    <div className="border border-border rounded-lg overflow-hidden bg-card animate-pulse">
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b border-border bg-muted/50">
            <th className="px-4 py-3 font-medium text-foreground">
              Collection Name
            </th>
            <th className="px-4 py-3 font-medium text-foreground">
              Properties
            </th>
            <th className="px-4 py-3 font-medium text-foreground text-right">
              Storage size
            </th>
            <th className="px-4 py-3 font-medium text-foreground text-right">
              Data size
            </th>
            <th className="px-4 py-3 font-medium text-foreground text-right">
              Documents
            </th>
            <th className="px-4 py-3 font-medium text-foreground text-right">
              Avg. Document size
            </th>
            <th className="px-4 py-3 font-medium text-foreground text-right">
              Index
            </th>
            <th className="px-4 py-3 font-medium text-foreground text-right">
              Total Index size
            </th>
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: rowCount }).map((_, i) => (
            <tr key={i} className="border-b border-border last:border-b-0">
              <td className="px-4 py-3">
                <div className="h-4 w-32 bg-muted rounded" />
              </td>
              <td className="px-4 py-3">
                <div className="h-4 w-20 bg-muted rounded" />
              </td>
              <td className="px-4 py-3 text-right">
                <div className="h-4 w-12 bg-muted rounded inline-block" />
              </td>
              <td className="px-4 py-3 text-right">
                <div className="h-4 w-12 bg-muted rounded inline-block" />
              </td>
              <td className="px-4 py-3 text-right">
                <div className="h-4 w-10 bg-muted rounded inline-block" />
              </td>
              <td className="px-4 py-3 text-right">
                <div className="h-4 w-14 bg-muted rounded inline-block" />
              </td>
              <td className="px-4 py-3 text-right">
                <div className="h-4 w-8 bg-muted rounded inline-block" />
              </td>
              <td className="px-4 py-3 text-right">
                <div className="h-4 w-14 bg-muted rounded inline-block" />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
