# Web App — Architecture & Coding Patterns

Copy this file to the root of any Next.js project you want to follow this pattern.
It describes every convention used in this codebase so Claude always generates consistent code.

---

## Stack

| Layer | Tool |
|---|---|
| Framework | Next.js 15 App Router (TypeScript) |
| Server state | TanStack Query v5 |
| Client state | Zustand |
| Validation | Zod |
| UI components | shadcn/ui (imported from your UI package) |
| HTTP client | Custom `ApiClient` class wrapping native `fetch` |

---

## Directory Map

```
app/                          ← Next.js App Router pages (thin shells only)
lib/
  components/[feature]/       ← UI components grouped by route/feature
  config/                     ← ApiClient, QueryClient singletons
  constants/                  ← ENDPOINTS, ROUTE_PATHS, and other constant objects
  hooks/                      ← Thin custom hooks (Zustand ↔ URL / session bridge)
  schemas/                    ← Zod validation schemas + inferred form types
  services/[feature]/         ← TanStack Query hooks (useQuery / useMutation)
  stores/                     ← Zustand stores
  types/                      ← TypeScript entity + response types
```

---

## 1. App Routes

**Rule: every `page.tsx` is a thin shell — metadata + one component render, nothing else.**

```tsx
// app/[feature]/page.tsx
import { FeatureComponent } from "@/lib/components/[feature]/[feature].component";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "[Feature] - App Name",
  description: "One-sentence description.",
};

export default function FeaturePage() {
  return <FeatureComponent />;
}
```

```tsx
// app/[feature]/layout.tsx  — wraps with one component, nothing else
import { FeatureLayout } from "@/lib/components/[feature]/[feature]-layout/[feature]-layout.component";

export default function Layout({ children }: { children: React.ReactNode }) {
  return <FeatureLayout>{children}</FeatureLayout>;
}
```

- Metadata is always `export const metadata: Metadata = { ... }` (static).  
  Use `generateMetadata` only when title/description depend on fetched data.
- Add `loading.tsx` as a Suspense skeleton for any route that fetches.
- Dynamic params use bracket folders: `[id]`, `[agentId]`, etc. Params are read  
  in client components via `useParams()`.

---

## 2. Components

### File & folder structure

```
lib/components/
  [feature]/
    [feature].component.tsx              ← main container
    [feature]-[part].component.tsx       ← sub-components
    [feature]-skeleton.component.tsx     ← loading skeleton
    [feature]-empty.component.tsx        ← empty state
    [feature]-form.component.tsx         ← create/edit dialog form
    [sub-feature]/                       ← nested features get their own sub-folder
      [sub-feature].component.tsx
```

### Rules

- **File names**: always `kebab-case.component.tsx`.
- **Exports**: named exports (`export const Foo = () => {}`). Only the root feature component can be a default export when the `page.tsx` imports it.
- **`"use client"`** at the top of every file that uses hooks, state, or browser APIs.
- **shadcn/ui**: import from `@/components/ui/[name]` (or your configured UI package path).
- **Icons**: import from `lucide-react`.
- **Aliases**: always `@/` — never relative paths like `../../`.
- **Props type**: always `type Props = { ... }` — never `interface XxxProps { ... }`.
- **Component signature**: always `export const Foo: React.FC<Props> = () => {}`. For components with no props use `React.FC` with no type argument.
- **Reusable sub-components**: if a helper component (e.g. `FieldRow`) is used in more than one file, extract it into its own `[name].component.tsx` file in the same feature folder and import it with `@/` alias.
- **Feature-level static data**: static arrays/maps used inside a feature (e.g. `AUTH_METHODS`) belong in `lib/constants/[feature].constants.ts`, exported via the barrel, and imported from `@/lib/constants`.

### Anatomy of a feature component

