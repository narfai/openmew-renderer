/*
 This Source Code Form is subject to the terms of the Mozilla Public
 License, v. 2.0. If a copy of the MPL was not distributed with this
 file, You can obtain one at http://mozilla.org/MPL/2.0/.

 Copyright (C) 2017 François Cadeillan <francois@azsystem.fr>
 */

import { createStore } from 'redux';
import { StoreProvider, SubStoreProvider } from './StoreProviders.js';

let pStore = Symbol('store');

export class ProviderManager {
    constructor({ data = {} }){
        this[pStore] = createStore((state) => state, data);
        this.provider = new StoreProvider(this[pStore], 1);
    }
    replaceReducer({ reducer }){
        this[pStore].replaceReducer(reducer);
    }
    getProvider(){
        return this.provider;
    }
    createSubProvider({ id, parent, key, discriminator }){
        return new SubStoreProvider(
            parent,
            (s) => s[key].find(({ [discriminator]: stateId }) => stateId === id),
            id
        );
    }
}

export default ProviderManager;
