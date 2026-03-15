# Compooss

A lightweight MongoDB database client designed to run **inside your `docker-compose` stack** during development. Explore and manage your MongoDB data from the browser — no native app install required.

## Quick Start

```bash
docker run -d \
  -e MONGO_URI=mongodb://host.docker.internal:27017 \
  -p 3000:3000 \
  compooss/app:latest
```

Then open [http://localhost:3000](http://localhost:3000) in your browser.

## Docker Compose

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
      - "3000:3000"
    depends_on:
      - mongo
```

## Environment Variables

| Variable      | Description                  | Required                    |
| ------------- | ---------------------------- | --------------------------- |
| `MONGO_URI`   | MongoDB connection string    | Yes (or `MONGODB_URI`)      |
| `MONGODB_URI` | Alternative to `MONGO_URI`    | Yes (or `MONGO_URI`)        |

## Features

- **Docker-first** — Drop into any `docker-compose` stack as a service.
- **No local install** — Access the full UI from your browser.
- **Database management** — List, create, and delete databases.
- **Collection management** — List, create, and delete collections per database.
- **Document CRUD** — Query, filter, and sort documents; list, JSON, and table views; add, edit, and delete documents.
- **Collection stats** — Document count, total size, index count, and average document size.
- **Safety** — Read-only protection for system databases (`admin`, `local`, `config`).

## Image Details

- **Base image**: `node:20-alpine`
- **Runs as**: non-root user (`nextjs:nodejs`)
- **Exposed port**: `3000`
- **Architecture**: `linux/amd64`

## Links

- **Source code**: [GitHub](https://github.com/YOUR_ORG/compooss)
- **Documentation**: [Features & Roadmap](https://github.com/YOUR_ORG/compooss/blob/main/docs/FEATURES.md)
- **License**: MIT
