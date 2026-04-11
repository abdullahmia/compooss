# /refactor-to-pattern

Refactor a specific file or feature to match the project's standard patterns defined in `CLAUDE.md`.

## Usage

```
/refactor-to-pattern <file-path-or-feature-name>
```

**Examples**
```
/refactor-to-pattern lib/services/automations/automations.service.ts
/refactor-to-pattern Automations
/refactor-to-pattern lib/components/chat/settings
```

---

## Process

1. **Read** the target file(s). If a feature name is given, find all related files first — types, schemas, services, components, and pages.
2. **Read** `CLAUDE.md` for the applicable pattern rules.
3. **Identify every deviation** across all layers — list them grouped by layer before making any changes.
4. **Confirm** the full list of changes with the user before editing.
5. **Apply** changes **layer by layer in this order**:
   1. Schema (`lib/schemas/`)
   2. Service (`lib/services/[feature]/`)
   3. Components (`lib/components/[feature]/`)
   4. Pages (`app/[route]/page.tsx` + `loading.tsx`)
6. **Update** all barrel `index.ts` files when exports change.
7. **Update** any downstream files that import from the old paths.
8. **Do not** change unrelated files or add unrequested improvements.

---

## Layer-by-layer refactor order

### 1. Schema (`lib/schemas/[feature].schema.ts`)

- Change `z.infer` to `z.input` for form types
- Rename form types to `T[Feature]FormData` pattern
- Derive update schema from create schema with `.partial()`
- Add barrel export to `lib/schemas/index.ts`

### 2. Service (`lib/services/[feature]/`)

**Query key file** (`[feature]-query.key.ts`):
- Extract inline or global query keys into a dedicated `[feature]-query.key.ts` file
- Keys are tuple functions returning `as const`; shape goes broad → specific

**Service hooks** (`[feature].service.ts`):
- Add `TMutationOptions<TData, TVariables>` parameter to all mutations (import from `@/lib/query.types`)
- Spread `...options` at the top of every `useMutation({...})`
- Replace `refetch()` calls with `queryClient.invalidateQueries({ queryKey: ... })`
- Call `options.onSuccess?.(data, variables, context)` after invalidation
- Remove `toast` calls from the service layer — move them to the caller
- Remove ad-hoc `{ onSuccess?, onError? }` option shapes
- Replace inline `fetch` calls with `apiClient.[method]`
- Replace hardcoded endpoint strings with `ENDPOINTS.[FEATURE].[ACTION]`
- Add `enabled: !!param` guards on every `useQuery` with dynamic params
- Add `?? []` fallback on list queries
- Import schema types from `@/lib/schemas` barrel (not individual schema files)

### 3. Components (`lib/components/[feature]/`)

- Move files from `src/components/` to `lib/components/[feature]/`
- Rename files to `kebab-case.component.tsx`
- Change `export function Foo(...)` to `export const Foo: React.FC<Props> = (...) => {}`
- Change `interface XxxProps` to `type Props = { ... }`
- Fix all imports to use `@/` alias — never relative paths like `../../`
- Update any downstream files that imported from the old path
- Extract any helper component used in more than one file into its own `[name].component.tsx`
- Move inline static arrays / option lists to `lib/constants/[feature].constants.ts` and import from `@/lib/constants`
- Move any inline utility/helper functions (e.g. `formatBytes`, `getLabel`) to `lib/utils/[name].util.ts`, add a barrel export to `lib/utils/index.ts`, and import from `@/lib/utils`
- Add `"use client"` if the component uses hooks or browser APIs

### 4. Route files (`app/[route]/page.tsx`)

- Extract all logic and JSX into a component in `lib/components/[feature]/`
- Add `export const metadata: Metadata = { ... }` (static)
- Use `generateMetadata` only when title/description depend on fetched data
- Remove `<Suspense>` wrappers from the page — replace with a `loading.tsx` sibling
- Reduce page to: `metadata` export + single component render

---

## Common refactors reference

### Type file

- Convert `interface` to `type` for entity types
- Change `Date` fields to `string`
- Add `T` prefix to response types, `Response` suffix
- Add barrel export to `lib/types/index.ts`

### Zustand store

- Add `"use client"` at top
- Use `interface` for the store shape (state + actions together)
- Add `getInitialState()` helper function; use it in `create(...)` and `reset()`
- Use `set((s) => ({...}))` when new state derives from old state
