FROM node:12.13.1-alpine AS package

ARG API_URL
ARG RECAPTCHA_SITEKEY
ARG ENVIRONMENT
ENV PARCEL_WORKERS=1

COPY ./.babelrc /app/.babelrc
COPY config.$ENVIRONMENT.yaml /app/config.yaml
COPY ./.eslintignore /app/.eslintignore
COPY ./.eslintrc.yml /app/.eslintrc.yml
COPY ./jest.config.js /app/jest.config.js
COPY ./next.config.js /app/next.config.js
COPY ./package.json /app/package.json
COPY ./yarn.lock /app/yarn.lock
COPY ./scripts /app/scripts
COPY ./tsconfig.json /app/tsconfig.json
COPY ./server /app/server
COPY ./src /app/src
COPY ./public /app/public

WORKDIR /app

RUN apk add --no-cache git python make g++
RUN yarn install
RUN yarn build

FROM node:12.13.1-alpine

LABEL maintainer="Giovanni Rossini <giovannijrrossini@gmail.com>"

COPY --from=package /app /app

WORKDIR /app

ENTRYPOINT [ "yarn", "start" ]
