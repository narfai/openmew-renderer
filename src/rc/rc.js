import uniqid from 'uniqid';

import { module_identity, propagate, attach, detach, state_reducer, resource_filter, debug, logger } from './state';
import { component, controller, anchor, anchor_group, redraw_middleware } from './render';

const compose = (...farray) => (...args) =>
    farray.reduce(
        (accumulator, current) => current(accumulator),
        ...args
    );

const pipe = (...farray) => compose(...farray.reverse());

const chain_reducer = Symbol('chain_reducer');
export class Provider {
    constructor(mithril, initial_resource, initial_state = {}){
        this.component = (/*query_store*/) => ({ 'view': () => mithril('#') });

        this[chain_reducer] = (state) => state;
        const propagate_reducer = propagate((state, action) => this[chain_reducer](state, action));

        this.reducer = (state = module_identity(initial_resource, initial_state), action) =>
            propagate_reducer(state, action);

        this.Anchor = anchor(mithril);
        this.AnchorGroup = anchor_group(mithril);
    }

    connect_component(resource, component_resource, action_creators){
        this.component = compose(
            component(resource)(component_resource),
            controller(resource)(this, action_creators)
        )(this.component);
    }

    connect_transducers(state_transducers){
        this[chain_reducer] = pipe(
            ...state_transducers
        )(this[chain_reducer]);
    }
}

export const rc = {
    Provider,
    module_identity,
    attach,
    detach,
    debug,
    state_reducer,
    resource_filter,
    logger,
    redraw_middleware
};
