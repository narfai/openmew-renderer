
/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * Copyright (C) 2019 François Cadeillan <francois@azsystem.fr>
 *
 */

import describe from 'ava';
import { Scope, Identity, Functional } from '../../../dist/openmew-renderer';
import stub from './stub';

const action_reducer_identity = (action) => action;

describe('Global scope allow to reduce and propagate any action thus preserve action data', (t) => {
    const global_scope_action = Scope.global(/*store*/)(action_reducer_identity)({
        ...stub.action.custom,
        'reduce': () => false,
        'propagate': () => false
    });
    t.deepEqual(global_scope_action, stub.action.custom);

    t.true(Identity.allow_reduction({/*any state*/}, global_scope_action));
    t.true(Identity.allow_propagation({/*any state*/}, global_scope_action));
});

describe('Self scope allow to reduce and propagate self store', (t) => {
    const self_scope_action = Scope.self(stub.store.parent)(action_reducer_identity)(stub.action.custom);

    const self_state = stub.store.parent.getState();
    t.true(Identity.allow_reduction(self_state, self_scope_action));
    t.true(Identity.allow_propagation(self_state, self_scope_action));
});

describe('Chain scope allow to propagate down the tree from parent to child', (t) => {
    const chain_scope_action = Scope.self(stub.store.child)(action_reducer_identity)(stub.action.custom);

    const parent_state = stub.store.child.getState();
    t.true(Identity.allow_propagation(parent_state, chain_scope_action));

    const child_state = stub.store.child.getState();
    t.true(Identity.allow_propagation(child_state, chain_scope_action));
});

describe('None scope inhibit any reduction or propagation over an action', (t) => {
    const inhibited_scope_action = Functional.pipe(
        Scope.none,
        Scope.global
    )(/*store*/)(action_reducer_identity)(stub.action.custom);

    t.false(Identity.allow_reduction({/*any state*/}, inhibited_scope_action));
    t.false(Identity.allow_propagation({/*any state*/}, inhibited_scope_action));
});

describe('Parent scope allow to reduce and propagate parent state from child store', (t) => {
    const parent_scope_action = Scope.parent(stub.store.child)(action_reducer_identity)(stub.action.custom);

    const parent_state = stub.store.parent.getState();
    t.true(Identity.allow_reduction(parent_state, parent_scope_action));
    t.true(Identity.allow_propagation(parent_state, parent_scope_action));

    const child_state = stub.store.child.getState();
    t.false(Identity.allow_reduction(child_state, parent_scope_action));
    t.true(Identity.allow_propagation(child_state, parent_scope_action)); //@TODO should not propagate to child
});

describe('Resource scope allow to reduce only specified resource', (t) => {
    const resource_scope_action = Scope.resource(stub.store.child.resource)({/*any store*/})(action_reducer_identity)(stub.action.custom);

    const child_state = stub.store.child.getState();
    t.true(Identity.allow_reduction(child_state, resource_scope_action));

    const parent_state = stub.store.parent.getState();
    t.false(Identity.allow_reduction(parent_state, resource_scope_action));
});

describe('Self resource scope allow parent to reduce parent so do the child with himself', (t) => {
    const self_scope_action = (store) => Scope.self_resource(store)(action_reducer_identity)(stub.action.custom);

    const child_state = stub.store.child.getState();
    t.true(Identity.allow_reduction(child_state, self_scope_action(stub.store.child)));

    const parent_state = stub.store.parent.getState();
    t.true(Identity.allow_reduction(parent_state, self_scope_action(stub.store.parent)));
});

describe('Root scope allow to reduce and propagate over root', (t) => {
    const root_scope_action = (store) => Scope.root(store)(action_reducer_identity)(stub.action.custom);

    t.false(Identity.allow_reduction({/*any state*/}, root_scope_action(stub.store.child)));
    t.false(Identity.allow_propagation({/*any state*/}, root_scope_action(stub.store.child)));

    t.true(Identity.allow_reduction({/*any state*/}, root_scope_action(stub.store.parent)));
    t.true(Identity.allow_reduction({/*any state*/}, root_scope_action(stub.store.parent)));
});
