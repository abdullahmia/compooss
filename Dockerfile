# Build stage
FROM node:20-alpine AS builder

# Enable pnpm via corepack
RUN corepack enable && corepack prepare pnpm@9.14.2 --activate

WORKDIR /app

# Copy workspace and lockfile
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./

# Copy package manifests for all workspaces (needed for pnpm install)
COPY apps/compooss/package.json ./apps/compooss/
COPY apps/docs/package.json ./apps/docs/
COPY packages/types/package.json ./packages/types/
COPY packages/ui/package.json ./packages/ui/

# Install dependencies (frozen lockfile for reproducible builds)
RUN pnpm install --frozen-lockfile

# Copy full source
COPY . .

# Build the compooss app (turbo builds @compooss/types, @compooss/ui first)
RUN pnpm run build --filter=@compooss/app

# Production stage - minimal image with standalone Next.js output
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Create non-root user
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy standalone build output
COPY --from=builder /app/apps/compooss/.next/standalone ./
COPY --from=builder /app/apps/compooss/.next/static ./apps/compooss/.next/static
COPY --from=builder /app/apps/compooss/public ./apps/compooss/public

USER nextjs

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Standalone server lives at apps/compooss/server.js
CMD ["node", "apps/compooss/server.js"]
