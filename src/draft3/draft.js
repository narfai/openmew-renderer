import uniqid from 'uniqid';

import { module_identity, propagate_transducer, attach_transducer } from './state';

const compose = (...func) => (...args) => func.reduce((acc, cur) => cur(acc), ...args);
const pipe = (...func) => compose(...func.reverse());

const getter = (next) => (resource, component) => (query_resource) => {
        return resource === query_resource
            ? component
            : next(query_resource);
    }
;

export class Provider {
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
    module_identity,
    propagate_transducer,
    attach_transducer
};

// const initial_state = null;
//
// const provider = new Provider();
// const store = createStore(
//     provider.reducer,
//     initial_state,
//     // applyMiddleware(provider.middlewares)
// );
//
// m.mount(document.getElementById('app'), provider.component('App'));
//
//
// const connect_component = (provider, component) => {
//     return () => {};
// };

// provider.register(
//
//     connect(
//         'App',
//         // ({ name/*but also containers or any defined array*/ }) => ({ name }), //will be attached to vnode.state => automatically
//         { 'view': (vnode) => m(Anchor, { 'provider': vnode.provider, 'id': vnode.state.id }) }, //pure mithril component whatever it is
//         (id, chain) => ({ ...renderer_action_creators(id, chain) }), //optional result will be attached to vnode
//         [ propagate_transducer, attach_transducer ], //optional reducers to transduce
//     )(
//
//     )
// ).then(m.redraw);
//
// provider.register(
//     'Hello',
//     connect(
//         [ propagate_transducer, attach_transducer, increment_transducer ]
//     )(
//         ({ id, chain }) => ({ ...renderer_action_creators(id, chain) })
//     )(
//         { 'view': () => m('Hello World') }, //pure mithril component whatever it is
//     )
// ).then(m.redraw);

//TODO id chain into the Store so we may not need to have a container
//TODO monad https://www.toptal.com/javascript/option-maybe-either-future-monads-js
//Gosh facebook got solution for my kind of problems https://github.com/facebook/flux/tree/master/examples/flux-todomvc


/**
new provider
 + initial_state => new store
    + resource, component, action_creators, transducers => new resource
        render

**/
