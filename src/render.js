/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * Copyright (C) 2019 François Cadeillan <francois@azsystem.fr>
 *
 */

import { Store } from './state';
import { action_collection, combine_creators } from './action/index';

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

    static component(filter_resource){
        return (item) => (next) => (store = null) =>
            (store !== null && filter_resource === store.getState().resource)
                ? item
                : next(store);
    }

    static controller(filter_resource){
        return (provider, action_creators = []) => (next) => (store) => {
            const next_component = next(store);
            if(store === null || filter_resource !== store.getState().resource) return next_component;

            const { oninit = null } = next_component;

            return {
                ...next_component,
                'oninit': function(vnode){
                    this.provider = provider;
                    this.store = store instanceof Store
                        ? store
                        : new Store({ store });

                    if(action_creators.length !== 0){
                        this.action = action_collection(
                            combine_creators(action_creators),
                            Renderer.dispatcher(this.store)
                        );
                    }

                    if(oninit !== null) oninit.call(this, vnode);
                }
            };
        };
    }

    static debug_redraw_choice(component_transducer){
        return (next) => (store) => {
            const next_component = component_transducer(next)(store);

            const { onbeforeupdate = null } = next_component;

            return {
                ...next_component,
                'onbeforeupdate': function(vnode, old_vnode){
                    console.groupCollapsed('DEBUG REDRAW CHOICE ' + this.store.id);
                    const choice = (onbeforeupdate !== null)
                        ? onbeforeupdate.call(this, vnode, old_vnode)
                        : true;

                    console.log('redraw evaluation ?', choice);
                    console.log('old vnode', old_vnode);
                    console.log('new vnode', vnode);
                    console.groupEnd();
                    return choice;
                }
            };
        };
    }

    static skip_redraw_component(next){
        return (store) => {
            const next_component = next(store);

            const { onbeforeupdate = null } = next_component;

            return {
                ...next_component,
                'onbeforeupdate': function(vnode, old_vnode){
                    if(typeof old_vnode.state.store_state === 'undefined'){
                        throw new Error('Did you forget to pipe state_aware_component transducer ? ');
                    }
                    return old_vnode.state.store_state !== this.store.getState()
                            || (
                                (onbeforeupdate !== null)
                                    && onbeforeupdate.call(this, vnode, old_vnode)
                            )
                    ;
                }
            };
        };
    }

    static state_aware_component(next){
        return (store) => {
            const next_component = next(store);

            const {
                onbeforeupdate = null,
                oninit = null
            } = next_component;

            return {
                ...next_component,
                'oninit': function(vnode){
                    if(oninit !== null) oninit.call(this, vnode);
                    if(typeof this.store !== 'undefined'){
                        this.store_state = this.store.getState();
                    }
                },
                'onbeforeupdate': function(vnode, old_vnode){
                    const choice = (onbeforeupdate !== null)
                        ? onbeforeupdate.call(this, vnode, old_vnode)
                        : true;

                    this.store_state = this.store.getState();
                    return choice;
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
