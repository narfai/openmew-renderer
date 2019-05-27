/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * Copyright (C) 2019 François Cadeillan <francois@azsystem.fr>
 *
 */
/* eslint-disable */

class Behavior {}

(function({ Provider, Renderer, Identity }) {
    //State behaviors
    Behavior.increment_transducer = Identity.state_reducer((next, state = null, action) => {
        //@NOTICE state is guaranteed to respect interface { id, resource, children }
        switch (action.type) {
            case 'INCREMENT':
                return {
                    //@NOTICE the difference with a regular redux reducer
                    ...next(state, action),
                    'number': state.number //@NOTICE if you want your transducer to be applyable to any module
                        ? state.number + 1 //@NOTICE you have to think about default expected values of state
                        : 1
                };
            default:
                return next(state, action);
        }
    });


    //Domain ui behaviors

    Behavior.increment_creator = (spread) => ({
        'increment': spread(
            () => ({'type': 'INCREMENT'})
        )(spread.scope.self, spread.redraw.allow) //@NOTICE by default, redraw wont be called
        ,
    });


    //Built-in behavior

    Behavior.attach_creator = (spread) => ({
        'prepend_self': spread.prepend(
            ({state, event}) => ({//@NOTICE you also can edit `event.redraw = true` for redrawing mithril way
                resource: state.resource,
                initial_state: {number: 10}
            })
        )(spread.scope.self, spread.redraw.allow)//@NOTICE action transducers can be crafted, combined or defined infinitely
        ,
        'prepend_hello': spread.prepend(//@NOTICE spread object also contains builtin action creator like attach or detach
            ({state, event}) => ({
                resource: 'Hello',
                initial_state: {number: 10}
            })
        )(spread.scope.self, spread.redraw.allow)
        ,
        'append_app': spread.append(
            ({state, event}) => ({
                resource: 'App',
                initial_state: {number: 10}
            })
        )(spread.scope.self, spread.redraw.allow)
    });

    Behavior.detach_creator = (spread) => ({
        'detach': spread.detach(
            ({state: {id}, event}) => ({id})
        )(spread.scope.parent, spread.redraw.allow)//@NOTICE parent scope : you have to ask parent to remove the child
    });

    Behavior.switch_creator = (spread) => ({
        'switch_default': spread.switch(
            () => ({ 'viewset': null }) //Default viewset
        )(spread.scope.root),
        'switch_alternate': spread.switch(
            () => ({ 'viewset': 'Alternate' })
        )(spread.scope.root),
    });

})(OpenMewRenderer);
