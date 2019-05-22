/*
This Source Code Form is subject to the terms of the Mozilla Public
License, v. 2.0. If a copy of the MPL was not distributed with this
file, You can obtain one at http://mozilla.org/MPL/2.0/.

Copyright (C) 2019 François Cadeillan <francois@azsystem.fr>
*/

import { Container } from './container';
import { reducer_creator } from './state/reducer';
import { component_creator } from './mithril_component';
import format from './format';

export class Registry {
    constructor(){
        this.blueprints = {};
        this.containers = {};
    }

    register({ resource, ...other }){
        this.blueprints[resource] = format.blueprint({ resource, ...other });
    }

    attach(store, { id, resource, parent_id = null }){
        if(typeof this.blueprints[resource] === 'undefined')
            throw new Error('Unregistered resource ' + resource);

        let parent;
        const { chain, from_store } = Object.assign({
            'chain': [],
            'from_store': store
        }, (
            parent_id !== null
                ? (
                    parent = this.get_or_fail(parent_id),
                    { 'from_store': parent.store, 'chain': parent.chain }
                  )
                : null
        ));

        console.log('BLUEPRINTS', this.blueprints[resource]);
        const container = new Container({
            id,
            from_store,
            'component_creator': component_creator(this, this.blueprints[resource]),
            'reducer': reducer_creator(this),
            resource,
            chain
        });

        this.containers[container.id] = container;
        return container;
    }

    reducer(resource, state, action){
        if(typeof this.blueprints[resource] === 'undefined')
            throw new Error('Unregistered resource ' + resource);

        const { reducer } = this.blueprints[resource];

        if(reducer !== null) return reducer(state, action);

        return state;
    }

    containers_reducer(resource, state, action){
        if(typeof this.blueprints[resource] === 'undefined')
            throw new Error('Unregistered resource ' + resource);

        const { containers_reducer } = this.blueprints[resource];

        if(containers_reducer !== null) return containers_reducer(state, action);

        return state;
    }

    detach({ id }){
        if(typeof this.containers[id] !== 'undefined') {
            this.containers[id].containers.forEach((child) => {
                this.detach({'id': child.id});
            });
            delete this.containers[id];
        }
    }

    get(id){
        if(typeof this.containers[id] === 'undefined')
            return null;
        return this.containers[id];
    }

    get_or_fail(id){
        return this.get(id) || (() => {
            throw new Error('Detached container #' + id);
        })();
    }
}
