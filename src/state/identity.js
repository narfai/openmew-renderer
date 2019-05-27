/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * Copyright (C) 2019 François Cadeillan <francois@azsystem.fr>
 *
 */

import uniqid from 'uniqid';

export class Identity {
    static state_reducer(reducer_resource){
        return (next) =>
            (state, action) =>
                reducer_resource(next, state, action);
    }

    static module(resource, initial_state = {}){
        return {
            resource,
            'children': [],
            ...initial_state,
            'id': uniqid()
        };
    }

    static allow_propagation(state, action){
        return typeof action.propagate === 'undefined'
            || action.propagate(state) === true;
    }

    static allow_reduction(state, action){
        return typeof action.reduce === 'undefined'
            || action.reduce(state) === true;
    }
}

export default Identity;
