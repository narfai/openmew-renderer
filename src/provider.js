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
const component_reducer = Symbol('component_reducer');
const controller_reducer = Symbol('controller_reducer');
const recursible_component = Symbol('recursible_component');

export class Provider {
    constructor(mithril, initial_resource, default_state = {}, not_found_creator = null){
        this[recursible_component] = {
            'Anchor': Component.anchor(mithril),
            'AnchorGroup': Component.anchor_group(mithril)
        };

        // State

        this[chain_reducer] = (state) => state;
        const propagate_reducer = Structural.propagate(
            (state, action) => this[chain_reducer](state, action)
        );
        this.reducer = (
            state = Identity.module(initial_resource, default_state),
            action
        ) => propagate_reducer(state, action);


        // Stateful components

        this[component_reducer] = (forward) => (
            typeof not_found_creator === 'function'
                && not_found_creator(forward)
        ) || Component.not_found(mithril);

        this[controller_reducer] = (...forward) => this[component_reducer](...forward);

        const create_component = Functional.pipe(
            Renderer.stateful_recursible_subscriber(this, this[recursible_component]),
        )(({ store, viewset }) => this[controller_reducer]({ store, viewset }));

        this.component = (...forward) => create_component(...forward);
    }

    connect_component(resource, component_resource, ...action_creators){
        this[component_reducer] = Functional.compose(
            Renderer.component(resource, component_resource),
            Renderer.actionable(resource, ...action_creators),
        )(this[component_reducer]);
    }

    connect_component_transducers(...component_transducers){
        this[controller_reducer] = Functional.pipe(
            ...component_transducers
        )(this[controller_reducer]);
    }

    connect_state_transducers(...state_transducers){
        this[chain_reducer] = Functional.pipe(
            ...state_transducers
        )(this[chain_reducer]);
    }
}

export default Provider;
