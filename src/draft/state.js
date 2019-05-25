import {ATTACH_TYPE, DETACH_TYPE} from '../state/action';
import format from '../../format';

export function reducer_creator(container){
    function reducer(state, action){
        if(typeof state.resource === 'undefined') state.resource = container.resource;
        if(typeof state.containers === 'undefined') state.containers = [];
        if(typeof state.consumer_state === 'undefined') state.consumer_state = [];

        const propagate = state.containers.filter((subState) => allow_propagation({ 'state': subState, action }) === true);
        const allow = allow_reduction({state, action});

        if(allow === false && propagate.length === 0) return state;

        return {
            ...state,
            'consumer_state': allow === true
                ? container.consumer_reducer(state.resource, state.consumer_state, action)
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
                    ? container.containers_reducer(
                    state,
                    containers_reducer(state.containers, action),
                    action
                    )
                    : state.containers
            )
        };
    }

    return reducer;
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
