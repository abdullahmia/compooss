# Contributing to Compooss

Thank you for your interest in contributing to Compooss! This document provides guidelines for contributing to the project.

## Code of Conduct

By participating in this project, you agree to abide by our [Code of Conduct](CODE_OF_CONDUCT.md).

## How to Contribute

### Reporting Bugs

- Use the GitHub issue tracker to report bugs.
- Search existing issues first to avoid duplicates.
- Include:
  - A clear, descriptive title
  - Steps to reproduce
  - Expected vs actual behavior
  - Your environment (OS, Node version, Docker version if relevant)
  - Relevant logs or screenshots

### Suggesting Features

- Open an issue with the `enhancement` label.
- Describe the use case and why it would benefit the project.
- Be open to discussion and feedback.

### Pull Requests

1. **Fork** the repository and create a branch from `main`:
   ```sh
   git checkout -b feat/your-feature-name
   # or: fix/your-bug-fix
   ```

2. **Follow our commit conventions** – we use [Conventional Commits](https://www.conventionalcommits.org/):
   ```
   feat: add new feature
   fix: resolve bug in connection handling
   docs: update README
   ```

3. **Make your changes** – keep PRs focused and reasonably sized.

4. **Run checks** before submitting:
   ```sh
   npm run lint
   npm run test
   ```

5. **Push** and open a Pull Request:
   - Reference any related issues
   - Describe what changed and why
   - Ensure CI passes (if configured)

6. **Address review feedback** – maintainers may request changes.

## Development Setup

See [DEVELOPMENT.md](DEVELOPMENT.md) for local setup, architecture, and development workflow.

## Project Structure

- `src/` – Application source code
- `src/app/` – Next.js app router pages and layout
- `src/components/` – React components
- `src/lib/` – Utilities and shared logic
- `public/` – Static assets

## Coding Standards

- Use TypeScript for all new code.
- Follow the existing ESLint configuration.
- Prefer functional components and hooks.
- Keep components small and focused.
- Add tests for new features when practical.

## Questions?

Open a [Discussion](https://github.com/YOUR_ORG/compass-companion/discussions) or an issue if you have questions.
