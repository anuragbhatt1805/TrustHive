# Multi-stage Docker build for TrustHive Auth Service
FROM node:18-alpine AS base

# Set working directory
WORKDIR /app

# Install system dependencies
RUN apk add --no-cache dumb-init

# Create non-root user
RUN addgroup -g 1001 -S nodejs
RUN adduser -S trusthive -u 1001

# Copy package files for dependency installation
COPY package*.json ./

# Copy yarn.lock from root if it exists, otherwise use local one
COPY ../../yarn.lock* ./yarn.lock*
COPY yarn.lock* ./

# Configure NPM for GitHub Package Registry
COPY .npmrc* ./
RUN echo "@trusthive:registry=https://npm.pkg.github.com" >> .npmrc

# Install ALL dependencies first (including dev dependencies for build)
ARG NPM_TOKEN
RUN echo "//npm.pkg.github.com/:_authToken=${NPM_TOKEN}" >> .npmrc && \
    # Wait for packages to be available (retry mechanism)
    for i in {1..10}; do \
        echo "Attempt $i: Installing dependencies..." && \
        yarn install --frozen-lockfile && break || \
        (echo "Failed attempt $i, waiting 30s..." && sleep 30); \
    done && \
    rm .npmrc

# Copy source code and build files
COPY . .

# Build the application
RUN yarn build

# Production stage
FROM node:18-alpine AS production

WORKDIR /app

# Install dumb-init
RUN apk add --no-cache dumb-init

# Create non-root user
RUN addgroup -g 1001 -S nodejs
RUN adduser -S trusthive -u 1001

# Copy package files
COPY package*.json ./

# Copy yarn.lock from root if it exists, otherwise use local one
COPY ../../yarn.lock* ./yarn.lock*
COPY yarn.lock* ./

# Configure NPM for GitHub Package Registry and install production dependencies
ARG NPM_TOKEN
RUN echo "@trusthive:registry=https://npm.pkg.github.com" >> .npmrc && \
    echo "//npm.pkg.github.com/:_authToken=${NPM_TOKEN}" >> .npmrc && \
    # Wait for packages to be available (retry mechanism)
    for i in {1..10}; do \
        echo "Attempt $i: Installing production dependencies..." && \
        yarn install --production --frozen-lockfile && \
        yarn cache clean && break || \
        (echo "Failed attempt $i, waiting 30s..." && sleep 30); \
    done && \
    rm .npmrc

# Copy the built application from build stage
COPY --from=base /app/build ./build/

# Change ownership to non-root user
RUN chown -R trusthive:nodejs /app
USER trusthive

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD node -e "const http=require('http');http.get('http://localhost:3000/',res=>process.exit(res.statusCode===200?0:1)).on('error',()=>process.exit(1))"

# Use dumb-init to handle signals properly
ENTRYPOINT ["dumb-init", "--"]

# Start the application
CMD ["node", "build/index.js"]
