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

export const APPEND_MODULE = 'APPEND_MODULE';
export const PREPREND_MODULE = 'PREPREND_MODULE';
export const DETACH_MODULE = 'DETACH_MODULE';
export const SWITCH_VIEWSET = 'SWITCH_VIEWSET';


const action_creator_identity = (/*state*/) => ({/*action*/});

function spread(action_creator = action_creator_identity){
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


export class ActionCreator {
    static append({ resource, initial_state = {} }){
        return {
            'type': APPEND_MODULE,
            resource,
            initial_state
        };
    }

    static prepend({ resource, initial_state = {} }){
        return {
            'type': PREPREND_MODULE,
            resource,
            initial_state
        };
    }

    static detach({ id }){
        return {
            'type': DETACH_MODULE,
            id
        };
    }

    static switch(arg = { viewset: null, select: null }){
        return {
            'type': SWITCH_VIEWSET,
            'viewset': arg.viewset || null,
            'select': arg.select || null
        };
    }

    static combine_creators(...action_creators) {
        return (lazy_spread) => action_creators.reduce(
            (acc, cur) => ({...acc, ...cur(lazy_spread)}),
            {/*action_collection*/}
        );
    }

    static action_collection(action_creator, dispatcher) {
        return (
            (user_actions) => Object
                .keys(user_actions)
                .reduce(
                    (accumulator, current) => {
                        accumulator[current] = dispatcher(user_actions[current]);
                        return accumulator;
                    },
                {})
        )(action_creator(spread));
    }

    static spreadable(action_identity) {
        return (action_creator) => (...scopes) =>
            spread(
                (state) => action_identity(action_creator(state))
            )(...scopes)
        ;
    }
}

spread.append = ActionCreator.spreadable(ActionCreator.append);
spread.prepend = ActionCreator.spreadable(ActionCreator.prepend);
spread.detach = ActionCreator.spreadable(ActionCreator.detach);
spread.switch = ActionCreator.spreadable(ActionCreator.switch);
