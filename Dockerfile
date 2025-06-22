# Build stage
FROM node:22-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY bun.lockb ./

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Build the application for production
RUN npm run build

# Production stage - serve with Vite preview
FROM node:22-alpine AS production

WORKDIR /app

# Copy package files and install only production dependencies
COPY package*.json ./
RUN npm install --only=production

# Copy built files from builder stage
COPY --from=builder /app/dist ./dist

# Copy Vite config for preview mode
COPY vite.config.ts ./

# Expose port 5173
EXPOSE 5173

# Start the preview server
CMD ["npm", "run", "preview", "--", "--host", "0.0.0.0", "--port", "5173"] 