FROM node:alpine

WORKDIR /usr/src/openmew-renderer

RUN apk add --no-cache yarn && yarn install --production=false && yarn build

COPY . .

VOLUME "/usr/src/openmew-renderer/target"
