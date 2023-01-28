ARG NODE_IMAGE=node:18-alpine

FROM $NODE_IMAGE AS deps
WORKDIR /app

COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

FROM $NODE_IMAGE AS builder
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

RUN node ace build --production

FROM $NODE_IMAGE AS runner
RUN apk --no-cache add tini
ENTRYPOINT [ "tini" ]

WORKDIR /app

ENV NODE_ENV production
ENV PORT $PORT
ENV HOST 0.0.0.0

COPY --from=deps /app/package.json /app/yarn.lock ./
COPY --from=builder /app/build .

RUN yarn install --production --frozen-lockfile

EXPOSE $PORT

CMD [ "node", "server.js" ]
