/*
 This Source Code Form is subject to the terms of the Mozilla Public
 License, v. 2.0. If a copy of the MPL was not distributed with this
 file, You can obtain one at http://mozilla.org/MPL/2.0/.

 Copyright (C) 2017 François Cadeillan <francois@azsystem.fr>
 */

export class ReduceHandler {
    /**
     * Determine if an action can propagate down the store tree
     * @param state
     * @param action
     * @returns {boolean}
     */
    static allowPropagation({ state, action }){
        return (typeof action.propagate === 'undefined' || action.propagate(state) === true);
    }

    /**
     * Determine if an action can performs modification over this part of store tree
     * @param state
     * @param action
     * @returns {boolean}
     */
    static allowReduce({ state, action }){
        return typeof action.reduce === 'undefined' || action.reduce(state) === true;
    }

    static modulesReduce({ state = [], action}){
        switch (action.type){
            case 'ADD_MODULE':
                return [
                    ...state,
                    {
                        'data': action.data,
                        'resource': action.resource,
                        'name': action.name
                    }
                ];
            case 'REMOVE_MODULE':
                return (() => {
                    let index = state.findIndex(({ id }) => id === action.id);
                    if(index === -1)
                        return state;
                    return [
                        ...state.slice(0, index),
                        ...state.slice(index + 1)
                    ];
                })();
            default:
                return state;
        }
    }
}

export default ReduceHandler;
