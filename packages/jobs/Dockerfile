# Rebuild the source code only when needed
FROM node:alpine AS builder
WORKDIR /app
COPY . .
RUN yarn install && yarn build

# Production image, copy all the files and run node
FROM node:alpine AS runner
WORKDIR /app
ENV NODE_ENV production
COPY --from=builder /app/dist .
COPY --from=builder /app/package.json .
# COPY --from=builder /app/node_modules ./node_modules
RUN yarn install --production
CMD ["node", "index.js"]