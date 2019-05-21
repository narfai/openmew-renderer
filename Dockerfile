FROM node:alpine

WORKDIR /usr/src/openmew-renderer

RUN apk add --no-cache yarn bash shadow

COPY . .

ENTRYPOINT ["/usr/src/openmew-renderer/entrypoint.sh"]
