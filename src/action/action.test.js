/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * Copyright (C) 2019 François Cadeillan <francois@azsystem.fr>
 *
 */

// import win from 'mithril/test-utils/browserMock';
// global.window = win();
// global.document = global.window.document;

import describe from 'ava';

/** As Library consumer, i can render my application from store state real-time, recursively **/
/** As Library consumer, i can register needed resources at any time and without chronological order **/
/** As Library consumer, i can reuse and compose any render components easily **/
/** As Library consumer, i can reuse and compose any user actions easily **/
/** As Library consumer, i can reuse and compose any state reaction behaviors against actions **/
/** As Library consumer, i can define how an action is propagated recursively through the state tree **/
/** As Library consumer, i can define if an action is applied over current state while propagating **/

/** Allow **/

import { Allow } from '../../dist/openmew-renderer';

const store_mock = {
    'parent': {
        'resource': 'MockParent',
        'id': 'jw3r0qza',
        'chain': ['jw3r0qza'],
        'getState': () => ({
            'id': 'jw3r0qza',
            'resource': 'MockParent'
        })
    },
    'child': {
        'id': 'jwcloezc',
        'resource': 'MockChild',
        'chain': ['jw3r0qza', 'jwcloezc'],
        'getState': () => ({
            'id': 'jwcloezc',
            'resource': 'MockChild'
        })
    }
};

describe('Allow action - none assert always returns false', (t) => {
    t.false(Allow.none()());
});

describe('Allow action - self assert match self store', (t) => {
    t.true(Allow.self(store_mock.parent)(store_mock.parent.getState()));
});

describe('Allow action - root assert match root store', (t) => {
    t.true(Allow.root(store_mock.parent)());
});

describe('Allow action - parent assert match parent state & store', (t) => {
    t.true(Allow.parent(store_mock.child)(store_mock.parent.getState()));
});

describe('Allow action - chain assert parent state is in chain of child store', (t) => {
    t.true(Allow.chain(store_mock.child)(store_mock.parent.getState()));
});

describe('Allow action - resource assert child state is MockChild', (t) => {
    t.true(Allow.resource('MockChild')(store_mock.child.getState()));
});

describe('Allow action - self_ressource assert child state is not same resource of parent store', (t) => {
    t.false(Allow.self_resource(store_mock.parent)(store_mock.child.getState()));
});

/** ActionCreator **/

import { ActionCreator } from '../../dist/openmew-renderer';

const action_creator_mock = {
    'custom': (spread) => ({
        'test_action': spread(() => ({ 'type': 'TEST_ACTION', 'content': 'TEST CONTENT' }))(spread.scope.global)
    }),
    'structural': (spread) => ({
        'append': spread.append(() => ({ 'resource': 'MockChild' }))(spread.scope.global),
        'prepend': spread.prepend(() => ({ 'resource': 'MockChild' }))(spread.scope.global),
        'detach': spread.detach(() => ({ 'id': 'jwcloezc' }))(spread.scope.global)
    })
};

const state_dispatcher = /*(store) => */ (creator) => (/*event*/) => creator(/*store*/)(/*event*/);

const collection = ActionCreator.action_collection(
    ActionCreator.combine_creators(
        action_creator_mock.structural,
        action_creator_mock.custom
    ),
    state_dispatcher
);

describe('Create actions - Action collection got correct keys', (t) => {
    t.deepEqual(Object.keys(collection), ['append', 'prepend', 'detach', 'test_action']);
});

describe('Create actions - Append built-in generates append action', (t) => {
    t.deepEqual(collection.append(), {
        'type': ActionCreator.APPEND_MODULE,
        'resource': 'MockChild',
        'initial_state': {}
    });
});

describe('Create actions - Prepend built-in generates prepend action', (t) => {
    t.deepEqual(collection.prepend(), {
        'type': ActionCreator.PREPEND,
        'resource': 'MockChild',
        'initial_state': {}
    });
});

describe('Create actions - Detach built-in generates detach action', (t) => {
    t.deepEqual(collection.detach(), {
        'type': ActionCreator.DETACH_MODULE,
        'id': 'jwcloezc'
    });
});

describe('Create actions - Custom action generates user-defined action', (t) => {
    t.deepEqual(collection.test_action(), {
        'type': 'TEST_ACTION',
        'content': 'TEST CONTENT'
    });
});

/** Scope **/
// import { Scope } from './scope';
// import { Identity } from '../state';
//
// describe('scope', () => {
//     const transform_identity = (action) => action;
//     const mock_action = {
//         'type': 'TEST_ACTION',
//         'content': 'TEST CONTENT'
//     };
//     //TODO test global scope is the only reset, it free action restrinctions
//     describe('global', () => {
//
//         const global_scope_action = Scope.global(/*store*/)(transform_identity)({
//             ...mock_action,
//             'reduce': () => false,
//             'propagate': () => false
//         });
//
//         assert(global_scope_action).deepEquals(mock_action)('Action data is preserved');
//         assert(Identity.allow_reduction({} /*substate*/, global_scope_action)).equals(true)('Global scoped is allowed to reduce');
//         assert(Identity.allow_propagation({} /*substate*/, global_scope_action)).equals(true)('Global scoped is allowed to propagate');
//     });
//
//     describe('self', () => {
//         const store_mock = {};
//         const self_scope_action = Scope.self(store_mock)(transform_identity)(mock_action);
//         assert(() => self_scope_action)
//
//     });
//
//
//
//     //mock store, mock states, mock action
//     //check propa / not propa with each unitary scope
// });
