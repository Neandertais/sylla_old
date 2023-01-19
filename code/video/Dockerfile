ARG NODE_IMAGE=node:18-alpine

FROM $NODE_IMAGE AS base
RUN apk --no-cache add dumb-init ffmpeg
RUN mkdir -p /home/node/app && chown node:node /home/node/app
WORKDIR /home/node/app
USER node

FROM base AS dependencies
COPY --chown=node:node ./package*.json ./
RUN npm ci
COPY --chown=node:node . .

FROM dependencies AS build
RUN npm run build

FROM base AS production
ENV NODE_ENV=production
ENV PORT=$PORT
ENV HOST=0.0.0.0
COPY --chown=node:node ./package*.json ./
RUN npm ci --production
COPY --chown=node:node --from=dist /home/node/app/dist .
EXPOSE $PORT
CMD [ "dumb-init", "node", "dist", "index.js" ]
