FROM node:22-alpine AS builder

RUN apk add --no-cache curl && \
    curl -o- -L https://yarnpkg.com/install.sh | sh

ENV PATH="/root/.yarn/bin:$PATH"

WORKDIR /app

COPY package.json yarn.lock ./
RUN yarn

COPY . .
RUN yarn build

FROM node:22-alpine

WORKDIR /app

COPY package.json yarn.lock ./
RUN yarn

COPY --from=builder /app/dist ./dist

CMD ["node", "dist/main"]
