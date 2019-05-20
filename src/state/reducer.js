import { ATTACH_TYPE, DETACH_TYPE } from './action';

export function reducer_creator({ registry, reducer }){
    return (container) => (state = { 'containers': [], 'consumer_data': {} }, action = null) => {
        const allow = allow_reduction({state, action});
        return {
            'id': state.id,
            'resource': state.resource,
            'consumer_data': allow === true
                ? reducer(state.consumer_data, action)
                : state.consumer_data,
            'containers': (
                (containers) =>
                    containers.map((subState) =>
                        typeof action.container_id !== 'undefined' && allow_propagation({'state': subState, action}) === true
                            ? container.reducer(subState, action)
                            : subState
                    )
            )(
                allow === true
                    ? internal_reducer({'state': state.containers, action })
                    : state.containers
            )
        };
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
                    'consumer_data': action.consumer_data || {},
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
