/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * Copyright (C) 2019 François Cadeillan <francois@azsystem.fr>
 *
 */

export class Allow {
    static self(store){
        return (state) => state.id === store.id;
    }

    static chain(store){
        return (state) => store.chain.indexOf(state.id) !== -1;
    }

    static parent(store){
        return (state) =>
            store.chain.length > 1
                ? store.chain[store.chain.length-2] === state.id
                : false;
    }

    static resource(resource){
        return (state) => state.resource === resource;
    }

    static self_resource(store){
        return (state) => store.resource === state.resource;
    }

    static custom(allow_func){
        return (store) => (state) => allow_func(store, state);
    }
}
