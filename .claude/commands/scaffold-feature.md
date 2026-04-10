# /scaffold-feature

Scaffold a complete new CRUD feature following the VelaOps web pattern.

## Usage

```
/scaffold-feature <FeatureName> [parentRoute]
```

**Examples**
```
/scaffold-feature Tags chat/[agentId]
/scaffold-feature Webhooks dashboard
/scaffold-feature Notifications
```

---

## What to generate

When this command is run with a feature name (e.g. `Tags`), generate ALL of the following files exactly following the patterns in `claude-code/CLAUDE.md`. Do not skip any file. Do not add files not listed here unless explicitly asked.

Use these naming transforms:
- `FeatureName` → PascalCase entity name (e.g. `Tag`, `Webhook`)
- `featureName` → camelCase (e.g. `tag`, `webhook`)
- `feature-name` → kebab-case (e.g. `tag`, `webhook`)
- `FEATURE_NAME` → SCREAMING_SNAKE (e.g. `TAG`, `WEBHOOK`)
- Plural: add `s` for collection references (e.g. `Tags`, `tags`, `TAGS`)

---

### File 1 — `lib/types/[feature-name].type.ts`

```ts
export type [FeatureName] = {
  id: string;
  agentId: string;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
};

export type T[FeatureName]CreateResponse = {
  success: boolean;
  data: [FeatureName];
};

export type TUpdate[FeatureName]Response = {
  success: boolean;
  data: [FeatureName];
};

export type TDelete[FeatureName]Response = {
  success: boolean;
};
```

Then add `export * from "./[feature-name].type";` to `lib/types/index.ts`.

---

### File 2 — `lib/schemas/[feature-name].schema.ts`

```ts
import { z } from "zod";

export const [featureName]Schema = z.object({
  name: z.string().min(1, "Name is required").max(100, "Name must be at most 100 characters"),
  description: z.string().max(500, "Description must be at most 500 characters").optional().default(""),
});

export type T[FeatureName]FormData = z.input<typeof [featureName]Schema>;

export const update[FeatureName]Schema = [featureName]Schema.partial();
export type TUpdate[FeatureName]FormData = z.input<typeof update[FeatureName]Schema>;
```

Then add `export * from "./[feature-name].schema";` to `lib/schemas/index.ts`.

---

### File 3 — Add to `lib/constants/endpoints.constants.ts`

Inside the `ENDPOINTS` object add:

```ts
[FEATURE_NAMES]: {
  LIST:   (agentId: string) => `/api/agents/${agentId}/[feature-names]`,
  DETAIL: (agentId: string, id: string) => `/api/agents/${agentId}/[feature-names]/${id}`,
},
```

---

### File 4 — Add to `lib/constants/route-paths.constant.ts`

Inside the `ROUTE_PATHS` object add:

```ts
// If nested under CHAT:
// [FEATURE_NAMES]: (agentId: string) => `/chat/${agentId}/[feature-names]`,

// If top-level:
// [FEATURE_NAMES]: "/[feature-names]",
```

---

### File 5 — `lib/services/[feature-names]/[feature-names]-query.key.ts`

```ts
export const [FEATURE_NAME]_QUERY_KEYS = {
  list:   (agentId: string) => ["[feature-names]", agentId] as const,
  detail: (id: string)      => ["[feature-name]", "details", id] as const,
} as const;
```

---

### File 6 — `lib/services/[feature-names]/[feature-names].service.ts`

