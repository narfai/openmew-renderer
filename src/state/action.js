/*
This Source Code Form is subject to the terms of the Mozilla Public
License, v. 2.0. If a copy of the MPL was not distributed with this
file, You can obtain one at http://mozilla.org/MPL/2.0/.

Copyright (C) 2019 François Cadeillan <francois@azsystem.fr>
*/

export const REGISTER_TYPE = 'REGISTER';
export const ATTACH_TYPE = 'ATTACH';
export const DETACH_TYPE = 'DETACH';

export class Action {
    static REGISTER_BLUEPRINT({ resource, view, reducer = null, controller = null}){
        return {
            'type': REGISTER_TYPE,
            resource,
            view,
            reducer,
            controller
        };
    }

    static ATTACH({ resource, consumer_state, id = null, parent_id = null, render = null }){
        return {
            'type': ATTACH_TYPE,
            resource,
            consumer_state,
            parent_id,
            render,
            id
        };
    }

    static DETACH({ id }){
        return {
            'type': DETACH_TYPE,
            id
        };
    }
}

export class Spread {
    static self_scope(container, creator){
        return Spread.global_scope(container, () => {
            const w = creator();
            w.propagate = (state) => container.chain.indexOf(state.id) !== -1;
            w.reduce = (state) => state.id === container.id;
            return w;
        });
    }

    static chain_scope(container, creator){
        return Spread.global_scope(container, () => {
            const w = creator();
            w.propagate = (state) => container.chain.indexOf(state.id) !== -1;
            return w;
        });
    }

    static parent_scope(container, creator){
        return Spread.global_scope(container, () => {
            const w = creator();
            const parentId = container.chain.length > 1 ? container.chain[container.chain.length-2] : null;
            w.propagate = (state) => container.chain.indexOf(state.id) !== -1;
            w.reduce = (state) => state.id === parentId;
            return w;
        });
    }

    static resource_scope(container, resource, creator){ //TODO Try it
        return Spread.global_scope(container, () => {
            const w = creator();
            w.reduce = (state) => state.resource === resource;
            return w;
        });
    }

    static custom_scope(container, creator, reduce = null, propagate = null){
        return Spread.global_scope(container, () => {
            const w = creator();
            if(reduce) w.reduce = reduce;
            if(propagate) w.propagate = propagate;
            return w;
        });
    }

    static global_scope(container, creator){
        return (e = {}) => {
            e.redraw = false;
            const action = creator(e);
            action.container_id = container.id;
            e.dispatch_result = container.store.dispatch(action);
            return e;
        };
    }
}
