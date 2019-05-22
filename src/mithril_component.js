/*
This Source Code Form is subject to the terms of the Mozilla Public
License, v. 2.0. If a copy of the MPL was not distributed with this
file, You can obtain one at http://mozilla.org/MPL/2.0/.

Copyright (C) 2019 François Cadeillan <francois@azsystem.fr>
*/

import m from 'mithril';
import { Spread, Action } from './state/action';

const ALLOWED_LIFECYCLE = ['oncreate', 'onupdate', 'onbeforeremove', 'onremove'];

export const component_creator = (registry, { view = null, controller = null, lifecycle = {}}) =>
    (container) =>
        (
            (expose) => ({
                'view': view !== null
                    ? view
                    : () => m('#'),
                'oninit': function(initial_vnode){
                    if(controller !== null) controller.call(this, initial_vnode, expose);
                    return Object.assign(this, expose, {
                        'store_state': container.store.getState()
                    });
                },
                'onupdate': function(vnode){
                    this.store_state = container.store.getState();
                    if(
                        typeof lifecycle.onupdate !== 'undefined'
                        && lifecycle.onupdate !== null
                    ) lifecycle.onupdate(vnode, expose);
                },
                'onbeforeupdate': function(vnode, old_vnode){
                    const now_state = container.store.getState();
                    const choice = old_vnode.state.store_state !== now_state
                        || (
                            typeof lifecycle.onbeforeupdate !== 'undefined'
                                && lifecycle.onbeforeactivate !== null
                                && lifecycle.onbeforeupdate(vnode, old_vnode, expose)
                        );
                    this.store_state = now_state;
                    return choice;
                },
                ...Object.keys(lifecycle)
                    .filter((key) => ALLOWED_LIFECYCLE.includes(key))
                    .reduce((comp, key) => (comp[key] = lifecycle[key], lifecycle), {})
            })
        )({
            registry,
            container,
            'spread': Spread,
            'action': Action
        })
;


export const Anchor = {
    'view': (vnode) => {
        const { id, registry } = vnode.attrs;
        const container = registry.get(id);

        if(container === null) return m('#');

        const attributes = Object.assign({}, vnode.attrs);
        return m(container.component, attributes);
    }
};

export const AnchorGroup = {
    'view': (vnode) => {
        const { wrapper = null, filterFn = () => true, id, registry } = vnode.attrs;
        const container = registry.get(id);

        if(!container) return m('#');

        const state = container.store.getState();

        if(typeof state.containers === 'undefined') return m('#');

        return state.containers
            .filter(({ 'id': sub_id }) => filterFn(registry.get(sub_id)))
            .map(({ 'id': sub_id }) => {
                    let attributes = Object.assign({}, vnode.attrs);
                    attributes.id = sub_id;
                    attributes.key = sub_id;
                    attributes.registry = registry;
                    return wrapper !== null
                        ? m(wrapper, {'key': sub_id}, [m(Anchor, attributes)])
                        : m(Anchor, attributes);
                }
            );
    }
};

export const NamedAnchorGroup = {
    'view': ({ 'attrs': { name_key, name, ...attrs } }) => {
        let attributes = Object.assign(
            {
                'filterFn': (container) => {
                    let consumer_state = container.consumer_state();
                    return !(typeof consumer_state[name_key] === 'undefined'
                        || typeof name_key === 'undefined'
                        || typeof name === 'undefined'
                        || consumer_state[name_key] !== name);
                }
            },
            attrs
        );
        return m(AnchorGroup, attributes);
    }
};
