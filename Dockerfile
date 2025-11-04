FROM node:20.18.0-alpine AS package

ARG NEXT_PUBLIC_UMAMI_SITE_ID
ARG NEXT_PUBLIC_RECAPTCHA_SITEKEY
ARG NEXT_PUBLIC_ENVIRONMENT
ARG NEXT_PUBLIC_ORY_SDK_URL
ARG NEXT_PUBLIC_ORYCLOUD
ARG ENVIRONMENT
ARG NEXT_PUBLIC_ENABLE_BANNER_DONATION
ENV PARCEL_WORKERS=1
ENV NEW_RELIC_NO_CONFIG_FILE=true
ENV NEW_RELIC_DISTRIBUTED_TRACING_ENABLED=true
ENV NEW_RELIC_LOG=stdout

# Install system dependencies
RUN apk add --no-cache git python3 make g++

# Enable Yarn modern with corepack
RUN corepack enable

WORKDIR /app

# Copy Yarn configuration first for better caching
COPY .yarnrc.yml ./
COPY .yarn/ ./.yarn/

# Copy package files for dependency resolution
COPY ./package.json ./yarn.lock ./

# Install dependencies (cached when package.json/yarn.lock unchanged)
RUN yarn install --frozen-lockfile

# Copy configuration files
COPY ./.babelrc ./
COPY config.$ENVIRONMENT.yaml ./config.yaml
COPY config.websocket.$ENVIRONMENT.yaml ./config.websocket.yaml
COPY config.seed.example.yaml ./config.seed.yaml
COPY migrate-mongo-config-example.ts ./migrate-mongo-config.ts
COPY ./migrations ./migrations
COPY ./.eslintignore ./
COPY ./.eslintrc.yml ./
COPY server/jest.config.json ./jest.config.json
COPY ./next.config.js ./
COPY ./tsconfig.json ./
COPY ./next-i18next.config.js ./

# Copy source code
COPY ./scripts ./scripts
COPY ./server ./server
COPY ./src ./src
COPY ./lib ./lib
COPY ./public ./public
COPY ./config ./config

# Create local config
RUN cp config/localConfig.example.ts config/localConfig.ts
RUN NEXT_PUBLIC_UMAMI_SITE_ID=$NEXT_PUBLIC_UMAMI_SITE_ID \
    NEXT_PUBLIC_RECAPTCHA_SITEKEY=$NEXT_PUBLIC_RECAPTCHA_SITEKEY \
    NEXT_PUBLIC_ENVIRONMENT=$NEXT_PUBLIC_ENVIRONMENT \
    NEXT_PUBLIC_ORY_SDK_URL=$NEXT_PUBLIC_ORY_SDK_URL \
    NEXT_PUBLIC_ORYCLOUD=$NEXT_PUBLIC_ORYCLOUD \
    NEXT_PUBLIC_ENABLE_BANNER_DONATION=$NEXT_PUBLIC_ENABLE_BANNER_DONATION \
    yarn build

FROM node:20.18.0-alpine

LABEL maintainer="Giovanni Rossini <giovannijrrossini@gmail.com>"

COPY --from=package /app /app

WORKDIR /app

ENTRYPOINT [ "yarn", "start" ]
