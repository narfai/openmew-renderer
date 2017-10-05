/*
 This Source Code Form is subject to the terms of the Mozilla Public
 License, v. 2.0. If a copy of the MPL was not distributed with this
 file, You can obtain one at http://mozilla.org/MPL/2.0/.

 Copyright (C) 2017 François Cadeillan <francois@azsystem.fr>
 */

const pActions = Symbol('actions');
export class ActionHandler {
    constructor({ id, chain, provider }){
        this.id = id;
        this.chain = chain;
        this.provider = provider;
        this[pActions] = {};
    }
    createSelfAction(name, data){
        this.createGlobalAction(name, () => {
            let w = data();
            w.propagate = (state) => this.chain.indexOf(state.id) !== -1;
            w.reduce = (state) => state.id === this.id;
            return w;
        });
        return this;
    }
    createChainAction(name, data){
        this.createGlobalAction(name, () => {
            let w = data();
            w.propagate = (state) => this.chain.indexOf(state.id) !== -1;
            return w;
        });
        return this;
    }
    createParentAction(name, data){
        this.createGlobalAction(name, () => {
            let w = data();
            let parentId = this.chain.length > 1 ? this.chain[this.chain.length-2] : null;
            w.propagate = (state) => this.chain.indexOf(state.id) !== -1;
            w.reduce = (state) => state.id === parentId;
            return w;
        });
        return this;
    }
    createResourceAction(name, resource, data){ //TODO Try it
        this.createGlobalAction(name, () => {
            let w = data();
            w.reduce = (state) => state.resource === resource;
            return w;
        });
        return this;
    }
    createCustomAction(name, data, reduce = null, propagate = null){
        this.createGlobalAction(name, () => {
            let w = data();
            if(reduce)
                w.reduce = reduce;
            if(propagate)
                w.propagate = propagate;
            return w;
        });
        return this;
    }

    /**
     * @param name
     * @param creator
     * @returns {ActionHandler}
     */
    createGlobalAction(name, creator){
        this.set(name, (e) => {
            e.redraw = false;
            return this.provider.dispatch(creator(e));
        });
        return this;
    }
    list(){
        return Object.keys(this[pActions]);
    }
    get(name){
        if(typeof this[pActions][name] === 'undefined')
            throw new Error('No such action "' + name + '"');
        return this[pActions][name];
    }
    set(name, action){
        if(typeof this[pActions][name] !== 'undefined')
            throw new Error('Action "' + name + '" already defined');
        this[pActions][name] = action;
    }
    clear(){
        this[pActions] = {};
        return this;
    }

    craftAddModuleAction({ resource, data = {}, name = '' }){
        return {
            'type': 'ADD_MODULE',
            'resource': resource,
            'name': name,
            'data': data
        };
    }

    craftRemoveModuleAction({ id }){
        return {
            'type': 'REMOVE_MODULE',
            'id': id
        };
    }
}

export default ActionHandler;
