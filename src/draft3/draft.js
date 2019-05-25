import uniqid from 'uniqid';

import { Store, module_identity, propagate_transducer, attach_transducer } from './state';
import m from 'mithril';

const compose = (...func) => (...args) => func.reduce((acc, cur) => cur(acc), ...args);
const pipe = (...func) => compose(...func.reverse());


export const Anchor = {
    'oninit': function({ 'attrs': { store, provider }}){
        console.log('anchor for ', store.getState(), store.getChain());
        this.component = provider.component(store);

    },
    'view': (vnode) => {
        return m(
            'div',
            [
                m('h1', 'ANCHOR'),
                m(vnode.state.component)
            ]
        );
    }
};


export const AnchorGroup = {
    'oninit': function({ 'attrs': { provider }}){
        const stores = {};
        this.attributes = (id, store) => {
            return ({
                provider,
                'store': stores.hasOwnProperty(id)
                    ? stores[id]
                    : stores[id] = Store.child_store(id, store)
            });
        };
    },
    'view': ({ 'state': { attributes }, 'attrs': { store, filterFn = () => true, wrapper = null }}) => {
        return store.getState().children
            .filter((child_state) => filterFn(child_state))
            .map(({id}) => wrapper !== null
                ? m(wrapper, {'key': id}, [m(Anchor, attributes(id, store))])
                : m(Anchor, attributes(id, store))
            );
    }
};


const component_transducer = (filter_resource) => (item) => (next) => (store = null) => {
        if(store === null) return next(store);

        const { resource } = store.getState();
        return filter_resource === resource
            ? item
            : next(store);
    }
;

const controller_transducer = (filter_resource) => (provider, action_creators = null) => (next) => (store) => {
    const next_component = next(store);
    if(store === null || filter_resource !== store.getState().resource) return next_component;

    const { oninit = null } = next_component;

    return {
        ...next_component,
        'oninit': function(vnode){
            this.provider = provider;
            this.store = store;

            if(oninit !== null) oninit.call(this, vnode);
        }
    };
};

export class Provider {
    constructor(mithril){
        this.component = (/*query_store*/) => ({ 'view': () => mithril('#') });
        this.reducer = (/*query_resource*/) => (state) => state;
    }

    connect_component(resource, component, action_creators){
        this.component = compose(
            component_transducer(resource)(component),
            controller_transducer(resource)(this, action_creators)
        )(this.component);
    }

    connect_transducers(transducers){
        this.reducer = pipe(
            ...transducers
        )(this.reducer);
    }
}

export const draft = {
    Provider,
    module_identity,
    propagate_transducer,
    attach_transducer,
    Anchor,
    AnchorGroup
};


const renderer_action_creators = (id, chain) => ({
    'attach': ({ resource, consumer_state }) => ({
        'type': 'ATTACH_MODULE',
        resource,
        consumer_state,
        'parent': id,
        'chain': [...chain, this.id]
    })
});

/**
new provider
 + initial_state => new store
    + resource, component, action_creators, transducers => new resource
        render

**/
