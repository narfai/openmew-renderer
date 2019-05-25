import uniqid from 'uniqid';

import { Store, module_identity, propagate_transducer, attach_transducer } from './state';
import { component_transducer, controller_transducer, anchor, anchor_group } from './render';

const compose = (...func) => (...args) => func.reduce((acc, cur) => cur(acc), ...args);
const pipe = (...func) => compose(...func.reverse());

export class Provider {
    constructor(mithril){
        this.component = (/*query_store*/) => ({ 'view': () => mithril('#') });
        this.reducer = (/*query_resource*/) => (state) => state;
        this.Anchor = anchor(mithril);
        this.AnchorGroup = anchor_group(mithril);
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

export const rc = {
    Provider,
    module_identity,
    propagate_transducer,
    attach_transducer
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
