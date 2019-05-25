import uniqid from 'uniqid';


export const transducer = (reducer) => (next) => (resource) => (state, action) => reducer(next, resource, state, action);

export const module_identity = (resource, consumer_state = {}) => ({
    resource,
    'children': [],
    ...consumer_state,
    'id': uniqid()
});

function allow_propagation(state, action){
    return (typeof action.propagate === 'undefined' || action.propagate(state) === true);
}

function allow_reduction(state, action){
    return (typeof action.reduce === 'undefined' || action.reduce(state) === true);
}

export const propagate = (next) => (resource) => (state = null, action) => {
    if(state === null) return module_identity(resource);

    const propagate_states = state.children.filter((subState) => allow_propagation(subState, action) === true);
    const allow = allow_reduction(state, action);

    if(allow === false && propagate.length === 0) return state;

    const next_state = next(resource)(state, action);
    return {
        ...next_state,
        resource,
        'children': next_state.children
            .map((subState) =>
                propagate_states.includes(subState)
                    ? next(subState.resource)(subState, action)
                    : subState
            )

    };
};

export const attach = (next) => (resource) => (state = null, action) => {
    if(state === null) return module_identity(resource);

    switch(action.type){
        case 'ATTACH_MODULE':
            return ((next_state) => ({
                ...next_state,
                'children': [
                    ...next_state.children,
                    {
                        'resource': action.resource,
                        'children': [],
                        ...next_state.consumer_state
                    }
                ]
            }))(next(resource)(state, action));
        default:
            return next(resource)(state, action);
    }
};

export const resource_filter = (next) => (resource) => (state, action) => {
    if(resource !== state.resource) return state;
    return next(resource)(state, action);
};
