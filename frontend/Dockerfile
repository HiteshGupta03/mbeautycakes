# =========================================
# STAGE 1 — Build React/Vite application
# =========================================

FROM node:20-alpine AS builder

# Application directory
WORKDIR /app

# Copy dependency files first
# This improves Docker layer caching
COPY package*.json ./

# Install exact dependencies
RUN npm ci

# Copy frontend source code
COPY . .

# Build production files
RUN npm run build


# =========================================
# STAGE 2 — Serve with Nginx
# =========================================

FROM nginx:alpine

# Remove default Nginx website
RUN rm -rf /usr/share/nginx/html/*

# Copy our custom Nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy Vite production build
COPY --from=builder /app/dist /usr/share/nginx/html

# Nginx listens on port 80
EXPOSE 80

# Keep Nginx running in foreground
CMD ["nginx", "-g", "daemon off;"]