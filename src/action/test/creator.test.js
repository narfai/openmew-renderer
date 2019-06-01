
/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * Copyright (C) 2019 François Cadeillan <francois@azsystem.fr>
 *
 */

import describe from 'ava';
import { ActionCreator } from '../../../dist/openmew-renderer';
import stub from './stub';

describe.before((t) => {
    const state_dispatcher = /*(store) => */ (creator) => (/*event*/) => creator(/*store*/)(/*event*/);

    t.context.collection = ActionCreator.action_collection(
        ActionCreator.combine_creators(
            stub.action_creator.structural,
            stub.action_creator.custom
        ),
        state_dispatcher
    );
});

describe('Action creation - Action collection got user-defined keys', (t) => {
    t.deepEqual(Object.keys(t.context.collection), ['append', 'prepend', 'detach', 'test_action']);
});

describe('Action creation - Append built-in generates append action', (t) => {
    t.deepEqual(t.context.collection.append(), {
        'type': ActionCreator.APPEND_MODULE,
        'resource': 'MockChild',
        'initial_state': {}
    });
});

describe('Action creation - Prepend built-in generates prepend action', (t) => {
    t.deepEqual(t.context.collection.prepend(), {
        'type': ActionCreator.PREPEND,
        'resource': 'MockChild',
        'initial_state': {}
    });
});

describe('Action creation - Detach built-in generates detach action', (t) => {
    t.deepEqual(t.context.collection.detach(), {
        'type': ActionCreator.DETACH_MODULE,
        'id': 'jwcloezc'
    });
});

describe('Action creation - Custom action generates user-defined action', (t) => {
    t.deepEqual(t.context.collection.test_action(), {
        'type': 'TEST_ACTION',
        'content': 'TEST CONTENT'
    });
});
