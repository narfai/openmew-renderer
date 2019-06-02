/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * Copyright (C) 2019 François Cadeillan <francois@azsystem.fr>
 *
 */

import describe from 'ava';
import { Structural, ActionCreator } from '../../../dist/openmew-renderer';
import stub from '../../stub';

const state_reducer_identity = (state, action) => state;

describe('Append trans-reducer actually append new child', (t) => {
    const parent_state = stub.store.parent.getState();
    const append_state = Structural.append(state_reducer_identity)(
        parent_state,
        ActionCreator.append({
            'resource': 'MockChild',
            'initial_state': {
                'marker': true
            }
        }
    ));
    t.not(append_state, parent_state);
    t.deepEqual(parent_state.children[0], append_state.children[0]);
    t.deepEqual(append_state.children[1], {
        'resource': 'MockChild',
        'marker': true,
        'children': [],
        'id': append_state.children[1].id
    });
});

describe('Prepend trans-reducer actually prepend new child', (t) => {
    const parent_state = stub.store.parent.getState();
    const prepend_state = Structural.prepend(state_reducer_identity)(
        parent_state,
        ActionCreator.prepend({
                'resource': 'MockChild',
                'initial_state': {
                    'marker': true
                }
            }
        ));
    t.not(prepend_state, parent_state);
    t.deepEqual(prepend_state.children[0], {
        'resource': 'MockChild',
        'marker': true,
        'children': [],
        'id': prepend_state.children[0].id
    });
    t.deepEqual(parent_state.children[0], prepend_state.children[1]);

});

describe('Propagate trans-reducer actually propagate an action from parent to child without mutation', (t) => {
    const parent_state = stub.store.parent.getState();
    const propagated_reducer = (state, action) => action.type === stub.action.custom.type ? { ...state, marker: true } : state;
    const propagated_state = Structural.propagate(propagated_reducer)(
        parent_state,
        stub.action.custom
    );

    t.not(parent_state, propagated_state);
    t.deepEqual(propagated_state, {
        ...parent_state,
        'children': propagated_state.children,
        'marker': true
    });

    const child_state = stub.store.child.getState();

    t.not(child_state, propagated_state.children[0]);
    t.deepEqual(propagated_state.children[0], {
        ...child_state,
        'marker': true
    });
});

describe('Propagate trans-reducer disallow child reduction thus keep child reference', (t) => {
    const parent_state = stub.store.parent.getState();
    const is_parent = (state) => state.resource === 'MockParent';
    const propagated_reducer = (state, action) => action.type === stub.action.custom.type ? { ...state, marker: true } : state;

    const propagated_state = Structural.propagate(propagated_reducer)(
        parent_state,
        {
            ...stub.action.custom,
            'reduce': is_parent,
            'propagate': is_parent
        }
    );

    t.not(parent_state, propagated_state);
    t.deepEqual(propagated_state, {
        ...parent_state,
        'children': propagated_state.children,
        'marker': true
    });

    const child_state = stub.store.child.getState();

    t.is(child_state, propagated_state.children[0]);
});
