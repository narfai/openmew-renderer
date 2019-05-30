/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * Copyright (C) 2019 François Cadeillan <francois@azsystem.fr>
 *
 */

import describe from 'ospec';
import { Allow } from './allow';
const assert = describe;

describe('allow', () => {
    const mock = {
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

    assert(Allow.none()()).equals(false);

    assert(Allow.root(mock.parent)()).equals(true);

    assert(Allow.self(mock.parent)(mock.parent.getState())).equals(true);

    assert(Allow.chain(mock.parent)(mock.parent.getState())).equals(true);

    assert(Allow.parent(mock.child)(mock.parent.getState())).equals(true);

    assert(Allow.resource('MockChild')(mock.child.getState())).equals(true);

    assert(Allow.self_resource(mock.parent)(mock.child.getState())).equals(false);
});

import { ActionCreator } from './creator';

describe('creator', () => {
    const mock = {
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
            mock.structural,
            mock.custom
        ),
        state_dispatcher
    );

    assert(Object.keys(collection)).deepEquals(['append', 'prepend', 'detach', 'test_action']);
    assert(collection.append()).deepEquals({
        'type': ActionCreator.APPEND_MODULE,
        'resource': 'MockChild',
        'initial_state': {}
    });

    assert(collection.prepend()).deepEquals({
        'type': ActionCreator.PREPEND,
        'resource': 'MockChild',
        'initial_state': {}
    });

    assert(collection.detach()).deepEquals({
        'type': ActionCreator.DETACH_MODULE,
        'id': 'jwcloezc'
    });

    assert(collection.test_action()).deepEquals({
        'type': 'TEST_ACTION',
        'content': 'TEST CONTENT'
    });
});
