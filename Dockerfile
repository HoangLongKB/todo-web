# syntax=docker/dockerfile:1.7
FROM node:22-alpine AS base
RUN addgroup -S -g 1001 nextjs && adduser -S -u 1001 -G nextjs nextjs
WORKDIR /app

FROM base AS with-pnpm
RUN corepack enable && corepack prepare pnpm@9.15.9 --activate

FROM with-pnpm AS deps
COPY package.json pnpm-lock.yaml ./
RUN --mount=type=cache,id=pnpm,target=/root/.local/share/pnpm/store \
    pnpm install --frozen-lockfile

# ===== build: NEXT_PUBLIC_* phải có NGAY LÚC BUILD vì Next đóng cứng vào JS =====
FROM deps AS build
ARG NEXT_PUBLIC_APP_ENV=local
ARG NEXT_PUBLIC_API_BASE_URL=
ARG NEXT_PUBLIC_FIREBASE_API_KEY
ARG NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
ARG NEXT_PUBLIC_FIREBASE_PROJECT_ID
ARG NEXT_PUBLIC_FIREBASE_APP_ID
# ARG chỉ sống trong lúc build; chuyển sang ENV để `next build` đọc được qua process.env
ENV NEXT_PUBLIC_APP_ENV=$NEXT_PUBLIC_APP_ENV \
    NEXT_PUBLIC_API_BASE_URL=$NEXT_PUBLIC_API_BASE_URL \
    NEXT_PUBLIC_FIREBASE_API_KEY=$NEXT_PUBLIC_FIREBASE_API_KEY \
    NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=$NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN \
    NEXT_PUBLIC_FIREBASE_PROJECT_ID=$NEXT_PUBLIC_FIREBASE_PROJECT_ID \
    NEXT_PUBLIC_FIREBASE_APP_ID=$NEXT_PUBLIC_FIREBASE_APP_ID \
    NEXT_TELEMETRY_DISABLED=1
COPY . .
RUN pnpm build

# ===== runner: chỉ copy output standalone, không có node_modules đầy đủ =====
FROM base AS runner
ENV NODE_ENV=production NEXT_TELEMETRY_DISABLED=1 PORT=8080 HOSTNAME=0.0.0.0
RUN apk add --no-cache dumb-init
COPY --from=build --chown=nextjs:nextjs /app/public ./public
COPY --from=build --chown=nextjs:nextjs /app/.next/standalone ./
COPY --from=build --chown=nextjs:nextjs /app/.next/static ./.next/static
USER nextjs
EXPOSE 8080
ENTRYPOINT ["dumb-init", "--"]
CMD ["node", "server.js"]
