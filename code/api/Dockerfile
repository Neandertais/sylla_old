ARG NODE_IMAGE=node:18-alpine

FROM $NODE_IMAGE AS base
RUN apk --no-cache add tini && \
  mkdir -p /home/node/app && \
  chown node:node /home/node/app && \
  mkdir -p /home/node/app/tmp/uploads && \
  chown node:node /home/node/app/tmp/uploads
WORKDIR /home/node/app
USER node
ENTRYPOINT [ "tini" ]

FROM base AS dependencies
COPY --chown=node:node ./package*.json ./
RUN npm ci
COPY --chown=node:node . .

FROM dependencies AS build
RUN node ace build --production

FROM base AS production
ENV NODE_ENV=production
ENV PORT=$PORT
ENV HOST=0.0.0.0
COPY --chown=node:node ./package*.json ./
RUN npm ci --production
COPY --chown=node:node --from=build /home/node/app/build .
EXPOSE $PORT
CMD [ "node", "server.js" ]
