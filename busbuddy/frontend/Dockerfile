# ==========================================
# Build Stage
# ==========================================
FROM node:20-alpine AS builder
WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

# ==========================================
# Production Web Server Stage (Nginx)
# ==========================================
FROM nginx:alpine
WORKDIR /usr/share/nginx/html

# Clean default assets and copy production build
RUN rm -rf ./*
COPY --from=builder /app/dist .
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
