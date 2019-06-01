
/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * Copyright (C) 2019 François Cadeillan <francois@azsystem.fr>
 *
 */

import describe from 'ava';
import { Scope } from '../../../dist/openmew-renderer';
import { Identity } from '../../../dist/openmew-renderer';
import stub from './stub';

const transform_identity = (action) => action;

describe('Scope - Global scope allow to reduce and propagate any action thus preserve action data', (t) => {
    const global_scope_action = Scope.global(/*store*/)(transform_identity)({
        ...stub.action.custom,
        'reduce': () => false,
        'propagate': () => false
    });
    t.true(Identity.allow_reduction({} /*substate*/, global_scope_action));
    t.true(Identity.allow_propagation({} /*substate*/, global_scope_action));
    t.deepEqual(global_scope_action, stub.action.custom);

});
//none, chain, parent, resource, self_resource, root
// describe('Scope - Self scope allow to reduce and propagate self store', (t) => {
//     const self_scope_action = Scope.self(/*store*/)(transform_identity)({
//         ...mock_action,
//         'reduce': () => false,
//         'propagate': () => false
//     });
// });
// describe('Scope - Self scope allow to reduce and propagate self store', (t) => {
// });
