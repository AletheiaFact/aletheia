FROM node:12.13.1-alpine AS package

COPY ./api /app/api
COPY ./infra /app/infra
COPY ./lib /app/lib
COPY ./routes /app/routes
COPY ./spec /app/spec
COPY ./src /app/src
COPY ./.babelrc /app/.babelrc
COPY ./config.example.yaml /app/config.yaml
COPY ./.eslintignore /app/.eslintignore
COPY ./.eslinttc.yml /app/.eslinttc.yml
COPY ./app.js /app/app.js
COPY ./jest.config.js /app/jest.config.js
COPY ./lerna.json /app/lerna.json
COPY ./package.json /app/package.json
COPY ./server.js /app/server.js
COPY ./yarn.lock /app/yarn.lock

WORKDIR /app

RUN apk add --no-cache git python make g++
RUN yarn install

FROM node:12.13.1-alpine

LABEL maintainer="Giovanni Rossini <giovannijrrossini@gmail.com>"

COPY --from=package /app /app

ENV PARCEL_WORKERS=1

WORKDIR /app