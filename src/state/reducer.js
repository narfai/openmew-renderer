/*
This Source Code Form is subject to the terms of the Mozilla Public
License, v. 2.0. If a copy of the MPL was not distributed with this
file, You can obtain one at http://mozilla.org/MPL/2.0/.

Copyright (C) 2019 François Cadeillan <francois@azsystem.fr>
*/

import { ATTACH_TYPE, DETACH_TYPE } from './action';
import format from '../format';

export function reducer_creator(registry){
    return (container) => {
        function reducer(state = { 'id': container.id, 'resource': container.resource, 'containers': [], 'consumer_state': {} }, action){
            if(typeof state.id === 'undefined')
                state = format.container({ 'id': container.id, 'resource': container.resource });

            const propagate = state.containers.filter((subState) => allow_propagation({ 'state': subState, action }) === true);
            const allow = allow_reduction({state, action});

            if(allow === false && propagate.length === 0) return state;

            return {
                ...state,
                'consumer_state': allow === true
                    ? registry.reducer(state.resource, state.consumer_state, action)
                    : state.consumer_state,
                'containers': (
                        (containers) =>
                            containers.map((subState) =>
                                typeof action.container_id !== 'undefined' && propagate.includes(subState)
                                    ? reducer(subState, action)
                                    : subState
                            )
                    )(
                        allow === true
                            ? registry.containers_reducer(
                                state,
                                containers_reducer(state.containers, action),
                                action
                            )
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

function containers_reducer(state = [], action){
    switch (action.type){
        case ATTACH_TYPE:
            if(action.parent_id === null) return state;
            return [
                ...state,
                format.container(action)
            ];
        case DETACH_TYPE:
            return state.filter(({ id }) => id !== action.id);
        default:
            return state;
    }
}
