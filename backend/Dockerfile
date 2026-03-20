# ============================================
# Backend Production Dockerfile
# Multi-stage build for optimized image size
# ============================================

# Base stage with Node.js LTS
FROM node:20-alpine AS base
LABEL maintainer="Auth MERN Backend"
LABEL description="Production image for Auth MERN Backend API"

# Install production dependencies
FROM base AS deps
# Add necessary packages for native dependencies
RUN apk add --no-cache libc6-compat openssl

WORKDIR /app

# Copy package files for dependency installation
COPY package*.json ./

# Install production dependencies only with clean install
RUN npm ci --only=production --ignore-scripts && \
    npm cache clean --force

# Build stage - compile TypeScript
FROM base AS builder
WORKDIR /app

# Install all dependencies (including dev dependencies for build)
COPY package*.json ./
RUN npm ci --ignore-scripts && \
    npm cache clean --force

# Copy source code and configuration
COPY tsconfig.json ./
COPY src ./src

# Build the TypeScript application
RUN npm run build && \
    # Verify build output
    ls -la dist/

# Production runtime stage
FROM base AS runner
WORKDIR /app

# Set production environment
ENV NODE_ENV=production \
    PORT=5000 \
    NODE_OPTIONS="--max-old-space-size=512"

# Create non-root user for security
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 --ingroup nodejs backend

# Copy production dependencies from deps stage
COPY --from=deps --chown=backend:nodejs /app/node_modules ./node_modules

# Copy built application from builder stage
COPY --from=builder --chown=backend:nodejs /app/dist ./dist

# Copy package.json for runtime metadata
COPY --chown=backend:nodejs package*.json ./

# Create and set permissions for uploads directory
RUN mkdir -p /app/uploads && \
    chown -R backend:nodejs /app/uploads && \
    chmod 755 /app/uploads

# Switch to non-root user
USER backend

# Health check endpoint
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
    CMD node -e "require('http').get('http://localhost:5000/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

# Expose application port
EXPOSE 5000

# Start the application
CMD ["node", "dist/index.js"]