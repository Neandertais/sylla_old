ARG NODE_IMAGE=node:18-buster-slim

FROM $NODE_IMAGE AS base
RUN apt-get update -y && \
    apt-get install -y --no-install-recommends tini ffmpeg mesa-va-drivers && \
    rm -rf /var/lib/apt/lists/* && \
    mkdir -p /home/node/app
WORKDIR /home/node/app
ENTRYPOINT [ "tini" ]

FROM base AS dependencies
COPY ./package*.json ./
RUN npm ci
COPY . .

FROM dependencies AS build
RUN npm run build

FROM base AS production
ENV NODE_ENV=production
ENV PORT=$PORT
ENV HOST=0.0.0.0
COPY ./package*.json ./
RUN npm ci --production
COPY --from=dist /home/node/app/dist .
EXPOSE $PORT
CMD [ "dumb-init", "node", "dist", "index.js" ]
