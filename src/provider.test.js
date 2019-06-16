
/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * Copyright (C) 2019 François Cadeillan <francois@azsystem.fr>
 *
 */

/*eslint no-undefined: "off"*/

import describe from 'ava';
import { Provider, Identity } from '../dist/openmew-renderer';
import stub from './stub';
import mithril from 'mithril';

describe.beforeEach((t) => {
    function marked_state(){
        this.marker = true;
    }
    t.context = {
        'provider': new Provider(
            mithril,
            'MockParent',
            { 'marker': true },
            () => (t.context.not_found)
        ),
        'resource': { 'oninit': marked_state, 'view': () => mithril('h1', 'Stub') },
        'not_found': { 'view': () => mithril('h2', 'Resource not found') }
    };
});

describe('Can add custom values to default state', (t) => {
    const default_state = t.context.provider.reducer(undefined, {});
    t.deepEqual(default_state, {
        'id': default_state.id,
        'resource': 'MockParent',
        'children': [],
        'marker': true
    });
});

describe('Can add custom not found component', (t) => {
    t.is(
        t.context.provider.component({ 'store': stub.store.parent }).view,
        t.context.not_found.view
    );
});

describe('Can lazily register resource-indexed mithril components', (t) => {
    t.context.provider.connect_component('MockParent', t.context.resource);

    t.is(
        t.context.provider.component({ 'store': stub.store.parent }).view,
        t.context.resource.view
    );
});

describe('Can lazily update resource components', (t) => {
    t.context.provider.connect_component('MockParent', { ...t.context.resource, 'version': 1 });

    t.assert(
        t.context.provider.component({ 'store': stub.store.parent }).version ===
        1
    );

    t.context.provider.connect_component('MockParent', { ...t.context.resource, 'version': 2 });

    t.assert(
        t.context.provider.component({ 'store': stub.store.parent }).version ===
        2
    );
});

describe('Can lazily register component transducers', (t) => {
    t.context.provider.connect_component_transducers(
        (next) => (...forward) => ({
            ...next(...forward),
            'marker': true
        })
    );

    t.true(t.context.provider.component({ 'store': stub.store.parent }).marker);

    t.context.provider.connect_component('MockParent', t.context.resource);

    t.true(t.context.provider.component({ 'store': stub.store.parent }).marker);
});

describe('Can lazily register state transducers', (t) => {
    t.context.provider.connect_state_transducers(Identity.state_reducer((next, state, action) => ({
        ...next(state, action),
        'marker': true
    })));

    t.true(t.context.provider.reducer(undefined, {}).marker);
});
