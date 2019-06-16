/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * Copyright (C) 2019 François Cadeillan <francois@azsystem.fr>
 *
 */

import describe from 'ava';
import { Identity } from '../../../dist/openmew-renderer';
import stub from '../../stub';

const state_reducer_identity = (state, action) => state;

describe('State trans-reducer identity', (t) => {
    const custom_transducer = Identity.state_reducer((next, state, action) => ({
        ...next(state, action),
        'marker': action.marker
    }));
    const child_state = stub.store.child.getState();
    const reducer_state = custom_transducer(state_reducer_identity)(child_state, {
        'marker': true
    });

    t.deepEqual(reducer_state, {
        ...child_state,
        'marker': true
    });
});

describe('State module has expected fields', (t) => {
    const module = Identity.module('MockChild', { 'marker': true });

    t.false(typeof module.id === 'undefined');
    t.false(module.id.length === 0);
    t.deepEqual(module, {
        'resource': 'MockChild',
        'marker': true,
        'children': [],
        'id': module.id
    });
});

describe('Allow reduction if no scope constraint', (t) =>
    t.true(Identity.allow_reduction({/*any state*/}, stub.action.custom))
);

describe('Disallow reduction on none scope constraint', (t) =>
    t.false(Identity.allow_reduction({/*any state*/}, {
        ...stub.action.custom,
        'reduce': () => false
    }))
);

describe('Allow propagation if no scope constraint', (t) =>
    t.true(Identity.allow_propagation({/*any state*/}, stub.action.custom))
);

describe('Disallow propagation on none scope constraint', (t) =>
    t.false(Identity.allow_propagation({/*any state*/}, {
        ...stub.action.custom,
        'propagate': () => false
    }))
);
