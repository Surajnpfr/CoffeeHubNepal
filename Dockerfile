# Multi-stage Dockerfile for CoffeeHubNepal
# Builds both web and API apps and serves them together

# Stage 1: Build Web Application
FROM node:22-alpine AS web-builder

WORKDIR /app

# Copy web app files
COPY apps/web/package*.json ./apps/web/
COPY apps/web/tsconfig*.json ./apps/web/
COPY apps/web/vite.config.ts ./apps/web/
COPY apps/web/tailwind.config.js ./apps/web/
COPY apps/web/postcss.config.js ./apps/web/
COPY apps/web/index.html ./apps/web/
COPY apps/web/public ./apps/web/public
COPY apps/web/src ./apps/web/src

# Install dependencies and build web app
WORKDIR /app/apps/web
RUN npm install && npm run build

# Stage 2: Build API Application
FROM node:22-alpine AS api-builder

WORKDIR /app

# Copy API app files
COPY apps/api/package*.json ./apps/api/
COPY apps/api/tsconfig.json ./apps/api/
COPY apps/api/src ./apps/api/src

# Install dependencies and build API
WORKDIR /app/apps/api
RUN npm install && npm run build

# Stage 3: Production Image
FROM node:22-alpine

WORKDIR /app

# Copy package files
COPY apps/api/package.json ./
# Install production dependencies only
# Using npm install (not npm ci) since package-lock.json may not be in build context
RUN npm install --production --no-audit --no-fund && npm cache clean --force

# Copy built API from builder
COPY --from=api-builder /app/apps/api/dist ./dist

# Copy built web app to API public directory (API serves static files)
COPY --from=web-builder /app/apps/web/dist ./public

# Set environment variables
ENV NODE_ENV=production
ENV PORT=4000

# Expose port
EXPOSE 4000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=40s --retries=3 \
  CMD node -e "require('http').get('http://localhost:4000/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

# Start the API server (which serves both API and web app)
CMD ["node", "dist/server.js"]
