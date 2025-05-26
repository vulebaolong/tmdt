# syntax=docker/dockerfile:1.4

# Stage 1: Cài dependencies
FROM node:22.16.0-alpine AS deps
WORKDIR /tmdt
COPY package*.json ./
# RUN npm config set registry https://registry.npmmirror.com && npm ci --legacy-peer-deps
RUN npm i

# Stage 2: Build app với secrets
FROM node:22.16.0-alpine AS builder
WORKDIR /tmdt
COPY . .
COPY --from=deps /tmdt/node_modules ./node_modules

# Mount các biến môi trường từ file bí mật (secrets)
RUN --mount=type=secret,id=mongodb_uri \
    --mount=type=secret,id=access_token_secret \
    --mount=type=secret,id=access_token_expires \
    --mount=type=secret,id=refresh_token_secret \
    --mount=type=secret,id=refresh_token_expires \
    --mount=type=secret,id=cloudinary_name \
    --mount=type=secret,id=cloudinary_api_key \
    --mount=type=secret,id=cloudinary_api_secret \
    --mount=type=secret,id=next_public_google_client_id \
    --mount=type=secret,id=google_client_secret \
    export MONGODB_URI=$(cat /run/secrets/mongodb_uri) && \
    export ACCESS_TOKEN_SECRET=$(cat /run/secrets/access_token_secret) && \
    export ACCESS_TOKEN_EXPIRES=$(cat /run/secrets/access_token_expires) && \
    export REFRESH_TOKEN_SECRET=$(cat /run/secrets/refresh_token_secret) && \
    export REFRESH_TOKEN_EXPIRES=$(cat /run/secrets/refresh_token_expires) && \
    export CLOUDINARY_NAME=$(cat /run/secrets/cloudinary_name) && \
    export CLOUDINARY_API_KEY=$(cat /run/secrets/cloudinary_api_key) && \
    export CLOUDINARY_API_SECRET=$(cat /run/secrets/cloudinary_api_secret) && \
    export NEXT_PUBLIC_GOOGLE_CLIENT_ID=$(cat /run/secrets/next_public_google_client_id) && \
    export GOOGLE_CLIENT_SECRET=$(cat /run/secrets/google_client_secret) && \
    npm run build

# Stage 3: Image chạy app
FROM node:22.16.0-alpine AS runner
WORKDIR /tmdt
COPY --from=builder /tmdt/.next/standalone ./
COPY --from=builder /tmdt/public ./public
COPY --from=builder /tmdt/.next/static ./.next/static

CMD ["node", "server.js"]
