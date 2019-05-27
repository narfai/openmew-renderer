/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * Copyright (C) 2019 François Cadeillan <francois@azsystem.fr>
 *
 */

import { Functional } from '../functional';
import { Scope } from './scope';
import { ActionTransducer } from './transducer';
import { ActionCreator } from './creator';

const action_creator_identity = (/*state*/) => ({/*action*/});

export function spread(action_creator = action_creator_identity){
    return (...scopes) => (store) =>
        Functional.pipe(
            ...scopes
                .filter((selected_transducer) => typeof selected_transducer === 'function')
                .map((selected_transducer) => selected_transducer(store))
        )(action_creator);
}

spread.scope = Scope;
spread.redraw = {
    allow: (/*store*/) => Functional.pipe(
        ActionTransducer.redraw(() => true)
    ),
    deny: (/*store*/) => Functional.pipe(
        ActionTransducer.redraw(() => false)
    )
};


const spreadable = (action_identity) => (action_creator) => (...scopes) =>
    spread(
        (state) => action_identity(action_creator(state))
    )(...scopes);

spread.attach = spreadable(ActionCreator.attach);
spread.detach = spreadable(ActionCreator.detach);
spread.switch = spreadable(ActionCreator.switch);

export const action_collection = (action_creator, dispatcher) => (
        (user_actions) => Object
            .keys(user_actions)
            .reduce(
                (accumulator, current) => {
                    accumulator[current] = dispatcher(user_actions[current]);
                    return accumulator;
                },
                {})
    )(action_creator(spread))
;