```ts
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { [FEATURE_NAME]_QUERY_KEYS } from "./[feature-names]-query.key";
import { apiClient } from "@/lib/config/api.config";
import { ENDPOINTS } from "@/lib/constants";
import type { ApiResponse } from "@velaops/shared";
import type {
  [FeatureName],
  T[FeatureName]CreateResponse,
  TUpdate[FeatureName]Response,
  TDelete[FeatureName]Response,
  MutationOptions,
} from "@/lib/types";
import type { T[FeatureName]FormData, TUpdate[FeatureName]FormData } from "@/lib/schemas";

export const useGet[FeatureNames] = (agentId: string) =>
  useQuery({
    queryKey: [FEATURE_NAME]_QUERY_KEYS.list(agentId),
    queryFn: async () => {
      const res = await apiClient.get<ApiResponse<[FeatureName][]>>(ENDPOINTS.[FEATURE_NAMES].LIST(agentId));
      return res.data ?? [];
    },
    enabled: !!agentId,
  });

export const useGet[FeatureName]Details = (agentId: string, [featureName]Id: string) =>
  useQuery({
    queryKey: [FEATURE_NAME]_QUERY_KEYS.detail([featureName]Id),
    queryFn: async () => {
      const res = await apiClient.get<ApiResponse<[FeatureName]>>(
        ENDPOINTS.[FEATURE_NAMES].DETAIL(agentId, [featureName]Id),
      );
      return res.data;
    },
    enabled: !!agentId && !![featureName]Id,
  });

export const useCreate[FeatureName] = (options: MutationOptions<T[FeatureName]CreateResponse> = {}) => {
  const queryClient = useQueryClient();
  return useMutation({
    ...options,
    mutationFn: async ({ agentId, payload }: { agentId: string; payload: T[FeatureName]FormData }) =>
      apiClient.post<T[FeatureName]CreateResponse>(ENDPOINTS.[FEATURE_NAMES].LIST(agentId), payload),
    onSuccess: (data, variables, context, mutation) => {
      queryClient.invalidateQueries({ queryKey: [FEATURE_NAME]_QUERY_KEYS.list(data.data.agentId) });
      options.onSuccess?.(data, variables, context, mutation);
    },
  });
};

export const useUpdate[FeatureName] = (options: MutationOptions<TUpdate[FeatureName]Response> = {}) => {
  const queryClient = useQueryClient();
  return useMutation({
    ...options,
    mutationFn: async ({
      agentId,
      [featureName]Id,
      payload,
    }: {
      agentId: string;
      [featureName]Id: string;
      payload: TUpdate[FeatureName]FormData;
    }) =>
      apiClient.patch<TUpdate[FeatureName]Response>(
        ENDPOINTS.[FEATURE_NAMES].DETAIL(agentId, [featureName]Id),
        payload,
      ),
    onSuccess: (data, variables, context, mutation) => {
      queryClient.invalidateQueries({ queryKey: [FEATURE_NAME]_QUERY_KEYS.list(data.data.agentId) });
      queryClient.invalidateQueries({ queryKey: [FEATURE_NAME]_QUERY_KEYS.detail(variables.[featureName]Id) });
      options.onSuccess?.(data, variables, context, mutation);
    },
  });
};

export const useDelete[FeatureName] = (options: MutationOptions<TDelete[FeatureName]Response> = {}) => {
  const queryClient = useQueryClient();
  return useMutation({
    ...options,
    mutationFn: async ({ agentId, [featureName]Id }: { agentId: string; [featureName]Id: string }) =>
      apiClient.delete<TDelete[FeatureName]Response>(ENDPOINTS.[FEATURE_NAMES].DETAIL(agentId, [featureName]Id)),
    onSuccess: (data, variables, context, mutation) => {
      queryClient.invalidateQueries({ queryKey: [FEATURE_NAME]_QUERY_KEYS.list(variables.agentId) });
      options.onSuccess?.(data, variables, context, mutation);
    },
  });
};
```

---

### File 7 — `lib/components/[parent]/[feature-names]/[feature-names].component.tsx`

```tsx
"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useGet[FeatureNames] } from "@/lib/services/[feature-names]/[feature-names].service";
import { [FeatureName]Form } from "./[feature-name]-form.component";
import { [FeatureName]Item } from "./[feature-name]-item.component";
import { [FeatureName]Skeleton } from "./[feature-name]-skeleton.component";
import { [FeatureName]Empty } from "./[feature-name]-empty.component";

export const [FeatureNames] = () => {
  const { agentId } = useParams<{ agentId: string }>();
  const [dialogOpen, setDialogOpen] = useState(false);
  const { data: items = [], isLoading } = useGet[FeatureNames](agentId);

  return (
    <>
      <div className="flex-1 flex flex-col min-h-0">
        <header className="flex items-center justify-between px-6 py-4 border-b border-border">
          <h1 className="text-base font-semibold text-foreground">[FeatureNames]</h1>
          <Button size="sm" onClick={() => setDialogOpen(true)}>
            <Plus className="h-4 w-4" />
            New [FeatureName]
          </Button>
        </header>

        <div className="flex-1 overflow-y-auto p-6">
          {isLoading && <[FeatureName]Skeleton />}
          {!isLoading && items.length === 0 && (
            <[FeatureName]Empty onAction={() => setDialogOpen(true)} />
          )}
          {!isLoading && items.length > 0 && (
            <div className="space-y-2">
              {items.map((item) => (
                <[FeatureName]Item key={item.id} item={item} />
              ))}
            </div>
          )}
        </div>
      </div>

      <[FeatureName]Form
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSuccess={() => setDialogOpen(false)}
      />
    </>
  );
};
```

