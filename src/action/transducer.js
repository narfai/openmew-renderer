/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * Copyright (C) 2019 François Cadeillan <francois@azsystem.fr>
 *
 */

export class ActionTransducer {
    static propagate(allow_propagate){
        return (next) => (action) => (
            (next_action) => ({
                ...next_action,
                'propagate':
                    (state) => typeof next_action.propagate === 'undefined'
                        ? allow_propagate(state, action)
                        : next_action.propagate(state, action) || allow_propagate(state, action)
            })
        )(next(action));
    }

    static reduce(allow_reduce){
        return (next) => (action) => (
            (next_action) => ({
                ...next_action,
                'reduce':
                    (state) => typeof next_action.reduce === 'undefined'
                        ? allow_reduce(state, action)
                        : next_action.reduce(state, action) || allow_reduce(state, action)
            })
        )(next(action));
    }

    static redraw(allow_redraw){
        return (next) => (action) => (
            (next_action) => ({
                ...next_action,
                'redraw': allow_redraw(action)
            })
        )(next(action));
    }
}

export default ActionTransducer;
