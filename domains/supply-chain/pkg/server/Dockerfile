FROM node:22-alpine AS builder

WORKDIR /build

COPY . .

RUN npm ci

WORKDIR /build/pkg/server

RUN npm ci

RUN npm run build:ts

RUN rm -rf node_modules

FROM node:22-alpine

RUN apk update && apk add --no-cache dumb-init && rm -rf /var/cache/apk/*

ENV HOME=/home/app
ENV APP_HOME=$HOME/node/
ENV NODE_ENV=production
ENV CONFIG_PATH=../../config/app.config.json
ENV PORT=8081
ENV HOST=0.0.0.0

WORKDIR $APP_HOME


COPY --from=builder /build/pkg/server/package.json /build/pkg/server/package-lock.json ./
COPY --from=builder /build/pkg/server/dist ./
RUN mkdir -p $APP_HOME/pkg/server/logs
RUN touch $APP_HOME/pkg/server/logs/app.log
RUN chown -R node:node $APP_HOME/pkg/server/logs/

RUN npm ci --only=production

USER node

EXPOSE ${PORT}

ENTRYPOINT ["dumb-init"]
CMD ["npm", "run", "start:docker"]
