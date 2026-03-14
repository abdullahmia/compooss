import { Leaf } from "lucide-react";

export function WelcomeView() {
  return (
    <div className="flex-1 flex items-center justify-center bg-background">
      <div className="text-center max-w-md">
        <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-6">
          <Leaf className="h-8 w-8 text-primary" />
        </div>
        <h1 className="text-xl font-semibold text-foreground mb-2">Compooss</h1>
        <p className="text-sm text-muted-foreground mb-8">
          Select a collection from the sidebar to explore your data, run
          queries, and manage documents.
        </p>
        {/* <div className="space-y-3 text-left">
          {[
            { label: "Browse Documents", desc: "View and edit documents in list, JSON, or table view" },
            { label: "Run Queries", desc: "Filter documents with MongoDB query syntax" },
            { label: "Manage Schema", desc: "Analyze and validate your collection schema" },
          ].map((item) => (
            <div key={item.label} className="flex items-start gap-3 p-3 rounded-lg bg-card border border-border hover:border-primary/30 transition-colors cursor-default">
              <Database className="h-4 w-4 text-primary mt-0.5 shrink-0" />
              <div>
                <p className="text-xs font-medium text-foreground">{item.label}</p>
                <p className="text-[11px] text-muted-foreground">{item.desc}</p>
              </div>
              <ArrowRight className="h-3.5 w-3.5 text-muted-foreground ml-auto mt-0.5" />
            </div>
          ))}
        </div> */}
      </div>
    </div>
  );
}
