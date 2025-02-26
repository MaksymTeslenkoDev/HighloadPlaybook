# Stage 1: Build dependencies & compile TypeScript
FROM node:22-alpine AS builder

WORKDIR /build

COPY . .

RUN npm ci --ignore-scripts

RUN npm run build

RUN rm -rf node_modules

FROM node:22-alpine

RUN apk update && apk add --no-cache dumb-init && rm -rf /var/cache/apk/*

ENV HOME=/home/app
ENV APP_HOME=$HOME/node/
ENV NODE_ENV=production
ENV CONFIG_PATH=/config/server.config.json

ENV PORT=8081

WORKDIR $APP_HOME

COPY --from=builder /build/package.json /build/package-lock.json ./
COPY --from=builder /build/dist ./

RUN npm ci --only=production --ignore-scripts

USER node

EXPOSE ${PORT}

ENTRYPOINT ["dumb-init"]

CMD ["node", "server.js"]