---

### File 8 — `lib/components/[parent]/[feature-names]/[feature-name]-item.component.tsx`

```tsx
"use client";

import type { [FeatureName] } from "@/lib/types";

interface [FeatureName]ItemProps {
  item: [FeatureName];
}

export const [FeatureName]Item = ({ item }: [FeatureName]ItemProps) => {
  return (
    <div className="rounded-lg border border-border bg-card p-4">
      <h3 className="font-medium text-foreground">{item.name}</h3>
      {item.description && (
        <p className="mt-1 text-sm text-muted-foreground">{item.description}</p>
      )}
    </div>
  );
};
```

---

### File 9 — `lib/components/[parent]/[feature-names]/[feature-name]-form.component.tsx`

```tsx
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useParams } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { [featureName]Schema, type T[FeatureName]FormData } from "@/lib/schemas";
import { useCreate[FeatureName] } from "@/lib/services/[feature-names]/[feature-names].service";

interface [FeatureName]FormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export const [FeatureName]Form = ({ open, onOpenChange, onSuccess }: [FeatureName]FormProps) => {
  const { agentId } = useParams<{ agentId: string }>();

  const form = useForm<T[FeatureName]FormData>({
    resolver: zodResolver([featureName]Schema),
    defaultValues: { name: "", description: "" },
  });

  const { mutate: create, isPending } = useCreate[FeatureName]({
    onSuccess: () => {
      form.reset();
      onSuccess();
    },
  });

  const onSubmit = (payload: T[FeatureName]FormData) => {
    create({ agentId, payload });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>New [FeatureName]</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="[FeatureName] name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={isPending}>
                {isPending ? "Creating..." : "Create"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
```

---

### File 10 — `lib/components/[parent]/[feature-names]/[feature-name]-skeleton.component.tsx`

```tsx
import { Skeleton } from "@/components/ui/skeleton";

export const [FeatureName]Skeleton = () => (
  <div className="space-y-2">
    {Array.from({ length: 3 }).map((_, i) => (
      <Skeleton key={i} className="h-16 w-full rounded-lg" />
    ))}
  </div>
);
```

---

### File 11 — `lib/components/[parent]/[feature-names]/[feature-name]-empty.component.tsx`

```tsx
interface [FeatureName]EmptyProps {
  onAction: () => void;
}

export const [FeatureName]Empty = ({ onAction }: [FeatureName]EmptyProps) => (
  <div className="flex flex-col items-center justify-center py-16 text-center">
    <p className="text-muted-foreground text-sm">No [feature-names] yet.</p>
    <button
      onClick={onAction}
      className="mt-3 text-sm text-primary underline-offset-4 hover:underline"
    >
      Create your first [feature-name]
    </button>
  </div>
);
```

---

### File 12 — `app/[parent-route]/[feature-names]/page.tsx`

```tsx
import { [FeatureNames] } from "@/lib/components/[parent]/[feature-names]/[feature-names].component";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "[FeatureNames] - App Name",
  description: "Manage your [feature-names].",
};

export default function [FeatureNames]Page() {
  return <[FeatureNames] />;
}
```

---

### File 13 — `app/[parent-route]/[feature-names]/loading.tsx`

```tsx
import { [FeatureName]Skeleton } from "@/lib/components/[parent]/[feature-names]/[feature-name]-skeleton.component";

export default function Loading() {
  return <[FeatureName]Skeleton />;
}
```

---

## After generating

1. Verify all barrel exports (`index.ts` files) are updated.
2. Verify `ENDPOINTS` and `ROUTE_PATHS` constants have the new feature entries.
3. Do not add extra abstractions, HOCs, or utilities that aren't in the template above.
