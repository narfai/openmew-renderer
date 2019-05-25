
/**STATE**/
export class Store {
    constructor(store, select = null){
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


function allow_propagation(state, action){
    return (typeof action.propagate === 'undefined' || action.propagate(state) === true);
}

function allow_reduction(state, action){
    return (typeof action.reduce === 'undefined' || action.reduce(state) === true);
}


export const module_identity = (resource, consumer_state = {}) => ({
    resource,
    'children': [],
    ...consumer_state
});

// if(state.resource !== resource) return state; ?
export const propagate_transducer = (resource) => (next) => (state = module_identity(resource), action) => {
    const propagate = state.children.filter((subState) => allow_propagation(subState, action) === true);
    const allow = allow_reduction(state, action);

    if(allow === false && propagate.length === 0) return state;

    const next_state = next(state, action);
    return {
        ...next_state,
        resource,
        'children': next_state.children
            .map((subState) =>
                propagate.includes(subState)
                    ? next(subState.resource, subState, action)
                    : subState
            )

    };
};

export const attach_transducer = (resource) => (next) => (state = module_identity(resource), action) => {
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
            }))(next(state, action));
        default:
            return next(state, action);
    }
};

const renderer_action_creators = (id, chain) => ({
    'attach': ({ resource, consumer_state }) => ({
        'type': 'ATTACH_MODULE',
        resource,
        consumer_state,
        'parent': id,
        'chain': [...chain, this.id]
    })
});

