# Development Guide

This document covers how to set up and work on Compooss locally.

## Prerequisites

- **Node.js** 18+ (recommend [nvm](https://github.com/nvm-sh/nvm))
- **npm** 9+
- **MongoDB** (local or Docker) for testing the client

## Local Setup

```sh
# Clone the repository
git clone <REPO_URL>
cd compooss

# Install dependencies (use --legacy-peer-deps if you hit peer dependency conflicts)
npm install --legacy-peer-deps

# Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Scripts

| Command        | Description                    |
| -------------- | ------------------------------ |
| `npm run dev`  | Start Next.js dev server       |
| `npm run build`| Production build               |
| `npm run start`| Run production server          |
| `npm run lint` | Run ESLint                     |
| `npm run test` | Run Vitest tests               |
| `npm run prepare` | Husky setup (runs on install) |

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **UI**: React 19, Tailwind CSS, shadcn/ui components
- **Language**: TypeScript
- **Testing**: Vitest, Testing Library
- **Linting**: ESLint (Next.js config)
- **Commits**: Husky + Commitlint (Conventional Commits)

## Project Structure

```
compooss/
├── src/
│   ├── app/           # Next.js app router (pages, layout)
│   ├── components/    # React components
│   └── lib/           # Utilities, MongoDB client, etc.
├── public/            # Static assets
├── docs/              # Project documentation
├── .husky/            # Git hooks
└── commitlint.config.mjs
```

## MongoDB for Local Testing

Run MongoDB via Docker:

```sh
docker run -d -p 27017:27017 --name mongo-dev mongo:latest
```

Connection string: `mongodb://localhost:27017`

## Commit Conventions

We use [Conventional Commits](https://www.conventionalcommits.org/):

- `feat:` – New feature
- `fix:` – Bug fix
- `docs:` – Documentation only
- `style:` – Formatting, no code change
- `refactor:` – Code change, no feature/fix
- `test:` – Adding or updating tests
- `chore:` – Maintenance tasks

Example: `feat: add collection document list view`

## Pull Request Process

1. Create a branch from `main`
2. Make changes and ensure `npm run lint` and `npm run test` pass
3. Open a PR with a clear description
4. Address review feedback
5. Maintainers will merge when ready

See [CONTRIBUTING.md](CONTRIBUTING.md) for full contribution guidelines.
