import { Container } from './Container.js';

export const inject = (resources) => (target) => {
    target[Container.injectSymbol()] = resources;
};

export const resource = (id) => (target) => {
    target[Container.resourceSymbol()] = id;
};

export const namespace = (ns) => (target) => {
    target[Container.namespaceSymbol()] = ns;
};
