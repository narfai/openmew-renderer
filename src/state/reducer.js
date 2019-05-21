/*
This Source Code Form is subject to the terms of the Mozilla Public
License, v. 2.0. If a copy of the MPL was not distributed with this
file, You can obtain one at http://mozilla.org/MPL/2.0/.

Copyright (C) 2019 François Cadeillan <francois@azsystem.fr>
*/

import { ATTACH_TYPE, DETACH_TYPE } from './action';

export function reducer_creator({ registry }){
    return (container) => {
        function reducer(state = { 'containers': [], 'consumer_state': {} }, action){
            const allow = allow_reduction({state, action});
            const resource = state.resource || container.resource;
            const id = state.id || container.id;
            return {
                id,
                resource,
                'consumer_state': allow === true
                    ? registry.reducer(resource, state.consumer_state, action)
                    : state.consumer_state,
                'containers': (
                    (containers) =>
                        containers.map((subState) =>
                            typeof action.container_id !== 'undefined' && allow_propagation({'state': subState, action}) === true
                                ? reducer(subState, action)
                                : subState
                        )
                )(
                    allow === true
                        ? internal_reducer({'state': state.containers, action })
                        : state.containers
                )
            };
        }

        return reducer;
    };
}

function allow_propagation({ state, action }){
    return (typeof action.propagate === 'undefined' || action.propagate(state) === true);
}

function allow_reduction({ state, action }){
    return (typeof action.reduce === 'undefined' || action.reduce(state) === true);
}

function internal_reducer({ state = [], action }){
    switch (action.type){
        case ATTACH_TYPE:
            if(action.parent_id === null) return state;
            return [
                ...state,
                {
                    'id': action.id,
                    'consumer_state': action.consumer_state || {},
                    'resource': action.resource,
                    'containers': []
                }
            ];
        case DETACH_TYPE:
            return state.filter(({ id }) => id !== action.id);
        default:
            return state;
    }
}
