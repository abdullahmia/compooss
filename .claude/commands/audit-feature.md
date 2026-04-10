# /audit-feature

Audit an existing feature for deviations from the project's standard patterns.

## Usage

```
/audit-feature <FeatureName>
```

**Example**
```
/audit-feature Automations
/audit-feature Projects
```

---

## What to check

For the given feature name, find and read all related files across:

- `lib/types/`
- `lib/schemas/`
- `lib/constants/endpoints.constants.ts` and `lib/constants/route-paths.constant.ts`
- `lib/services/[feature]/`
- `lib/components/**/[feature]/` (and any parent component directory)
- `app/**/[feature]/`
- `lib/stores/` (if a store exists)
- `lib/hooks/` (if a hook exists)

Then check each file against the rules in `claude-code/CLAUDE.md` and report:

---

## Report format

```
## Audit: [FeatureName]

### Files found
- lib/types/feature.type.ts ✓
- lib/schemas/feature.schema.ts ✓
- lib/services/features/features.service.ts ✓
- lib/services/features/features-query.key.ts ✓
- ... (list every file found)

### Issues

#### [file path]
- [ ] Issue description — expected: X, found: Y
- [ ] Issue description — expected: X, found: Y

#### [file path]
- [ ] Issue description

### Missing files
- [ ] lib/components/feature/feature-skeleton.component.tsx — not found
- [ ] app/feature/loading.tsx — not found

### Summary
N issues across M files. N files missing.
```

---

## What to flag

### Types (`lib/types/`)
- [ ] Type alias uses `interface` instead of `type`
- [ ] Date fields typed as `Date` instead of `string`
- [ ] Response types missing `T` prefix or `Response` suffix
- [ ] Not exported from `lib/types/index.ts`

### Schemas (`lib/schemas/`)
- [ ] Type inferred with `z.infer` instead of `z.input`
- [ ] Form type missing `T` prefix
- [ ] Update schema not derived from create schema via `.partial()`
- [ ] Not exported from `lib/schemas/index.ts`

### Constants
- [ ] Endpoints defined as inline strings in services instead of using `ENDPOINTS`
- [ ] Route paths hardcoded in components instead of using `ROUTE_PATHS`
- [ ] Dynamic segments built with string concatenation at call site instead of a function
- [ ] Missing `as const`

### Services (`lib/services/[feature]/`)
- [ ] Query key file missing — keys inlined in service file
- [ ] Query keys not tuples (not `as const`)
- [ ] `useQuery` hook not named `useGet[Feature]` or `useGet[Feature]Details`
- [ ] `useMutation` hook not named `useCreate/Update/Delete[Feature]`
- [ ] Mutation does not accept `options: MutationOptions<T> = {}`
- [ ] Mutation does not spread `...options` before overriding `mutationFn`
- [ ] `onSuccess` does not call `options.onSuccess?.(data, variables, context, mutation)`
- [ ] `enabled` guard missing on `useQuery` with dynamic params
- [ ] List query missing `?? []` fallback
- [ ] Cache invalidation missing or wrong (e.g. only invalidates detail, not list)
- [ ] Raw `fetch` used instead of `apiClient`
- [ ] Endpoints hardcoded instead of using `ENDPOINTS`

### Components (`lib/components/`)
- [ ] File not in `lib/components/[feature]/` directory
- [ ] File not named `kebab-case.component.tsx`
- [ ] Uses default export where named export is expected (or vice versa)
- [ ] Missing `"use client"` directive on a file with hooks
- [ ] shadcn/ui imported from wrong path
- [ ] Relative imports instead of `@/` alias
- [ ] No skeleton component for loading state
- [ ] No empty state component
- [ ] Loading state not handled in component

### Routes (`app/`)
- [ ] `page.tsx` contains more than metadata + one component render
- [ ] Static metadata defined via `generateMetadata` unnecessarily
- [ ] Missing `loading.tsx`
- [ ] Layout contains logic instead of delegating to a component

### Stores (`lib/stores/`)
- [ ] Missing `"use client"`
- [ ] No `getInitialState()` function (making reset difficult)
- [ ] State and actions in separate interfaces
- [ ] Default export instead of named `useXxxStore` export
