 "use client";
 
import { Button } from "@compooss/ui";
 
interface IErrorPageProps {
  error: Error & { digest?: string };
  reset: () => void;
}
 
export default function ErrorPage({ error, reset }: IErrorPageProps) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-muted">
      <div className="text-center max-w-md px-4">
        <h1 className="mb-3 text-2xl font-semibold text-foreground">
          Something went wrong
        </h1>
        <p className="mb-4 text-sm text-muted-foreground">
          {error.message ||
            "An unexpected error occurred while loading this page."}
        </p>
        <Button type="button" onClick={reset} variant="primary" size="md">
          Try again
        </Button>
      </div>
    </div>
  );
}
