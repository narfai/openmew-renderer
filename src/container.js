/*
This Source Code Form is subject to the terms of the Mozilla Public
License, v. 2.0. If a copy of the MPL was not distributed with this
file, You can obtain one at http://mozilla.org/MPL/2.0/.

Copyright (C) 2019 François Cadeillan <francois@azsystem.fr>
*/

import { Store } from './state/store';

export class Container {
    constructor({ id, from_store, component_creator, resource, reducer, chain = []}){
        this.id = id;
        this.chain = [...chain, id];
        this.store = new Store({
            'store': from_store,
            'select':
                this.chain.length === 1
                    ? null
                    : (state) =>
                        (typeof state.containers !== 'undefined')
                            ? state.containers.find(
                            ({ 'id': state_id }) => state_id === this.id
                            )
                            : state
        });

        this.resource = resource;
        this.reducer = reducer(this);
        this.component = component_creator(this);
    }

    consumer_state(){
        return { ...this.store.getState().consumer_state };
    }
}
