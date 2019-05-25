
/**STATE**/
class Store {
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


const renderer_action_creators = (id, chain) => ({
    'attach': ({ resource, consumer_state }) => ({
        'type': 'ATTACH_MODULE',
        resource,
        consumer_state,
        'parent': id,
        'chain': [...chain, this.id]
    })
});

