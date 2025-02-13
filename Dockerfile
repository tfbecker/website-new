# Dockerfile for Next.js deployment

# Stage 1: Build
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install --legacy-peer-deps

# Copy the rest of the application code and build
COPY . .
RUN npm run build

# Stage 2: Run
FROM node:20-alpine AS runner

WORKDIR /app
ENV NODE_ENV=production

# Copy necessary files from builder stage
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next

EXPOSE 3000
CMD ["npm", "start"] 