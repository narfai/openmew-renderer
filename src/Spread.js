/*
 This Source Code Form is subject to the terms of the Mozilla Public
 License, v. 2.0. If a copy of the MPL was not distributed with this
 file, You can obtain one at http://mozilla.org/MPL/2.0/.

 Copyright (C) 2017 François Cadeillan <francois@azsystem.fr>
 */

export class Spread {
    static self_scope(container, creator){
        return Spread.global_scope(container, () => {
            let w = creator();
            w.propagate = (state) => container.chain.indexOf(state.id) !== -1;
            w.reduce = (state) => state.id === container.id;
            return w;
        });
    }
    static chain_scope(container, creator){
        return Spread.global_scope(container, () => {
            let w = creator();
            w.propagate = (state) => container.chain.indexOf(state.id) !== -1;
            return w;
        });
    }
    static parent_scope(container, creator){
        return Spread.global_scope(container, () => {
            let w = creator();
            let parentId = container.chain.length > 1 ? container.chain[container.chain.length-2] : null;
            w.propagate = (state) => container.chain.indexOf(state.id) !== -1;
            w.reduce = (state) => state.id === parentId;
            return w;
        });
    }

    static resource_scope(container, resource, creator){ //TODO Try it
        return Spread.global_scope(container, () => {
            let w = creator();
            w.reduce = (state) => state.resource === resource;
            return w;
        });
    }

    static custom_scope(container, creator, reduce = null, propagate = null){
        return Spread.global_scope(container, () => {
            let w = creator();
            if(reduce)
                w.reduce = reduce;
            if(propagate)
                w.propagate = propagate;
            return w;
        });
    }

    static global_scope(container, creator){
        return (e) => {
            e.redraw = true;
            let action = creator(e);
            action.id = container.id;
            container.store.dispatch(action);
            return e;
        };
    }

    //TODO replaceby add / remove container interface
    // craftAddModuleAction({ resource, creator = {}, name = '' }){
    //     return {
    //         'type': 'ADD_MODULE',
    //         'resource': resource,
    //         'name': name,
    //         'creator': creator
    //     };
    // }
    //
    // craftRemoveModuleAction({ id }){
    //     return {
    //         'type': 'REMOVE_MODULE',
    //         'id': id
    //     };
    // }
}

export default Spread;
