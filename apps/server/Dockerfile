FROM node:22-alpine AS base
WORKDIR /app
COPY package*.json ./
COPY apps/server/package*.json ./apps/server/
RUN npm install

FROM base AS build
COPY . .
RUN npm -w @rss/server run build

FROM node:22-alpine AS runtime
WORKDIR /app
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/apps/server/dist ./apps/server/dist
COPY --from=build /app/apps/server/package.json ./apps/server/package.json
ENV PORT=3000
CMD ["node", "apps/server/dist/main.js"]
