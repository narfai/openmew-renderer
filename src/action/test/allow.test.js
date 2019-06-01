
/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * Copyright (C) 2019 François Cadeillan <francois@azsystem.fr>
 *
 */

import describe from 'ava';
import { Allow } from '../../../dist/openmew-renderer';
import stub from './stub';

describe('Action assertion - none assert always returns false', (t) => {
    t.false(Allow.none()());
});

describe('Action assertion - self assert match self store', (t) => {
    t.true(Allow.self(stub.store.parent)(stub.store.parent.getState()));
});

describe('Action assertion - root assert match root store', (t) => {
    t.true(Allow.root(stub.store.parent)());
});

describe('Action assertion - parent assert match parent state & store', (t) => {
    t.true(Allow.parent(stub.store.child)(stub.store.parent.getState()));
});

describe('Action assertion - chain assert parent state is in chain of child store', (t) => {
    t.true(Allow.chain(stub.store.child)(stub.store.parent.getState()));
});

describe('Action assertion - resource assert child state is MockChild', (t) => {
    t.true(Allow.resource('MockChild')(stub.store.child.getState()));
});

describe('Action assertion - self_ressource assert child state is not same resource of parent store', (t) => {
    t.false(Allow.self_resource(stub.store.parent)(stub.store.child.getState()));
});
