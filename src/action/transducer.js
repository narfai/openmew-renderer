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
                        ? allow_propagate(state)
                        : next_action.propagate(state) || allow_propagate(state)
            })
        )(next(action));
    }

    static reduce(allow_reduce){
        return (next) => (action) => (
            (next_action) => ({
                ...next_action,
                'reduce':
                    (state) => typeof next_action.reduce === 'undefined'
                        ? allow_reduce(state)
                        : next_action.reduce(state) || allow_reduce(state)
            })
        )(next(action));
    }

    static redraw(allow_redraw){
        return (next) => (action) => (
            (next_action) => ({
                ...next_action,
                'redraw': allow_redraw()
            })
        )(next(action));
    }
}

export default ActionTransducer;
