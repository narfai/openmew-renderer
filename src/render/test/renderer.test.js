
/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * Copyright (C) 2019 François Cadeillan <francois@azsystem.fr>
 *
 */

import describe from 'ava';
import { Renderer, Functional, Provider, Component } from '../../../dist/openmew-renderer';
import stub from '../../stub';
import mithril from 'mithril';

describe.before((t) => {
    function marked_state(){
        this.marker = true;
    }
    t.context = {
        'Anchor': Component.anchor(mithril),
        'AnchorGroup': Component.anchor_group(mithril),
        'provider': new Provider(mithril, 'MockParent', stub.store.parent.getState()),
        'resource': { 'oninit': marked_state, 'view': () => mithril('h1', 'Stub') },
        'not_found': { 'view': () => mithril('h2', 'Resource not found') },
        'alternate': { 'oninit': marked_state, 'view': () => mithril('h1', 'Alternate stub') }
    };
});

describe('Component transducer - ability to register components blueprints resources', (t) => {
    let blueprint_registry = Renderer.component('MockParent', t.context.resource)(() => t.context.not_found);

    t.is(t.context.resource, blueprint_registry({ 'store': stub.store.parent }));
    t.is(t.context.not_found, blueprint_registry({ 'store': stub.store.child }));
});

describe('Component transducer - ability to register components blueprints alternate resources', (t) => {
    let blueprint_registry = Functional.compose(
        Renderer.component('MockParent', t.context.resource),
        Renderer.component({ 'name': 'MockParent', 'viewset': 'Alternate' }, t.context.alternate)
    )(() => t.context.not_found);

    t.is(t.context.resource, blueprint_registry({ 'store': stub.store.parent }));
    t.is(t.context.alternate, blueprint_registry({ 'store': stub.store.parent, 'viewset': 'Alternate' }));
    t.is(t.context.not_found, blueprint_registry({ 'store': stub.store.child, 'viewset': 'Alternate' }));
});

describe('Component transducer - unavailable alternative resource fallback to default', (t) => {
    let blueprint_registry = Renderer.component('MockParent', t.context.resource)(() => t.context.not_found);

    t.is(t.context.resource, blueprint_registry({ 'store': stub.store.parent }));
    t.is(t.context.resource, blueprint_registry({ 'store': stub.store.parent, 'viewset': 'Alternate' }));
    t.is(t.context.not_found, blueprint_registry({ 'store': stub.store.child, 'viewset': 'Alternate' }));
});

describe('Component transducer - unavailable default resource fallback to not-found component', (t) => {
    let blueprint_registry = Renderer.component({ 'name': 'MockParent', 'viewset': 'Alternate' }, t.context.resource)(() => t.context.not_found);

    t.is(t.context.not_found, blueprint_registry({ 'store': stub.store.parent }));
    t.is(t.context.resource, blueprint_registry({ 'store': stub.store.parent, 'viewset': 'Alternate' }));
    t.is(t.context.not_found, blueprint_registry({ 'store': stub.store.child, 'viewset': 'Alternate' }));
});

describe('Actionable - ability to register action creators', (t) => {
    let actionable_resource = Renderer.actionable('MockParent', stub.action_creator.structural)(
        () => t.context.resource
    )({
        'store': stub.store.parent
    });

    t.not(actionable_resource, t.context.resource);

    const component_state = new actionable_resource.oninit();
    t.true(component_state.marker);
    t.deepEqual(Object.keys(component_state.action), [ 'append', 'prepend', 'detach' ]);
});

describe('Subscriber transducer - ability to query components blueprints & chained reducer', (t) => {
    let subscribed_resource = Renderer.subscriber(t.context.provider)(
        () => t.context.resource
    )({
        'store': stub.store.parent
    });

    t.not(subscribed_resource, t.context.resource);

    const component_state = new subscribed_resource.oninit();
    t.true(component_state.marker);
    t.is(component_state.provider, t.context.provider);
});

describe('Stateful transducer - ability to access to local component store instance & viewset', (t) => {
    let stateful_resource = Renderer.stateful(
        () => t.context.resource
    )({
        'store': stub.store.parent
    });


    t.not(stateful_resource, t.context.resource);

    const component_state = new stateful_resource.oninit();
    t.true(component_state.marker);
    t.deepEqual(component_state.store.getState(), stub.store.parent.getState());
});

describe('State aware transducer - access to an up-to-date store state', (t) => {
    let stateful_resource = Renderer.stateful(
        () => t.context.resource
    )({
        'store': stub.store.parent
    });


    t.not(stateful_resource, t.context.resource);

    const component_state = new stateful_resource.oninit();
    t.true(component_state.marker);
    t.is(component_state.store.getState(), stub.store.parent.getState());
});

describe('Recursible transducer - ability to render any other resource within', (t) => {
    let recursible_resource = Renderer.recursible(t.context.provider, {
        'Anchor': t.context.Anchor,
        'AnchorGroup': t.context.AnchorGroup
    })(
        () => t.context.resource
    )({
        'store': stub.store.parent
    });

    t.not(recursible_resource, t.context.resource);

    const component_state = new recursible_resource.oninit();
    t.true(component_state.marker);
    t.is(component_state.Anchor.view, t.context.Anchor.view);
    t.is(component_state.AnchorGroup.view, t.context.AnchorGroup.view);

    const anchor_state = new component_state.Anchor.oninit({ 'attrs': { 'id': stub.store.child.id } }); //TODO broke test cause store state doesnt seem to have an id
    t.is(anchor_state.provider, t.context.provider);
    t.is(anchor_state.store.getState(), stub.store.parent.getState());
    t.is(anchor_state.Anchor.view, t.context.Anchor.view);
    t.is(anchor_state.AnchorGroup.view, t.context.AnchorGroup.view);
});

