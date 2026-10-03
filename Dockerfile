# Multi-stage build (replaces nixpacks, which shipped an unpatched ubuntu base + npm CVEs)
FROM node:22-alpine AS builder
WORKDIR /app
ENV NEXT_TELEMETRY_DISABLED=1 PUPPETEER_SKIP_DOWNLOAD=1
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npm run build && npm prune --omit=dev

FROM node:22-alpine AS runner
# security: pull in patched OS packages (base image lags CVE fixes)
RUN apk upgrade --no-cache
WORKDIR /app
ENV NODE_ENV=production NEXT_TELEMETRY_DISABLED=1 PORT=3000 HOSTNAME=0.0.0.0
COPY --from=builder --chown=node:node /app/package.json ./package.json
COPY --from=builder --chown=node:node /app/node_modules ./node_modules
COPY --from=builder --chown=node:node /app/.next ./.next
COPY --from=builder --chown=node:node /app/public ./public
COPY --from=builder --chown=node:node /app/content ./content
COPY --from=builder --chown=node:node /app/next.config.mjs ./next.config.mjs
# runtime only needs node; drop npm/yarn (bundled deps like brace-expansion carry CVEs)
RUN rm -rf /usr/local/lib/node_modules/npm /usr/local/bin/npm /usr/local/bin/npx /opt/yarn-*
USER node
EXPOSE 3000
CMD ["node", "node_modules/next/dist/bin/next", "start"]
