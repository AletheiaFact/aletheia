FROM node:12.13.1-alpine AS package

COPY ./package.json /app/package.json
COPY ./lerna.json /app/lerna.json
COPY ./yarn.lock /app/yarn.lock
COPY ./packages /app/packages
COPY ./.eslintrc.yml /app/.eslintrc.yml 

WORKDIR /app

RUN apk add --no-cache git python make g++
RUN yarn install
RUN yarn build

FROM node:12.13.1-alpine

LABEL maintainer="Giovanni Rossini <giovannijrrossini@gmail.com>"

COPY --from=package /app /app

WORKDIR /app

ENTRYPOINT [ "yarn", "dev" ]