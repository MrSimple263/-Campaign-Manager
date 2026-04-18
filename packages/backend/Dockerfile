# --- Build Stage ---
FROM node:20-slim AS builder
WORKDIR /app

RUN corepack enable

COPY .yarnrc.yml yarn.lock package.json ./
COPY tsconfig.base.json ./
COPY packages/backend ./packages/backend

# Install full deps for build
RUN yarn workspaces focus backend

# Build backend
RUN yarn build:backend


# --- Production Stage ---
FROM node:20-slim

# Thiết lập biến môi trường
ENV TZ=UTC

WORKDIR /app

# Copy only necessary files
COPY --from=builder /app/package.json ./
COPY --from=builder /app/.yarn ./.yarn
COPY --from=builder /app/.yarnrc.yml ./
COPY --from=builder /app/yarn.lock ./

COPY --from=builder /app/packages/backend/package.json ./packages/backend/package.json
COPY --from=builder /app/packages/backend/dist ./packages/backend/dist

# Install only production deps
RUN corepack enable && yarn workspaces focus backend --production

# Expose port
EXPOSE 3000

# Start app
CMD ["node", "packages/backend/dist/index.js"]