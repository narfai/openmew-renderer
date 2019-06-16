
/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * Copyright (C) 2019 François Cadeillan <francois@azsystem.fr>
 *
 */

import { Store } from '../state';
import { Functional } from '../functional';
import { ActionCreator } from '../action';

import { DEFAULT_VIEWSET, resource_identity } from './identity';
import { Component } from './component';

export class Renderer {
    static dispatcher(store){
        return (action_creator) => (event = {}) => {
            event.id = store.id;
            event.resource = store.resource;
            event.redraw = false; //@NOTICE prevent mithril from redrawing on view events
            // redraw is handled by m.redraw() with a middleware instead
            //https://mithril.js.org/autoredraw.html

            event.result = store.dispatch(
                action_creator(store)({
                    event,
                    'state': store.getState()
                })
            );
            return event;
        };
    }


    /** Resource-specific **/

    static allow_resource_reduction(filter_resource, selected_viewset, state_resource){
        const resource_object = resource_identity.from_string(filter_resource);
        return resource_object.name === state_resource
            && (
                resource_identity.allow(resource_object, selected_viewset)
                || resource_object.viewset === DEFAULT_VIEWSET
            );
    }

    static component(filter_resource, item){
        return (next) => ({ store = null, viewset = null }) => {
            return (
                store !== null
                && Renderer.allow_resource_reduction(
                    filter_resource,
                    viewset,
                    store.getState().resource
                )
            )
                ? item
                : next({ store, viewset });
        };
    }

    static actionable(filter_resource, ...action_creators){
        return (next) => ({ store = null, viewset = null }) => {
            const next_component = next({ store, viewset });

            if(
                store === null
                || ! Renderer.allow_resource_reduction(
                    filter_resource,
                    viewset,
                    store.getState().resource
                )
            ) return next_component;

            const { oninit = null } = next_component;

            return {
                ...next_component,
                'oninit': function(vnode){
                    if(action_creators.length !== 0){

                        this.action = ActionCreator.action_collection(
                            ActionCreator.combine_creators(...action_creators),
                            Renderer.dispatcher(this.store)
                        );
                    }

                    if(oninit !== null) oninit.call(this, vnode);
                }
            };
        };
    }


    /** Generic **/

    static stateful_recursible_subscriber(provider, recursible){
        return (next) => Functional.pipe(
            Renderer.subscriber(provider),
            Renderer.stateful,
            Renderer.recursible(provider, recursible)
        )(next);
    }

    static subscriber(provider){
        return (next) => ({ store = null, viewset = null }) => {
            const next_component = next({ store, viewset });
            const { oninit = null } = next_component;

            return {
                ...next_component,
                'oninit': function(vnode){
                    this.provider = provider;
                    if(oninit !== null) oninit.call(this, vnode);
                }
            };
        };
    }

    static stateful(next){
        return ({ store = null, viewset = null }) => {
            const next_component = next({ store, viewset });
            if(store === null) return next_component;

            const { oninit = null } = next_component;

            return {
                ...next_component,
                'oninit': function(vnode){
                    this.store = store instanceof Store
                        ? store
                        : new Store({ store });

                    this.viewset = viewset;
                    if(oninit !== null) oninit.call(this, vnode);
                }
            };
        };
    }

    static recursible(provider, { Anchor, AnchorGroup }){
        return (next) => ({ store, viewset = null }) => {
            const next_component = next({ store, viewset });
            const { oninit = null } = next_component;

            return {
                ...next_component,
                'oninit': function(vnode){
                    if(oninit !== null) oninit.call(this, vnode);
                    this.Anchor = Renderer.stateful_recursible_subscriber(provider, { Anchor, AnchorGroup })(
                        () => Anchor
                    )({ store, viewset });

                    this.AnchorGroup = Renderer.stateful_recursible_subscriber(provider, { Anchor, AnchorGroup })(
                        () => AnchorGroup
                    )({ store, viewset });
                }
            };
        };
    }


    /** Optional **/

    static debug_redraw(component_transducer){
        return (next) => ({ store, viewset = null }) => {
            const next_component = component_transducer(next)({ store, viewset });
            const { onbeforeupdate = null } = next_component;

            return {
                ...next_component,
                'onbeforeupdate': function(vnode, old_vnode){
                    console.groupCollapsed('DEBUG REDRAW CHOICE ' + this.store.id);
                    const choice = (onbeforeupdate !== null)
                        ? onbeforeupdate.call(this, vnode, old_vnode)
                        : true;

                    console.debug('redraw evaluation ?', choice);
                    console.debug('old vnode', old_vnode);
                    console.debug('new vnode', vnode);
                    console.groupEnd();
                    return choice;
                }
            };
        };
    }

    static skip_redraw(next){
        return ({ store, viewset = null }) => {
            const next_component = next({ store, viewset });
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

    static state_aware(next){
        return ({ store, viewset }) => {
            const next_component = next({ store, viewset });
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
}
