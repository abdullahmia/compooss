# Security Policy

## Supported Versions

| Version | Supported |
|---|---|
| 1.x.x | :white_check_mark: |
| < 1.0.0 | :x: |

## Reporting a Vulnerability

If you discover a security vulnerability in Compooss, please report it **responsibly** — do not open a public GitHub issue.

### How to Report

1. Email the maintainer with details of the vulnerability.
2. Include:
   - Description of the vulnerability
   - Steps to reproduce
   - Potential impact
   - Suggested fix (if any)
3. Allow reasonable time for a response before any public disclosure.

### What to Expect

- Acknowledgement as soon as possible.
- Investigation and a fix.
- Credit in the release notes (unless you prefer to remain anonymous).

---

## Scope & Intended Use

Compooss is designed for **local and team development environments**. It is not hardened for production deployment in untrusted or public-facing environments.

If you choose to expose Compooss to the internet or a shared network, you are responsible for applying appropriate controls (reverse proxy, authentication layer, firewall rules).

### Best Practices

- Do not expose Compooss publicly without an authentication layer in front of it.
- Use strong MongoDB credentials even in development.
- Keep dependencies up to date (`bun audit` / Dependabot alerts).
- Run MongoDB with authentication enabled — never use `--noauth` in a shared environment.
