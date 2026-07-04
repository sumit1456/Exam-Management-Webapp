# Stage 1: Build the React/Vite application
FROM node:20-alpine AS build

# Declare build arguments (Vite needs env variables at build time)
ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL

WORKDIR /app

# Copy package configuration files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy the rest of the application source code
COPY . .

# Build the application
RUN npm run build

# Stage 2: Serve the static files using Nginx
FROM nginx:alpine

# Copy custom nginx configuration for SPA routing
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy build artifacts from the build stage to Nginx web root
COPY --from=build /app/dist /usr/share/nginx/html

# Expose port 80 to the internal container network
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
