/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * Copyright (C) 2019 François Cadeillan <francois@azsystem.fr>
 *
 */
const internal_store = Symbol('internal_store');
const internal_select = Symbol('internal_select');
export class Store {
    constructor({ store, select = null }){
        this[internal_store] = store;
        this[internal_select] = select;

        const { id, resource } = this.getState();
        this.id = id;
        this.resource = resource;
        this.chain = typeof store.chain === 'undefined'
            ? [this.id]
            : [...store.chain, this.id]
        ;
    }

    getState(){
        let state = this[internal_store].getState();

        return this[internal_select]
            ? this[internal_select](state)
            : state;
    }

    dispatch(action){
        return this[internal_store].dispatch(action);
    }

    static child_store(child_id, store){
        if(store === null) throw new Error('Store cannot be null');
        return new Store({
            store,
            'select': ({children = []}) =>
                children.find(
                    ({id}) => id === child_id
                )
        });
    }
}
