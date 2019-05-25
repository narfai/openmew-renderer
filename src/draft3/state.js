import uniqid from 'uniqid';

export class Store {
    constructor({ id, store, select = null }){
        this.store = store;
        this.select = select;
        this.chain = store instanceof Store
            ? store.getChain()
            : [id]
        ;
    }

    getChain(){
        return (
            ({ id = null }) =>
                id === null
                    ? this.chain
                    : [...this.chain, id]
        )(this.getState());
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

    static child_store(child_id, store){
        return new Store({
            'id': store.getState().id,
            store,
            'select': ({children = []}) =>
                children.find(
                    ({id}) => id === child_id
                )
        });
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
    ...consumer_state,
    'id': uniqid()
});

// if(state.resource !== resource) return state; ?
export const propagate_transducer = (next) => (resource) => (state = module_identity(resource), action) => {
    const propagate = state.children.filter((subState) => allow_propagation(subState, action) === true);
    const allow = allow_reduction(state, action);

    if(allow === false && propagate.length === 0) return state;

    const next_state = next(resource)(state, action);
    return {
        ...next_state,
        resource,
        'children': next_state.children
            .map((subState) =>
                propagate.includes(subState)
                    ? next(subState.resource)(subState, action)
                    : subState
            )

    };
};

export const attach_transducer = (next) => (resource) => (state = module_identity(resource), action) => {
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


export class Spread {
    static self(container, creator){
        return Spread.global(container, () => {
            const w = creator();
            w.propagate = (state) => container.chain.indexOf(state.id) !== -1;
            w.reduce = (state) => state.id === container.id;
            return w;
        });
    }

    static chain(container, creator){
        return Spread.global(container, () => {
            const w = creator();
            w.propagate = (state) => container.chain.indexOf(state.id) !== -1;
            return w;
        });
    }

    static parent(container, creator){
        return Spread.global(container, () => {
            const w = creator();
            const parentId = container.chain.length > 1 ? container.chain[container.chain.length-2] : null;
            w.propagate = (state) => container.chain.indexOf(state.id) !== -1;
            w.reduce = (state) => state.id === parentId;
            return w;
        });
    }

    static resource(container, resource, creator){ //TODO Try it
        return Spread.global(container, () => {
            const w = creator();
            w.reduce = (state) => state.resource === resource;
            return w;
        });
    }

    static custom(container, creator, reduce = null, propagate = null){
        return Spread.global(container, () => {
            const w = creator();
            if(reduce) w.reduce = reduce;
            if(propagate) w.propagate = propagate;
            return w;
        });
    }

    static global(container, creator){
        return (e = {}) => {
            e.redraw = false;
            const action = creator(e);
            action.container_id = container.id;
            e.dispatch_result = container.store.dispatch(action);
            return e;
        };
    }
}
