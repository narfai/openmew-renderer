/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * Copyright (C) 2019 François Cadeillan <francois@azsystem.fr>
 *
 */

import { Store } from './state';
import { action_collection } from './action/index';

export class Renderer {
    static anchor(mithril){
        const component = Symbol('component');
        return {
            'oninit': function({ 'attrs': { store, provider }}){
                this[component] = provider.component(store);
            },
            'view': ({ state }) => mithril(
                'div',
                [
                    mithril(
                        state[component]
                    )
                ]
            )
        };
    }

    static anchor_group(mithril){
        const attributes = Symbol('attributes');
        return {
            'oninit': function({ 'attrs': { provider }}){
                const stores = {};
                this[attributes] = (id, store) => ({
                    provider,
                    'store': stores.hasOwnProperty(id)
                        ? stores[id]
                        : stores[id] = Store.child_store(id, store)
                });
            },
            'view': ({ state, 'attrs': { store, provider, filterFn = () => true, wrapper = null }}) =>
                store.getState().children
                    .filter((child_state) => filterFn(child_state))
                    .map(
                        ({id}) => wrapper !== null
                            ? mithril(wrapper, {'key': id}, [mithril(provider.Anchor, state[attributes](id, store))])
                            : mithril(provider.Anchor, state[attributes](id, store))
                    )
        };
    }

    static component(filter_resource){
        return (item) => (next) => (store = null) => {
            const next_component = next(store);
            if(store === null || filter_resource !== store.getState().resource) return next_component;

            const { resource } = store.getState();
            return filter_resource === resource
                ? item
                : next_component;
        };
    }

    static dispatcher(store){
        return (action_creator) => (event = {}) => {
            event.id = store.id;
            event.resource = store.resource;
            event.redraw = false;
            event.result = store.dispatch(
                action_creator(store)({
                    event,
                    'state': store.getState()
                })
            );
            return event;
        };
    }

    static controller(filter_resource){
        return (provider, action_creator = null) => (next) => (store) => {
            const next_component = next(store);
            if(store === null || filter_resource !== store.getState().resource) return next_component;

            const { oninit = null } = next_component;

            return {
                ...next_component,
                'oninit': function(vnode){
                    this.provider = provider;
                    this.store = store instanceof Store
                        ? store
                        : new Store({ store, 'resource': filter_resource });

                    if(action_creator !== null){
                        this.action = action_collection(
                            action_creator,
                            Renderer.dispatcher(this.store)
                        );
                    }
                    if(oninit !== null) oninit.call(this, vnode);
                }
            };
        };
    }

    static redraw_middleware(mithril){
        return (/*redux_store*/) => (next) => (action) => {
            const result = next(action);
            if(typeof action.redraw !== 'undefined' && action.redraw) mithril.redraw();
            return result;
        };
    }
}
