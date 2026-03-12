---
project_name: 'compooss'
user_name: 'Abdullah Mia'
date: '2026-03-11T00:00:00.000Z'
sections_completed: ['technology_stack']
existing_patterns_found: { 0 }
---

# Project Context for AI Agents

_This file contains critical rules and patterns that AI agents must follow when implementing code in this project. Focus on unobvious details that agents might otherwise miss._

---
 
## Technology Stack & Versions

- Next.js ^16.1.6
- React ^19.0.0
- TypeScript ^5.8.3 (not strict mode; `strict`, `strictNullChecks`, and related flags are disabled)
- Tailwind CSS ^4.1.0
- Vitest ^3.2.4 (no tests written yet)
- Storybook ^10.2.17
- MongoDB Node.js driver ^7.1.0

## Critical Implementation Rules

The following rules are **mandatory** for all agents and contributors:

- **Mongo access via shared driver + helpers only**:
  - Never instantiate `MongoClient` directly in route handlers, services, components, or ad-hoc utilities.
  - All MongoDB access must go through the **singleton driver** and server helpers:
    - Driver: `src/lib/driver/mongodb.driver.ts` (OOP-style `MongoDriver` singleton, exported as `mongoDriver`).
    - Server helpers and services call `mongoDriver` methods (for example, `ping()`, `listDatabases()`, `getDb()`, etc.).
- **No `/api/*` for internal flows**: Do not build JSON REST-style `/api/*` endpoints for app-internal behaviour. Reads and writes must be implemented via:
  - Server components that call server-only helpers, and/or
  - Server actions invoked from forms / client components.
- **Client code never talks to Mongo or env vars**: Client components must not access MongoDB, `process.env`, or any driver types. They only receive plain props from server components/actions.

- **Service / action / types layering per domain**:
  - For each domain (for example `connection`, `database`, `collection`, `document`, etc.), follow this pattern:
    - **Types**: `src/lib/types/<domain>.types.ts` (pure TypeScript types and interfaces only).
    - **Service layer**: `src/lib/services/<domain>/<domain>.service.ts` (server-only business logic and CRUD operations; talks to `mongoDriver` / helpers, never to React).
    - **Server actions**: `src/lib/services/<domain>/<domain>.action.ts` (Next.js server actions used by forms / client components; call the service layer and return typed results).
  - All new CRUD-style logic must live in `*.service.ts` and be invoked from `*.action.ts`; do not put business logic directly in components or route files.

- **Naming conventions**:
  - **Component files**: Always use **kebab-case** for React component files, for example `shell-preview.tsx`, not `ShellPreview.tsx`.
  - **TypeScript types**: All type aliases must start with `T` (for example `TUser`, `TConnectionConfig`).
  - **TypeScript interfaces**: All interfaces must start with `I` (for example `IAuthResponse`, `IHealthCheckResult`).

- **Lib folder structure & naming**:
  - **Utilities**:
    - All shared utilities under `src/lib` must live in `src/lib/utils/`.
    - Utility files must be named using the pattern `something.utils.ts` (for example `time.utils.ts`, `string.utils.ts`).
  - **Zod schemas**:
    - All validation schemas must live in `src/lib/schemas/`.
    - Schema files must be named using the pattern `<domain>.schema.ts` (for example `user.schema.ts`, `connection.schema.ts`).
  - **Custom hooks**:
    - All reusable hooks must live in `src/lib/hooks/`.
    - Hook files must be named using the pattern `<name>.hook.ts` and start with `use-` (for example `use-mobile.hook.ts`, `use-toast.hook.ts`).

- **Form input components**:
  - All text/number/email/etc. inputs in the UI must use the shared React Hook Form–aware input component at `src/components/ui/input/input.tsx`.
  - Do **not** use raw `<input />` elements directly in feature components; replace them with the shared `Input` component so validation, styling, and accessibility stay consistent.

- **Git workflow & commit messages**:
  - When a story is implemented (status moved to `done`), the dev agent **must create a Git commit** that includes all related changes.
  - Commit messages must follow the conventional commit rules enforced by `commitlint.config.mjs` (extends `@commitlint/config-conventional`):
    - Allowed types include: `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `build`, `ci`, `chore`, `revert`.
    - Subjects must **not** be upper-case only and headers must be ≤ 100 characters.
  - Prefer commit types that reflect the work:
    - New stories/features → `feat: ...`
    - Pure refactors / architecture alignment → `refactor: ...`
    - Story-only documentation updates → `docs: ...`

