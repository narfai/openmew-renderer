import uniqid from 'uniqid';

//TODO proper functional exposable tools pipe & compose
//TODO proper class with statics
export const state_reducer = (reducer_resource) =>
    (next) =>
        (state, action) =>
            reducer_resource(next, state, action); //TODO generic transducer def


export const module_identity = (resource, initial_state = {}) => ({
    resource,
    'children': [],
    ...initial_state,
    'id': uniqid()
});

const allow_propagation =
        (state, action) =>
            typeof action.propagate === 'undefined'
                || action.propagate(state) === true
;

const allow_reduction =
        (state, action) =>
            typeof action.reduce === 'undefined'
               || action.reduce(state) === true
;

const is_structural =
        (state, action) =>
            typeof action.structural === 'boolean'
                && action.structural
                    && allow_propagation(state, action);

export const debug = (name, transducer) => state_reducer((next, state = null, action = {}) => {
    console.groupCollapsed('DEBUG TRANSDUCER' + name + ' against ' + action.type);
    console.log('dispatching', action);
    console.log('state', state);
    const next_state = transducer(next)(state, action);
    console.log('next_state', state);
    console.log('propagate to', state.children.filter(
        (subState) => allow_propagation(subState, action) === true
    ).map(({ id }) => id));
    console.log('reduction allowed', allow_reduction(state, action));
    console.groupEnd();

    return next_state;
});

export const logger = state_reducer((next, state = null, action = {}) => {
    console.group(action.type);
    console.info('dispatching', action);
    console.log('state', state);
    const next_state = next(state, action);
    console.log('next state', next_state);
    console.log('reducted', next_state !== state);
    console.log('propagated', next_state.children !== state.children);
    console.groupEnd();
    return next_state;
});

//@NOTICE Propagate endorse both roles of recursive Enumerator and Accumulator
export const propagate = state_reducer(function propagate_reducer(next, state = null, action = {}){
    //@NOTICE decisions are also made with old state here
    const propagate_ids = state.children.filter(
        (subState) => allow_propagation(subState, action) === true
    ).map(({ id }) => id);

    //@NOTICE And here
    const allow = allow_reduction(state, action);

    if(allow === false && propagate_ids.length === 0) return state;
    const next_state = (
        allow === true
            ? next(state, action)
            : state
    );

    return {
        ...next_state,
        'children': next_state.children
            .map((subState) =>
                //@NOTICE ... So a newly created child cannot be reduced with same action
                // ( which is good because it avoid recursion errors )
                propagate_ids.includes(subState.id)
                    ? propagate_reducer(next, subState, action)
                    : subState //@NOTICE ... but its state will bubble up the tree
            )
    };
});

export const attach = state_reducer((next, state = null, action = {}) =>
    ((next_state) => (
        action.type === 'ATTACH_MODULE'
            ? {
                ...next_state,
                'children': [
                    ...next_state.children,
                    module_identity(action.resource, action.initial_state)
                ]
            }
            : next_state
        )
    )(next(state, action))
);

export const detach = state_reducer((next, state = null, action = {}) =>
    ((next_state) => {
        return (
            action.type === 'DETACH_MODULE'
                ? {
                    ...next_state,
                    'children': next_state.children.filter(({ id }) => id !== action.id)
                }
                : next_state
            );
        }
    )(next(state, action))
);

export const resource_filter = (...resources) => state_reducer((next, state, action = {}) =>
    resources.includes(state.resource)
        ? state
        : next(state, action)
);