```tsx
"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useGetFeatures } from "@/lib/services/feature/feature.service";
import { FeatureForm } from "./feature-form.component";
import { FeatureSkeleton } from "./feature-skeleton.component";
import { FeatureEmpty } from "./feature-empty.component";
import { FeatureItem } from "./feature-item.component";

export const Feature: React.FC = () => {
  const { agentId } = useParams<{ agentId: string }>();
  const [dialogOpen, setDialogOpen] = useState(false);

  const { data: items = [], isLoading } = useGetFeatures(agentId);

  return (
    <>
      {isLoading && <FeatureSkeleton />}
      {!isLoading && items.length === 0 && (
        <FeatureEmpty onAction={() => setDialogOpen(true)} />
      )}
      {!isLoading && items.length > 0 && (
        <div className="space-y-2">
          {items.map((item) => (
            <FeatureItem key={item.id} item={item} />
          ))}
        </div>
      )}

      <FeatureForm
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSuccess={() => setDialogOpen(false)}
      />
    </>
  );
};
```

---

## 3. API Client (`lib/config/api.config.ts`)

One singleton wrapping native `fetch`. **Never call `fetch` directly in services or components.**

```ts
import { ApiClientError } from "@/lib/types";

export class ApiClient {
  constructor(private baseURL: string) {}

  async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> { /* ... */ }

  get<T>(endpoint: string, options?: RequestInit): Promise<T>
  post<T>(endpoint: string, body?: unknown, options?: RequestInit): Promise<T>
  put<T>(endpoint: string, body?: unknown, options?: RequestInit): Promise<T>
  patch<T>(endpoint: string, body: unknown, options?: RequestInit): Promise<T>
  delete<T>(endpoint: string, options?: RequestInit): Promise<T>
}

export const apiClient = new ApiClient(process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000");
```

- Throws `ApiClientError(status, message, response)` on non-2xx responses.
- Handles 401 → session refresh → retry once automatically.
- Passes `credentials: "include"` on every request.

---

## 4. Constants (`lib/constants/`)

One file per domain, all re-exported from `index.ts`.

```ts
// endpoints.constants.ts
export const ENDPOINTS = {
  FEATURE: {
    LIST: "/api/features",
    DETAIL: (id: string) => `/api/features/${id}`,
    ACTION: (id: string) => `/api/features/${id}/action`,
  },
} as const;

// route-paths.constant.ts
export const ROUTE_PATHS = {
  FEATURE: {
    ROOT: "/feature",
    DETAIL: (id: string) => `/feature/${id}`,
  },
} as const;
```

- Always `as const`.
- Dynamic segments are **functions**, not string templates at the call site.
- Import from `@/lib/constants` (the barrel), never from individual files.
- Feature-level static data (lookup tables, option lists, method maps) also lives here in a `[feature].constants.ts` file — not inline in components.

---

## 5. Custom Hooks (`lib/hooks/`)

File name: `use-[description].hook.ts`

```ts
"use client";

import { useEffect } from "react";
import { useFeatureStore } from "@/lib/stores/feature.store";

export function useFeatureSync() {
  const value = useFeatureStore((s) => s.value);
  const setValue = useFeatureStore((s) => s.setValue);

  useEffect(() => {
    // bridge logic: URL params → store, session → store, etc.
  }, []);

  return { value, setValue };
}
```

- `"use client"` always present.
- Named export matches file name (camelCase).
- Hooks here bridge Zustand stores with URL params, session data, or other external sources.  
  Do not put business logic hooks here — those belong in services.

---

## 6. Zod Schemas (`lib/schemas/`)

File name: `[feature].schema.ts`

```ts
import { z } from "zod";

export const featureSchema = z.object({
  name: z.string().min(1, "Name is required").max(100, "Name must be at most 100 characters"),
  description: z.string().max(500, "Description must be at most 500 characters").optional().default(""),
});

export type TFeatureFormData = z.input<typeof featureSchema>;

// Update is a partial of create unless the shape differs materially
export const updateFeatureSchema = featureSchema.partial();
export type TUpdateFeatureFormData = z.input<typeof updateFeatureSchema>;
```

- Type inference: `z.input<typeof schema>` (not `z.infer`) — preserves optional defaults.
- Form data types prefixed with `T`: `TFeatureFormData`.
- Add to `lib/schemas/index.ts`.

---

## 7. Services (`lib/services/`)

### Two files per feature

```
lib/services/[feature]/
  [feature]-query.key.ts   ← query key factory object
  [feature].service.ts     ← useQuery / useMutation hooks
```

