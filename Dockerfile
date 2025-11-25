# ---------- Stage 1: Build client ----------
FROM node:18-alpine AS client-build

WORKDIR /usr/src/client

# Copy only package files first to improve cache
COPY client/package.json client/package-lock.json ./
# If you use yarn: COPY client/yarn.lock ./

RUN npm ci --silent

# Copy client source and build
COPY client/ ./
# Build the Vite React app for production
RUN npm run build

# ---------- Stage 2: Install server deps ----------
FROM node:18-alpine AS deps
WORKDIR /usr/src/server
COPY server/package.json server/package-lock.json ./
RUN npm ci --silent

# ---------- Stage 3: Server (final) ----------
FROM node:18-alpine AS server
WORKDIR /usr/src/app

# Copy server source
COPY server/ ./

# Copy installed node_modules from deps stage
COPY --from=deps /usr/src/server/node_modules ./node_modules

# Copy built client assets into server's public (or 'client_build') directory
# Adjust target folder on server as your server expects (e.g., ./public or ./client_build)
COPY --from=client-build /usr/src/client/dist ./public

# Expose port used by the server
ENV PORT 5000
EXPOSE 5000

# Use a non-root user (optional but recommended)
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
USER appuser

# Default command - run server entrypoint
# Ensure server/server.js listens on process.env.PORT and serves static files from ./public
CMD ["node", "server.js"]
