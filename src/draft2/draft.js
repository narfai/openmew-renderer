/*
Able to load resources at any time
Able to render and reduce resources recursively
Able to choose render or not weather action or state

*/

import { createStore, applyMiddleware } from 'redux';
import m from 'mithril';
import uniqid from 'uniqid';

import { Anchor } from './render';
import { Store } from './state';

const document = {};


const component_symbol = Symbol('component');
const reducer_symbol = Symbol('reducer');
// const store_symbol = Symbol('store');

class Provider {
    constructor(store, mithril){
        this.mithril = mithril;
        this.store = new Store(store);
        this[component_symbol] = (resource) => this.mithril(Anchor, {
            'provider': this
        });
        this[reducer_symbol] = (state) => state;
    }

    reducer(state, action){
        return this[reducer_symbol](state, action);
    }

    component(resource){
        return this[component_symbol](resource);
    }
}

// if(state.resource !== resource) return state; <= Limit transducer to a given resource ... could also be static if user-defined

// const connect = (resource, component = null, action_creators = null, transducers = null) => (provider) => {
//
// };

const initial_state = null;

const provider = new Provider('Main');
const store = createStore(
    provider.reducer,
    initial_state,
    // applyMiddleware(provider.middlewares)
);

m.mount(document.getElementById('app'), provider.component('App'));

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
