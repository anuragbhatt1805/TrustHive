# Use Node.js 18 alpine as base image
FROM node:18-alpine AS base

# Set working directory
WORKDIR /app

# Install dependencies needed for production
RUN apk add --no-cache dumb-init

# Create non-root user
RUN addgroup -g 1001 -S nodejs
RUN adduser -S trusthive -u 1001

# Copy package files
COPY package*.json ./
COPY yarn.lock* ./

# Install production dependencies
RUN yarn install --production --frozen-lockfile && yarn cache clean

# Copy the built application
COPY build ./build/

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
