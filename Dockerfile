# syntax=docker/dockerfile:1.7

# -------- Base deps --------
FROM node:20-alpine AS base
ENV NODE_ENV=production
WORKDIR /app

# -------- Dependencies --------
FROM base AS deps
RUN apk add --no-cache libc6-compat
COPY package.json package-lock.json* .npmrc* ./
RUN npm ci --include=dev

# -------- Build --------
FROM base AS build
ENV NEXT_TELEMETRY_DISABLED=1
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

# -------- Runtime (standalone) --------
FROM node:20-alpine AS runner
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV HOSTNAME=0.0.0.0
WORKDIR /app

# Create non-root user
RUN addgroup -S nextjs && adduser -S nextjs -G nextjs

# Copy public assets (including uploads directory placeholder)
COPY --from=build /app/public ./public

# Copy Next standalone output and static files
COPY --from=build /app/.next/standalone ./
COPY --from=build /app/.next/static ./.next/static

# Ensure uploads directory exists and is writable
RUN mkdir -p /app/public/uploads && chown -R nextjs:nextjs /app/public/uploads

USER nextjs

EXPOSE 3000
ENV PORT=3000
CMD ["node", "server.js"]


