/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * Copyright (C) 2019 François Cadeillan <francois@azsystem.fr>
 *
 */

import { Identity } from './identity';
import { APPEND_MODULE, PREPREND_MODULE, DETACH_MODULE } from '../action/creator';

export class Structural {}
//@NOTICE Propagate endorse both roles of recursive Enumerator and Accumulator
Structural.propagate = Identity.state_reducer(function propagate_reducer(next, state = null, action = {}){
    //@NOTICE[1] decisions are also made with old state here ...
    const propagate_ids = state.children.filter(
        (subState) => Identity.allow_propagation(subState, action) === true
    ).map(({ id }) => id);

    //@NOTICE[1]... And here ...
    const allow = Identity.allow_reduction(state, action);

    if(allow === false && propagate_ids.length === 0) return state;
    const next_state = (
        allow === true
            ? next(state, action)
            : state
    );

    return {
        ...next_state,
        'children': next_state.children
            .map((subState) =>
                //@NOTICE[1]... So a newly created child cannot be reduced with same action
                // ( which is good because it avoid recursion errors )
                propagate_ids.includes(subState.id)
                    ? propagate_reducer(next, subState, action)
                    : subState //@NOTICE[1]... but its state still bubble up the tree
            )
    };
});

const attach = (type, children_reducer) => Identity.state_reducer(
    (next, state = null, action = {}) =>
        ((next_state) => (
                action.type === type
                    ? {
                        ...next_state,
                        'children': children_reducer(next_state, action)
                    }
                    : next_state
            )
        )(next(state, action))
);

Structural.prepend = attach(
    PREPREND_MODULE,
    (state, action) => [
        Identity.module(action.resource, action.initial_state),
        ...state.children
    ]
);

Structural.append = attach(
    APPEND_MODULE,
    (state, action) => [
        ...state.children,
        Identity.module(action.resource, action.initial_state)
    ]
);

Structural.replace = (type, children_reducer) => attach(
    type,
    (state, action) => children_reducer(state, action)
);

Structural.detach = Identity.state_reducer((next, state = null, action = {}) =>
    ((next_state) => {
            return (
                action.type === DETACH_MODULE
                    ? {
                        ...next_state,
                        'children': next_state.children.filter(({ id }) => id !== action.id)
                    }
                    : next_state
            );
        }
    )(next(state, action))
);
