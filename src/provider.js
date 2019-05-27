/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * Copyright (C) 2019 François Cadeillan <francois@azsystem.fr>
 *
 */
import { Identity, Structural } from './state';
import { Renderer, Component } from './render';
import { Functional } from './functional';

const chain_reducer = Symbol('chain_reducer');
export class Provider {
    constructor(mithril, initial_resource, initial_state = {}){
        this[chain_reducer] = (state) => state;
        const propagate_reducer = Structural.propagate(
            (state, action) => this[chain_reducer](state, action)
        );
        this.reducer = (
            state = Identity.module_identity(initial_resource, initial_state), action
        ) => propagate_reducer(state, action);

        this.component = (/*query_store, viewset = null*/) => ({ 'view': () => mithril('#') });

        this.Anchor = Component.anchor(mithril);
        this.AnchorGroup = Component.anchor_group(mithril);
    }

    connect_component(resource, component_resource, ...action_creators){
        this.component = Functional.compose(
            Renderer.component(resource)(component_resource),
            Renderer.controller(this, action_creators)
        )(this.component);
    }

    connect_component_transducers(...component_transducers){
        this.component = Functional.compose(
            ...component_transducers
        )(this.component);
    }

    connect_state_transducers(...state_transducers){
        this[chain_reducer] = Functional.pipe(
            ...state_transducers
        )(this[chain_reducer]);
    }
}

export default Provider;
