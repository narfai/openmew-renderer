/*
This Source Code Form is subject to the terms of the Mozilla Public
License, v. 2.0. If a copy of the MPL was not distributed with this
file, You can obtain one at http://mozilla.org/MPL/2.0/.

Copyright (C) 2019 François Cadeillan <francois@azsystem.fr>
*/

export class Store {
    constructor({ store, select = null }){
        this.store = store;
        this.select = select;
    }
    getState(){
        let state = this.store.getState();

        return this.select
            ? this.select(state)
            : state;
    }
    dispatch(action){
        return this.store.dispatch(action);
    }
}

export default Store;
