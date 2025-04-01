FROM node:22-alpine AS deps
WORKDIR /tmdt
COPY package*.json ./
RUN npm config set registry https://registry.npmmirror.com && npm ci


FROM node:22-alpine AS builder
WORKDIR /tmdt
COPY . .
COPY --from=deps /tmdt/node_modules ./node_modules

ARG MONGODB_URI
ARG ACCESS_TOKEN_SECRET
ARG ACCESS_TOKEN_EXPIRES
ARG REFRESH_TOKEN_SECRET
ARG REFRESH_TOKEN_EXPIRES
ARG CLOUDINARY_NAME
ARG CLOUDINARY_API_KEY
ARG CLOUDINARY_API_SECRET
ARG NEXT_PUBLIC_GOOGLE_CLIENT_ID
ARG GOOGLE_CLIENT_SECRET

ENV MONGODB_URI=${MONGODB_URI}
ENV ACCESS_TOKEN_SECRET=${ACCESS_TOKEN_SECRET}
ENV ACCESS_TOKEN_EXPIRES=${ACCESS_TOKEN_EXPIRES}
ENV REFRESH_TOKEN_SECRET=${REFRESH_TOKEN_SECRET}
ENV REFRESH_TOKEN_EXPIRES=${REFRESH_TOKEN_EXPIRES}
ENV CLOUDINARY_NAME=${CLOUDINARY_NAME}
ENV CLOUDINARY_API_KEY=${CLOUDINARY_API_KEY}
ENV CLOUDINARY_API_SECRET=${CLOUDINARY_API_SECRET}
ENV NEXT_PUBLIC_GOOGLE_CLIENT_ID=${NEXT_PUBLIC_GOOGLE_CLIENT_ID}
ENV GOOGLE_CLIENT_SECRET=${GOOGLE_CLIENT_SECRET}

RUN npm run build

FROM node:22-alpine AS runner
WORKDIR /tmdt
COPY --from=builder /tmdt/.next/standalone ./
COPY --from=builder /tmdt/public ./public
COPY --from=builder /tmdt/.next/static ./.next/static

CMD ["node", "server.js"]
