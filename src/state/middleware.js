/*
This Source Code Form is subject to the terms of the Mozilla Public
License, v. 2.0. If a copy of the MPL was not distributed with this
file, You can obtain one at http://mozilla.org/MPL/2.0/.

Copyright (C) 2019 François Cadeillan <francois@azsystem.fr>
*/

import uniqid from 'uniqid';

import { Action, REGISTER_TYPE, ATTACH_TYPE, DETACH_TYPE } from './action';

export const register_middleware = (registry) => () => (next) => (action) => {
    if (action.type !== REGISTER_TYPE)
        return next(action);

    registry.register(action);

    delete action.view;
    delete action.reducer;
    delete action.controller;
    delete action.lifecycle;
    return next(action);
};

export const attach_middleware = (registry) => (store) => (next) => (action) => {
    if (action.type !== ATTACH_TYPE)
        return next(action);

    const container = registry.attach(store, action);
    if(container !== null){
        const state = container.store.getState();

        if(state && typeof state.containers !== 'undefined'){
            state.containers.forEach(({id, resource, consumer_state}) => store.dispatch(
                Action.ATTACH({
                    id,
                    resource,
                    consumer_state,
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

export const detach_middleware = (registry) => () => (next) => (action) => {
    if (action.type !== DETACH_TYPE)
        return next(action);

    const container = registry.get(action.id);

    if(container !== null) registry.detach({ 'id': container.id });

    return next(action);
};
