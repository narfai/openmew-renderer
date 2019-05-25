import uniqid from 'uniqid';

import { module_identity, propagate, attach, transducer, resource_filter } from './state';
import { component, controller, anchor, anchor_group } from './render';

const compose = (...farray) => (...args) =>
    farray.reduce(
        (accumulator, current) => current(accumulator),
        ...args
    );

const pipe = (...farray) => compose(...farray.reverse());

export class Provider {
    constructor(mithril){
        this.component = (/*query_store*/) => ({ 'view': () => mithril('#') });
        this.reducer = (/*query_resource*/) => (state) => state;
        this.Anchor = anchor(mithril);
        this.AnchorGroup = anchor_group(mithril);
    }

    connect_component(resource, component_resource, action_creators){
        this.component = compose(
            component(resource)(component_resource),
            controller(resource)(this, action_creators)
        )(this.component);
    }

    connect_transducers(transducers){
        this.reducer = pipe(
            ...transducers
        )(this.reducer);
    }
}

export const rc = {
    Provider,
    module_identity,
    propagate,
    attach,
    transducer,
    resource_filter
};

/**
new provider
 + initial_state => new store
    + resource, component, action_creators, transducers => new resource
        render

**/
