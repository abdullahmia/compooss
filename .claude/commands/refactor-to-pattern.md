# /refactor-to-pattern

Refactor a specific file or feature to match the project's standard patterns defined in `claude-code/CLAUDE.md`.

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

1. **Read** the target file(s). If a feature name is given, find all related files first.
2. **Read** `claude-code/CLAUDE.md` for the applicable pattern rules.
3. **Identify** every deviation — list them before making any changes.
4. **Confirm** the list of changes with the user before editing.
5. **Apply** changes one file at a time, following the exact patterns from `CLAUDE.md`.
6. **Update** barrel `index.ts` files if exports changed.
7. **Do not** change unrelated files or add unrequested improvements.

---

## Common refactors

### Service file

- Extract inline query keys into a `[feature]-query.key.ts` file
- Rename hooks to `useGet[Feature]`, `useCreate[Feature]`, etc.
- Add `options: MutationOptions<T> = {}` parameter to all mutations
- Spread `...options` at the top of `useMutation({...})`
- Add `options.onSuccess?.(data, variables, context, mutation)` after invalidation
- Replace inline `fetch` calls with `apiClient.[method]`
- Replace hardcoded strings with `ENDPOINTS.[FEATURE].[ACTION]`
- Add `enabled: !!param` guards
- Add `?? []` fallback on list queries

### Type file

- Convert `interface` to `type` for entity types
- Change `Date` fields to `string`
- Add `T` prefix to response types
- Add `Response` suffix to response types
- Add barrel export

### Schema file

- Change `z.infer` to `z.input` for form types
- Derive update schema from create schema with `.partial()`
- Add `T` prefix to form types
- Add barrel export

### Component file

- Add `"use client"` if hooks are used
- Rename file to `kebab-case.component.tsx`
- Change default export to named export (unless it's the main page component)
- Fix imports to use `@/` alias
- Add skeleton and empty state handling
- Change `interface XxxProps { ... }` to `type Props = { ... }`
- Change `export const Foo = (...) => {}` to `export const Foo: React.FC<Props> = (...) => {}` (omit `<Props>` when there are no props)
- Extract any helper component used in more than one file into its own `[name].component.tsx`
- Move inline static arrays / option lists to `lib/constants/[feature].constants.ts` and import from `@/lib/constants`

### Route file (`page.tsx`)

- Extract all logic and JSX into a component in `lib/components/`
- Reduce page to metadata + single component render
- Convert `generateMetadata` to static `metadata` if no dynamic data needed
