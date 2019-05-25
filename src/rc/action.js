const renderer_action_creators = ({ id, chain }) => ({
    'attach': ({ resource, consumer_state }) => ({
        'type': 'ATTACH_MODULE',
        resource,
        consumer_state,
        'parent': id,
        'chain': [...chain, this.id]
    })
});

export const scope = {
    'self': (store) => (action) => ({
        ...action,
        'propagate': (state) => store.getChain().indexOf(state.id) !== -1,
        'reduce': (state) => state.id === store.getId()
    }),
    'chain': (store) => (action) => ({
        ...action,
        'propagate': (state) => store.getChain().indexOf(state.id) !== -1
    }),
    'parent': (store) => (action) => ({}),
    'resource': (store) => (action) => ({}),
    'custom': (store) => (action) => ({}),
    'global': (store) => (action) => ({})
};

export class ScopeSpreader {
    static self(creator){
        return (store) => ScopeSpreader.global(() => {
            const w = creator();
            w.propagate = (state) => store.getChain().indexOf(state.id) !== -1;
            w.reduce = (state) => state.id === store.id;
            return w;
        })(store);
    }

    static chain(creator){
        return (store) => ScopeSpreader.global(() => {
            const w = creator();
            w.propagate = (state) => store.getChain().indexOf(state.id) !== -1;
            return w;
        })(store);
    }

    static parent(creator){
        return (store) => ScopeSpreader.global(() => {
            const chain = store.getChain();
            const w = creator();
            const parentId = chain.length > 1 ? chain[chain.length-2] : null;
            w.propagate = (state) => chain.indexOf(state.id) !== -1;
            w.reduce = (state) => state.id === parentId;
            return w;
        })(store);
    }

    static resource(resource, creator){ //TODO Try it
        return (store) => ScopeSpreader.global(() => {
            const w = creator();
            w.reduce = (state) => state.resource === resource;
            return w;
        })(store);
    }

    static custom(creator, reduce = null, propagate = null){
        return (store) => ScopeSpreader.global(() => {
            const w = creator();
            if(reduce) w.reduce = reduce;
            if(propagate) w.propagate = propagate;
            return w;
        })(store);
    }

    static global(creator){
        return (store) => (e = {}) => {
            e.redraw = false;
            const action = creator(e);
            action.store_id = store.id;
            e.dispatch_result = store.dispatch(action);
            return e;
        };
    }
}
