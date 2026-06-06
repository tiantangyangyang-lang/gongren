# Stage 1: Build frontend
FROM node:22-alpine AS web-builder
WORKDIR /app
COPY pnpm-workspace.yaml pnpm-lock.yaml package.json tsconfig.base.json ./
COPY packages/shared ./packages/shared
COPY packages/web ./packages/web
RUN corepack enable && pnpm install --frozen-lockfile
RUN pnpm --filter @angang/web build

# Stage 2: Production runtime
FROM node:22-alpine
WORKDIR /app

# Copy built frontend
COPY --from=web-builder /app/packages/web/out ./packages/server/public

# Copy server source
COPY pnpm-workspace.yaml pnpm-lock.yaml package.json tsconfig.base.json ./
COPY packages/shared ./packages/shared
COPY packages/server ./packages/server

RUN corepack enable && pnpm install --frozen-lockfile

ENV SERVER_PORT=3001
EXPOSE 3001

CMD ["pnpm", "--filter", "@angang/server", "dev"]