### Query key factory

```ts
// [feature]-query.key.ts
export const FEATURE_QUERY_KEYS = {
  list:   (agentId: string) => ["feature", agentId] as const,
  detail: (id: string)      => ["feature", "details", id] as const,
} as const;
```

- Keys are **tuple functions** returning `as const`.
- Shape goes broad → specific so `invalidateQueries({ queryKey: FEATURE_QUERY_KEYS.list(id) })` automatically covers all list variants.

### Service hooks

```ts
// [feature].service.ts
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { FEATURE_QUERY_KEYS } from "./feature-query.key";
import { apiClient } from "@/lib/config/api.config";
import { ENDPOINTS } from "@/lib/constants";
import type { ApiResponse } from "@/lib/types"; // or your shared package
import type { Feature, TFeatureCreateResponse, TDeleteFeatureResponse, MutationOptions } from "@/lib/types";
import type { TFeatureFormData, TUpdateFeatureFormData } from "@/lib/schemas";

// ─── Queries ──────────────────────────────────────────────────────────────────

export const useGetFeatures = (agentId: string) =>
  useQuery({
    queryKey: FEATURE_QUERY_KEYS.list(agentId),
    queryFn: async () => {
      const res = await apiClient.get<ApiResponse<Feature[]>>(ENDPOINTS.FEATURE.LIST(agentId));
      return res.data ?? [];
    },
    enabled: !!agentId,
  });

export const useGetFeatureDetails = (agentId: string, featureId: string) =>
  useQuery({
    queryKey: FEATURE_QUERY_KEYS.detail(featureId),
    queryFn: async () => {
      const res = await apiClient.get<ApiResponse<Feature>>(ENDPOINTS.FEATURE.DETAIL(agentId, featureId));
      return res.data;
    },
    enabled: !!agentId && !!featureId,
  });

// ─── Mutations ────────────────────────────────────────────────────────────────

export const useCreateFeature = (options: MutationOptions<TFeatureCreateResponse> = {}) => {
  const queryClient = useQueryClient();
  return useMutation({
    ...options,
    mutationFn: async ({ agentId, payload }: { agentId: string; payload: TFeatureFormData }) =>
      apiClient.post<TFeatureCreateResponse>(ENDPOINTS.FEATURE.LIST(agentId), payload),
    onSuccess: (data, variables, context, mutation) => {
      queryClient.invalidateQueries({ queryKey: FEATURE_QUERY_KEYS.list(data.data.agentId) });
      options.onSuccess?.(data, variables, context, mutation);
    },
  });
};

export const useUpdateFeature = (options: MutationOptions<TUpdateFeatureResponse> = {}) => {
  const queryClient = useQueryClient();
  return useMutation({
    ...options,
    mutationFn: async ({ agentId, featureId, payload }: { agentId: string; featureId: string; payload: TUpdateFeatureFormData }) =>
      apiClient.patch<TUpdateFeatureResponse>(ENDPOINTS.FEATURE.DETAIL(agentId, featureId), payload),
    onSuccess: (data, variables, context, mutation) => {
      queryClient.invalidateQueries({ queryKey: FEATURE_QUERY_KEYS.list(data.data.agentId) });
      queryClient.invalidateQueries({ queryKey: FEATURE_QUERY_KEYS.detail(variables.featureId) });
      options.onSuccess?.(data, variables, context, mutation);
    },
  });
};

export const useDeleteFeature = (options: MutationOptions<TDeleteFeatureResponse> = {}) => {
  const queryClient = useQueryClient();
  return useMutation({
    ...options,
    mutationFn: async ({ agentId, featureId }: { agentId: string; featureId: string }) =>
      apiClient.delete<TDeleteFeatureResponse>(ENDPOINTS.FEATURE.DETAIL(agentId, featureId)),
    onSuccess: (data, variables, context, mutation) => {
      queryClient.invalidateQueries({ queryKey: FEATURE_QUERY_KEYS.list(variables.agentId) });
      options.onSuccess?.(data, variables, context, mutation);
    },
  });
};
```

#### Critical rules

