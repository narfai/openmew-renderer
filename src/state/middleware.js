import uniqid from 'uniqid';

import { Action, REGISTER_TYPE, ATTACH_TYPE, DETACH_TYPE } from './action';

export const register_middleware = (registry) => (store) => (next) => (action) => {
    if (action.type !== REGISTER_TYPE)
        return next(action);

    registry.register(action);

    delete action.view;
    delete action.reducer;
    delete action.controller;
    return next(action);
};

export const attach_middleware = (registry) => (store) => (next) => (action) => {
    if (action.type !== ATTACH_TYPE)
        return next(action);

    if(action.id === null){
        let initial_state = store.getState();
        action.id = action.parent_id === null
        && typeof initial_state.id !== 'undefined'
            ? initial_state.id
            : uniqid();
    }

    const container = registry.attach(store, action);
    if(container !== null){
        const state = container.store.getState();

        if(state && typeof state.containers !== 'undefined'){
            state.containers.forEach(({id, resource, consumer_data}) => store.dispatch(
                Action.ATTACH({
                    id,
                    resource,
                    consumer_data,
                    'parent_id': container.id
                }))
            );
        }
    }

    if (action.render)
        action.render({container});
    delete action.render;

    return next(action);
};

export const detach_middleware = (registry) => (store) => (next) => (action) => {
    if (action.type !== DETACH_TYPE)
        return next(action);

    const container = registry.get(action.id);
    if(container !== null){
        registry.detach({ 'id': container.id });
    }

    return next(action);
};
