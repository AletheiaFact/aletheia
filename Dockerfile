FROM node:12.13.1-alpine AS package

COPY ./.babelrc /app/.babelrc
COPY ./config.example.yaml /app/config.yaml
COPY ./.eslintignore /app/.eslintignore
COPY ./.eslintrc.yml /app/.eslintrc.yml
COPY ./jest.config.js /app/jest.config.js
COPY ./lerna.json /app/lerna.json
COPY ./package.json /app/package.json
COPY ./yarn.lock /app/yarn.lock
COPY ./scripts /app/scripts
COPY ./server/ /app/

WORKDIR /app

RUN apk add --no-cache git python make g++
RUN yarn install
RUN yarn build

FROM node:12.13.1-alpine

LABEL maintainer="Giovanni Rossini <giovannijrrossini@gmail.com>"

COPY --from=package /app /app
COPY ./src /app/src

WORKDIR /app

ENTRYPOINT [ "yarn", "start" ]