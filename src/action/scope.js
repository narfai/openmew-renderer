/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * Copyright (C) 2019 François Cadeillan <francois@azsystem.fr>
 *
 */

import { Allow } from './allow';
import { ActionTransducer } from './transducer';
import { Functional } from '../functional';

export class Scope {
    static create(...transducers){
        return (store) => Functional.pipe(
            ...transducers.map(
                (extern_transducer) =>
                    extern_transducer(store)({ Allow, ActionTransducer })
            )
        );
    }

    static self(store){
        return Functional.pipe(
            ActionTransducer.propagate(Allow.chain(store)),
            ActionTransducer.reduce(Allow.self(store))
        );
    }

    static chain(store){
        return Functional.pipe(
            ActionTransducer.propagate(Allow.chain(store))
            //reduce all
        );
    }

    static parent(store){
        return Functional.pipe(
            ActionTransducer.propagate(Allow.chain(store)),
            ActionTransducer.reduce(Allow.parent(store))
        );
    }

    static resource(resource){
        return () => Functional.pipe(
            //propagate all
            ActionTransducer.reduce(Allow.resource(resource))
        );
    }

    static self_resource(store){
        return Functional.pipe(
            //propagate all
            ActionTransducer.reduce(Allow.self_resource(store))
        );
    }

    static global(/*store*/){
        return (next) => (action = {}) => {
            if(typeof action.propagate !== 'undefined') delete action.propagate;
            if(typeof action.reduce !== 'undefined') delete action.reduce;
            return next(action);
        };
    }
}
