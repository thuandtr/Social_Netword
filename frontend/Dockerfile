# ============================================
# Frontend Production Dockerfile
# Optimized for Next.js 15 standalone build
# ============================================

# Base stage with Node.js LTS
FROM node:20-alpine AS base
LABEL maintainer="Auth MERN Frontend"
LABEL description="Production image for Auth MERN Next.js Frontend"

# Install dependencies stage
FROM base AS deps
# Add necessary packages for native dependencies
RUN apk add --no-cache libc6-compat openssl

WORKDIR /app

# Copy package files for dependency installation
COPY package*.json ./

# Install dependencies with clean install
RUN npm ci --ignore-scripts && \
    npm cache clean --force

# Build stage - compile Next.js application
FROM base AS builder
WORKDIR /app

# Copy dependencies from deps stage
COPY --from=deps /app/node_modules ./node_modules

# Copy application source
COPY . .

# Set build-time environment variables
ARG NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL:-http://localhost:5000/api/v1/auth}

# Disable Next.js telemetry during build
ENV NEXT_TELEMETRY_DISABLED=1

# Build the Next.js application in standalone mode
RUN npm run build && \
    # Verify standalone build output
    ls -la .next/standalone/

# Production runtime stage
FROM base AS runner
WORKDIR /app

# Set production environment
ENV NODE_ENV=production \
    NEXT_TELEMETRY_DISABLED=1 \
    PORT=3000 \
    HOSTNAME="0.0.0.0" \
    NODE_OPTIONS="--max-old-space-size=512"

# Create non-root user for security
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 --ingroup nodejs nextjs

# Copy standalone output from builder
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Copy public folder for static assets
COPY --from=builder --chown=nextjs:nodejs /app/public ./public

# Switch to non-root user
USER nextjs

# Health check endpoint
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
    CMD node -e "require('http').get('http://localhost:3000/api/health', (r) => {process.exit(r.statusCode === 200 || r.statusCode === 404 ? 0 : 1)})"

# Expose application port
EXPOSE 3000

# Start the Next.js standalone server
CMD ["node", "server.js"]