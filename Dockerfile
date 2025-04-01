FROM node:22-alpine AS deps
WORKDIR /tmdt
COPY package*.json ./
RUN npm install

FROM node:22-alpine AS builder
WORKDIR /tmdt
COPY . .
COPY --from=deps /tmdt/node_modules ./node_modules

ARG NEXT_PUBLIC_GOOGLE_CLIENT_ID
ENV NEXT_PUBLIC_GOOGLE_CLIENT_ID=${NEXT_PUBLIC_GOOGLE_CLIENT_ID}

RUN npm run build

FROM node:22-alpine AS runner
WORKDIR /tmdt
COPY --from=builder /tmdt/.next/standalone ./
COPY --from=builder /tmdt/public ./public
COPY --from=builder /tmdt/.next/static ./.next/static

CMD ["node", "server.js"]
