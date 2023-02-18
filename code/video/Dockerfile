ARG NODE_IMAGE=node:18-buster-slim

FROM $NODE_IMAGE AS deps
WORKDIR /app

COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

FROM $NODE_IMAGE AS builder
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

RUN yarn build

FROM $NODE_IMAGE AS runner
RUN apt-get update -y && \
    apt-get install -y --no-install-recommends tini ffmpeg mesa-va-drivers && \
    rm -rf /var/lib/apt/lists/*
ENTRYPOINT [ "tini" ]

WORKDIR /app

ENV NODE_ENV production
ENV PORT $PORT
ENV HOST 0.0.0.0

COPY --from=deps /app/package.json /app/yarn.lock ./
COPY --from=builder /app/dist .

RUN yarn install --production --frozen-lockfile

EXPOSE $PORT

CMD [ "node", "index.js" ]