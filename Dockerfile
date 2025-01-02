# Build stage
FROM node:22.12.0-alpine as builder

# Install pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

WORKDIR /app

# Copy package files
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

# Copy source code
COPY . .

# Build the application
RUN pnpm run build

# Production stage
FROM node:22.12.0-alpine

# Install pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

WORKDIR /app

# Copy built files from builder
COPY --from=builder /app/.output ./.output
COPY --from=builder /app/package.json ./

# Install only production dependencies
RUN pnpm install --prod

# Set environment variables
ENV HOST=0.0.0.0
ENV PORT=3000
EXPOSE 3000

# Start command needs to be an array to avoid the bash -c error
CMD ["node", ".output/server/index.mjs"]