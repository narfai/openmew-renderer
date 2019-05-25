import uniqid from 'uniqid';
const pipe = (...func) => (...args) => func.reduce((acc, cur) => cur(acc), ...args);
const compose = (...func) => compose(...func.reverse());

const getter = (next) => (resource, component) => (query_resource) => {
        return resource === query_resource
            ? component
            : next(query_resource);
    }
;

const module_identity = (resource, consumer_state = {}) => ({
    resource,
    'children': [],
    ...consumer_state,
    'id': uniqid()
});

class Provider {
    constructor(mithril){
        this.component = (resource) => ({ 'view': () => mithril('h1', 'test') });
        this.reducer = (state) => state;
    }

    connect_component(resource, component){
        this.component = getter(this.component)(resource, component);
    }

    connect_transducers(resource, transducers){
        this.reducer = pipe(...transducers.map((transducer) => transducer(resource)))(this.reducer);
    }
}

export const draft = {
    Provider,
    module_identity
};

//TODO register action creators
//TODO
