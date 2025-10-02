# ---- Base image ----
    FROM public.ecr.aws/docker/library/node:20-alpine AS base
    WORKDIR /app

    # ---- Dependencies ----
    FROM base AS deps
    # Install pnpm
    RUN corepack enable && corepack prepare pnpm@8.8.0 --activate
    # Copy only the pnpm files and package.json for dependency resolution
    COPY pnpm-lock.yaml package.json ./
    # Install only production dependencies
    RUN pnpm install --frozen-lockfile --prod --ignore-scripts

    # ---- Builder ----
    FROM base AS builder
    RUN corepack enable && corepack prepare pnpm@8.8.0 --activate
    WORKDIR /app
    COPY . .
    COPY --from=deps /app/node_modules ./node_modules
    RUN pnpm install --frozen-lockfile
    RUN pnpm run build

    # ---- Production ----
    FROM public.ecr.aws/docker/library/node:20-alpine AS prod
    WORKDIR /app
    ENV NODE_ENV=production

    # Install openssl for crypto support
    RUN apk add --no-cache openssl

    # Create non-root user
    RUN addgroup -g 1001 -S nodejs && adduser -S appuser -u 1001 -G nodejs

    # Copy only necessary files
    COPY --from=builder /app/dist ./dist
    COPY --from=builder /app/node_modules ./node_modules
    # COPY --from=builder /app/.env ./.env

    RUN chown -R appuser:nodejs /app/node_modules

    USER appuser

    EXPOSE 8080

    CMD ["node", "dist/src/main"]