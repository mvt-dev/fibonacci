# Rebuild the source code only when needed
FROM node:alpine AS builder
WORKDIR /app
COPY . .
RUN yarn install && yarn build

# Production image, copy all the files and run next
FROM node:alpine AS runner
WORKDIR /app
ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001
COPY --from=builder /app/public .
COPY --from=builder --chown=nextjs:nodejs /app/.next ./.next
COPY --from=builder /app/package.json .
COPY --from=builder /app/.env.production .
# COPY --from=builder /app/node_modules ./node_modules
RUN yarn install --production
USER nextjs
EXPOSE 5000
CMD ["yarn", "start"]