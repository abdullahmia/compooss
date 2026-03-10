# Security Policy

## Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| 0.x.x   | :white_check_mark: |

## Reporting a Vulnerability

If you discover a security vulnerability in Compooss, please report it responsibly.

**Please do not** open a public GitHub issue for security vulnerabilities.

### How to Report

1. **Email** the maintainer(s) with details of the vulnerability.
2. Include:
   - Description of the vulnerability
   - Steps to reproduce
   - Potential impact
   - Suggested fix (if any)
3. Allow a reasonable time for a response before any public disclosure.

### What to Expect

- We will acknowledge your report as soon as possible.
- We will investigate and work on a fix.
- We will keep you informed of progress.
- We will credit you in the release notes (unless you prefer to remain anonymous).

### Scope

Compooss is intended for **local development** use within `docker-compose` stacks. It is not designed for production deployment in untrusted environments. If you use it in production or expose it to the internet, do so at your own risk and ensure appropriate network and access controls are in place.

## Best Practices

- Do not expose Compooss to the public internet without proper authentication.
- Use strong MongoDB credentials in development.
- Keep dependencies up to date (`npm audit`).
