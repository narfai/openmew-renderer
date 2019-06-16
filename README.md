----

# OpenMew Renderer

## Description

OpenMew library which allow to render Mithril/Redux based components recursively.

## Test it !

* `yarn install`

* `yarn build`

* `cd example`

* `yarn install`

* open `example/index.html` in your browser

## Docker

`<command>` could be :

* build : dev & production build for web et node-webkit targets

* lint : check lint with eslint

* watch:lib : watch for changes & build library ( must be used in live source mode)

* watch:test: watch "*.test.js" changes & run tests

* shell : run bash shell

* yarn : perform yarn commands


### Embedded sources

`docker build -t omr .`

`docker run --rm -ti -v $(pwd)/dist:/usr/src/openmew-renderer/dist omr <command>`

### Live sources

`docker run --rm -ti -v $(pwd):/usr/src/openmew-renderer omr <command>`


## Notices

* /src is the source code of renderer (under MPL 2.0 license)

* /example is the source code of example project (under DWTFYW license)

## Trello

https://trello.com/b/JIyri14h/openmew-renderer

----
