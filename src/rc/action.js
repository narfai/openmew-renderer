const compose = (...farray) => (...args) =>
    farray.reduce(
        (accumulator, current) => current(accumulator),
        ...args
    );

const pipe = (...farray) => compose(...farray.reverse());

const transducer = {
    propagate: (allow_propagate) => (next) => (action) => (
            (next_action) => ({
                ...next_action,
                'propagate':
                    (state) => typeof next_action.propagate === 'undefined'
                        ? allow_propagate(state)
                        : next_action.propagate(state) || allow_propagate(state)
            })
        )(next(action))
    ,
    reduce: (allow_reduce) => (next) => (action) => (
            (next_action) => ({
                ...next_action,
                'reduce':
                    (state) => typeof next_action.reduce === 'undefined'
                        ? allow_reduce(state)
                        : next_action.reduce(state) || allow_reduce(state)
            })
        )(next(action)),
    redraw: (allow_render) => (next) => (action) => (
            (next_action) => ({
                ...next_action,
                'redraw': allow_render()
            })
        )(next(action)),
};

const allow = {
    self: (store) => (state) => state.id === store.id,
    chain: (store) => (state) => store.chain.indexOf(state.id) !== -1,
    parent: (store) => (state) =>
            store.chain.length > 1
                ? store.chain[store.chain.length-2] === state.id
                : false
        ,
    resource: (resource) => (state) => state.resource === resource,
    self_resource: (store) => (state) => store.resource === state.resource,
    custom: (allow_func) => (store) => (state) => allow_func(store, state)
};

const scope = {
    create: (...transducers) => (store) => pipe(
        ...transducers.map(
            (extern_transducer) =>
                extern_transducer(store)({ allow, transducer })
            )
    ),
    self: (store) => pipe(
            transducer.propagate(allow.chain(store)),
            transducer.reduce(allow.self(store))
        )
    ,
    chain: (store) => pipe(
            transducer.propagate(allow.chain(store))
            //reduce all
        )
    ,
    parent: (store) => pipe(
            transducer.propagate(allow.chain(store)),
            transducer.reduce(allow.parent(store))
        )
    ,
    resource: (resource) => () => pipe(
            //propagate all
            transducer.reduce(allow.resource(resource))
        ),
    self_resource: (store) => pipe(
            //propagate all
            transducer.reduce(allow.self_resource(store))
        ),
    global: (/*store*/) => (next) => (action = {}) => {
        if(typeof action.propagate !== 'undefined') delete action.propagate;
        if(typeof action.reduce !== 'undefined') delete action.reduce;
        return next(action);
    }
};

const redraw = {
    allow: (/*store*/) => pipe(
        transducer.redraw(() => true)
    ),
    deny: (/*store*/) => pipe(
        transducer.redraw(() => false)
    )
};

const action_creator_identity = (/*state*/) => ({});
export function spread(action_creator = action_creator_identity){
    return (...scopes) => (store) =>
        pipe(
            ...scopes
                .filter((selected_transducer) => typeof selected_transducer === 'function')
                .map((selected_transducer) => selected_transducer(store))
        )(action_creator);
}

const spreadable = (action_identity) => (action_creator) => (...scopes) =>
    spread(
        (state) => action_identity(action_creator(state))
    )(...scopes);

spread.scope = scope;
spread.redraw = redraw;
const attach_identity = ({ resource, initial_state = {} }) => ({
    'type': 'ATTACH_MODULE',
    resource,
    initial_state
});

spread.attach = spreadable(attach_identity);

const detach_identity = ({ id }) => ({
    'type': 'DETACH_MODULE',
    id
});

spread.detach = spreadable(detach_identity);

export const action_collection = (action_creator, dispatcher) => (
        (user_actions) => Object
            .keys(user_actions)
            .reduce(
                (accumulator, current) => {
                    accumulator[current] = dispatcher(user_actions[current]);
                    return accumulator;
                },
            {})
    )(action_creator(spread))
;