| Rule | Why |
|---|---|
| Mutations accept `options: MutationOptions<T> = {}` | Callers can attach their own `onSuccess`/`onError` |
| Always spread `...options` first, then override `mutationFn` + `onSuccess` | Prevents callers from accidentally overriding internals |
| Always call `options.onSuccess?.(...)` after invalidation | Callers need their callback to fire after cache is fresh |
| `enabled: !!param` guard on every `useQuery` | Prevents fetch with empty/undefined IDs |
| `res.data ?? []` fallback on list queries | Prevents null crashes when API returns `{ data: null }` |
| Invalidate `list` on create/delete, `list` + `detail` on update | Keeps all cache views consistent |

---

## 8. Zustand Stores (`lib/stores/`)

File name: `[name].store.ts`

```ts
"use client";

import { create } from "zustand";

interface FeatureStore {
  // ─── State ───────────────────────────────────────────────────────────────
  items: Item[];
  selectedId: string | null;
  isOpen: boolean;

  // ─── Actions ─────────────────────────────────────────────────────────────
  setItems: (items: Item[]) => void;
  setSelectedId: (id: string | null) => void;
  toggle: () => void;
  reset: () => void;
}

function getInitialState() {
  return {
    items: [],
    selectedId: null,
    isOpen: false,
  };
}

export const useFeatureStore = create<FeatureStore>((set, get) => ({
  ...getInitialState(),

  setItems: (items) => set({ items }),
  setSelectedId: (id) => set({ selectedId: id }),
  toggle: () => set((s) => ({ isOpen: !s.isOpen })),
  reset: () => set(getInitialState()),
}));
```

- `"use client"` always at top.
- Interface declares state and actions together.
- `getInitialState()` function makes `reset()` trivial and testable.
- `set((s) => ({...}))` when new state derives from old state.
- `get()` when an action needs multiple pieces of current state.
- Export only the hook — no selectors file needed.

---

## 9. Types (`lib/types/`)

File name: `[feature].type.ts`

```ts
// Entity — plain type alias, all fields present
export type Feature = {
  id: string;
  agentId: string;
  name: string;
  description: string;
  createdAt: string;   // ISO 8601 string from API — never Date
  updatedAt: string;
};

// Response types — T prefix, Response suffix
export type TFeatureCreateResponse = {
  success: boolean;
  data: Feature;
};

export type TUpdateFeatureResponse = {
  success: boolean;
  data: Feature;
};

export type TDeleteFeatureResponse = {
  success: boolean;
};
```

- Entity types are `type` aliases (not `interface`).
- All date fields are `string`.
- Response types: `T[Verb][Entity]Response` naming.
- Add to `lib/types/index.ts` barrel export.

---

## New Feature Checklist

Run through this in order when adding a CRUD feature named **"Tags"**:

- [ ] `lib/types/tags.type.ts` → add export to `lib/types/index.ts`
- [ ] `lib/schemas/tags.schema.ts` → add export to `lib/schemas/index.ts`
- [ ] Add `TAGS` block to `ENDPOINTS` in `lib/constants/endpoints.constants.ts`
- [ ] Add `TAGS` block to `ROUTE_PATHS` in `lib/constants/route-paths.constant.ts`
- [ ] `lib/services/tags/tags-query.key.ts`
- [ ] `lib/services/tags/tags.service.ts`
- [ ] `lib/components/[parent]/tags/tags.component.tsx`
- [ ] `lib/components/[parent]/tags/tag-item.component.tsx`
- [ ] `lib/components/[parent]/tags/tag-form.component.tsx`
- [ ] `lib/components/[parent]/tags/tag-skeleton.component.tsx`
- [ ] `lib/components/[parent]/tags/tag-empty.component.tsx`
- [ ] `app/[parent]/tags/page.tsx` (thin shell)
- [ ] `app/[parent]/tags/loading.tsx` (skeleton wrapper)
- [ ] `lib/stores/tags.store.ts` (only if client-only state is needed)
- [ ] `lib/hooks/use-tags-[bridge].hook.ts` (only if bridging needed)

Do **not** deviate from naming conventions even for "simple" features.
