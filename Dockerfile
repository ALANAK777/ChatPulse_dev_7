FROM node:18-alpine AS deps

WORKDIR /app

RUN apk add --no-cache libc6-compat

COPY package*.json ./
COPY prisma ./prisma

RUN npm ci

FROM node:18-alpine AS builder

WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

RUN npx prisma generate
RUN npm run build

FROM node:18-alpine AS runner

WORKDIR /app
ENV NODE_ENV production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/prisma ./prisma

USER nextjs

ENV PORT 8080
EXPOSE 8080

CMD npx prisma migrate deploy && npm start -- -p $PORT
