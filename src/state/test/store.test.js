/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * Copyright (C) 2019 François Cadeillan <francois@azsystem.fr>
 *
 */

import describe from 'ava';
import { Store } from '../../../dist/openmew-renderer';
import stub from '../../stub';

describe.before((t) => {
    const mock_redux_store = (store, dispatch) => class {
        getState(){
            return { ...store.getState() };
        }
        dispatch(action){
            return dispatch(action);
        }
    };

    t.context.ReduxStoreMock = mock_redux_store(stub.store.parent, (action) => {
        t.is(action, stub.action.custom);
        return true;
    });
});

describe('Wrap redux store', (t) => {
    const store = new Store({ 'store': new t.context.ReduxStoreMock() });

    t.deepEqual(stub.store.parent.getState(), store.getState());
    t.true(store.dispatch(stub.action.custom));
});

describe('Give access to a subtree part and action dispatch bubbling up to root store', (t) => {
    const child_state = stub.store.child.getState();
    const { 'id': child_id } = child_state;

    const store = Store.child_store(child_id, new t.context.ReduxStoreMock());

    t.deepEqual(
        store.getState(),
        child_state
    );

    t.true(store.dispatch(stub.action.custom));
});
