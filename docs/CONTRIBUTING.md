# Contributing to Compooss

Thank you for your interest in contributing! Here is everything you need to know.

---

## Code of Conduct

By participating in this project you agree to abide by our [Code of Conduct](CODE_OF_CONDUCT.md).

---

## Before You Start

- Search [existing issues](https://github.com/abdullahmia/compooss/issues) before opening a new one.
- For large changes, open an issue first to discuss the approach — this avoids wasted effort.
- Branch from `development`, not `main`.

---

## Reporting Bugs

Open an issue using the **Bug Report** template. Include:

- A clear, descriptive title
- Steps to reproduce
- Expected vs actual behaviour
- Your environment (OS, Bun version, Docker version, MongoDB version)
- Relevant logs or screenshots

---

## Suggesting Features

Open an issue using the **Feature Request** template. Describe:

- The problem or limitation it addresses
- Your proposed solution
- Any alternatives you considered

---

## Pull Requests

### 1. Fork & branch

```bash
git clone https://github.com/abdullahmia/compooss.git
cd compooss
git checkout development
git checkout -b feat/your-feature-name
# or: fix/your-bug-fix
```

### 2. Install dependencies

```bash
bun install
```

### 3. Make your changes

Follow the coding standards below. Keep PRs focused — one feature or fix per PR.

### 4. Check before submitting

```bash
bun lint
bun type-check
```

### 5. Commit

Follow [Conventional Commits](https://www.conventionalcommits.org) — Commitlint will reject non-conforming messages:

```
feat: add collection rename dialog
fix: correct index drop confirmation behaviour
docs: update development guide
```

### 6. Push and open a PR

- Fill out the pull request template
- Reference any related issues (`Closes #123`)
- Describe what changed and why

---

## Project Structure

```
apps/compooss/src/lib/
├── components/   # UI components, grouped by feature
├── config/       # ApiClient singleton
├── constants/    # ENDPOINTS and ROUTE_PATHS
├── core-modules/ # Base repository + shell evaluator
├── driver/       # MongoDriver + ConnectionManager
├── hooks/        # Zustand ↔ URL/session bridge hooks
├── providers/    # React context providers
├── schemas/      # Zod schemas + form types
├── services/     # TanStack Query hooks
├── storage/      # IndexedDB browser-side connection store
├── stores/       # Zustand stores
└── types/        # TypeScript entity + response types
```

See [`docs/DEVELOPMENT.md`](DEVELOPMENT.md) for the full architecture guide.

---

## Coding Standards

- **TypeScript** for all new code — no `any` without a comment explaining why.
- Follow the existing **ESLint** configuration (`bun lint` must pass).
- Use **functional components** and hooks — no class components.
- Keep components small and focused; one responsibility per file.
- Name files `kebab-case.component.tsx` and use named exports.
- Import from `@/` aliases — never relative paths like `../../`.

---

## Questions?

Open a [Discussion](https://github.com/abdullahmia/compooss/discussions) or an issue.
