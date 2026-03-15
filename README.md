# Compooss

Compooss is a lightweight MongoDB database client designed to run **inside your `docker-compose` stack** during development. The goal is to give you an easy way to explore and manage your MongoDB data **without installing a separate GUI app** on your machine.

**Current release: v1.2.0.**

![Compooss Preview](docs/preview.png)

### Features

- **Docker-first** – Run as a service alongside your app in `docker-compose`.
- **No local install** – Access the UI from your browser, no native app required.
- **MongoDB focused** – Browse databases and collections; view and edit documents with query, filter, sort, and list/JSON/table views.
- **Index management** – Create, drop, hide/unhide, and inspect indexes (unique, compound, text, geospatial, TTL, partial, hashed) with usage statistics.
- **Dev-friendly** – Optimized for local development; read-only protection for system databases (`admin`, `local`, `config`).

See [docs/FEATURES.md](docs/FEATURES.md) for the full feature list and planned features (Aggregations, Schema, Validation).

### Example `docker-compose` usage (conceptual)

```yaml
services:
  mongo:
    image: mongo:latest
    ports:
      - "27017:27017"

  compooss:
    image: compooss/app:latest
    environment:
      - MONGO_URI=mongodb://mongo:27017
    ports:
      - "8080:80"
    depends_on:
      - mongo
```

Then open `http://localhost:8080` in your browser to access Compooss.

### Development

This repository contains the source code for Compooss. During early development, setup and usage may change frequently.

Basic local flow (subject to change):

```sh
git clone <REPO_URL>
cd compooss
npm install
npm run dev
```

### Roadmap

- **v1.0.0 (MVP)** – Shipped: connection, database/collection list and CRUD, document view and CRUD, Docker image.
- **v1.1.0** – Loading skeletons, improved error handling and loading states.
- **v1.2.0** – Full index management: create, drop, hide/unhide indexes; usage stats; all index types (unique, compound, text, geospatial, TTL, partial, hashed).
- **Planned**: Aggregations & schema analysis, validation rules; improved UX (pagination, query builder); optional auth for shared dev environments.

### Author

- **Name**: Abdullah Mia
- **Project**: Compooss – MongoDB client for `docker-compose`-based development

### Documentation

- [Features & roadmap](docs/FEATURES.md)
- [Contributing](docs/CONTRIBUTING.md)
- [Code of Conduct](docs/CODE_OF_CONDUCT.md)
- [Development Guide](docs/DEVELOPMENT.md)
- [Security Policy](docs/SECURITY.md)
- [Changelog](docs/CHANGELOG.md)

### License

This project is licensed under the **MIT License**. You are free to use, modify, and distribute this software, subject to the terms of the MIT License.
