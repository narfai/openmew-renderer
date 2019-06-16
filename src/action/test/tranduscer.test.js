/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * Copyright (C) 2019 François Cadeillan <francois@azsystem.fr>
 *
 */

import describe from 'ava';
import { ActionTransducer, Identity, Functional } from '../../../dist/openmew-renderer';
import stub from '../../stub';

const action_reducer_identity = (action) => action;

describe('Reduce action transducer allow action to be reduced thus preserve custom data without mutation', (t) => {
    const allowed_to_reduce = ActionTransducer.reduce(() => true)(action_reducer_identity)(stub.action.custom);

    t.true(Identity.allow_reduction({/*any state*/}, allowed_to_reduce));
    t.not(allowed_to_reduce, stub.action.custom);
    t.deepEqual(allowed_to_reduce, {
        ...stub.action.custom,
        'reduce': allowed_to_reduce.reduce
    });
});

describe('Propagate action transducer allow action to be propagated thus preserve custom data without mutation', (t) => {
    const allowed_to_propagate = ActionTransducer.propagate(() => true)(action_reducer_identity)(stub.action.custom);

    t.true(Identity.allow_propagation({/*any state*/}, allowed_to_propagate));
    t.not(allowed_to_propagate, stub.action.custom);
    t.deepEqual(allowed_to_propagate, {
        ...stub.action.custom,
        'propagate': allowed_to_propagate.propagate
    });
});

describe('Redraw action transducer allow action to trigger redraw thus preserve custom data without mutation', (t) => {
    const allowed_to_redraw = ActionTransducer.redraw(() => true)(action_reducer_identity)(stub.action.custom);

    t.not(allowed_to_redraw, stub.action.custom);
    t.deepEqual(allowed_to_redraw, {
        ...stub.action.custom,
        'redraw': true
    });
});

describe('Redraw, reduce & propagate action transducers are composable thus preserve custom data without mutation', (t) => {
    const allowed_to_propagate_reduce_redraw = Functional.pipe(
        ActionTransducer.propagate(() => true),
        ActionTransducer.reduce(() => true),
        ActionTransducer.redraw(() => true),
    )(action_reducer_identity)(stub.action.custom);

    t.not(allowed_to_propagate_reduce_redraw, stub.action.custom);
    t.true(Identity.allow_propagation({/*any state*/}, allowed_to_propagate_reduce_redraw));
    t.true(Identity.allow_reduction({/*any state*/}, allowed_to_propagate_reduce_redraw));
    t.deepEqual(allowed_to_propagate_reduce_redraw, {
        ...stub.action.custom,
        'propagate': allowed_to_propagate_reduce_redraw.propagate,
        'reduce': allowed_to_propagate_reduce_redraw.reduce,
        'redraw': true
    });
});
