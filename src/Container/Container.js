/*
 This Source Code Form is subject to the terms of the Mozilla Public
 License, v. 2.0. If a copy of the MPL was not distributed with this
 file, You can obtain one at http://mozilla.org/MPL/2.0/.

 Copyright (C) 2017 François Cadeillan <francois@azsystem.fr>
 */

import { ActionHandler } from './ActionHandler.js';

const pProvider = Symbol('provider'),
      pReducer = Symbol('reducer'),
      pComponent = Symbol('component'),
      pBlueprint = Symbol('blueprint');


export class Container {
    constructor({ id, provider, chain, blueprint }){
        this[pProvider] = provider;
        this[pReducer] = blueprint.createReducer({ 'container': this });
        this[pComponent] = {};
        this[pBlueprint] = blueprint;
        this.id = id;
        this.chain = chain;
        this.actions = new ActionHandler({ id, provider, chain });
    }
    warmup(){
        this[pComponent] = this[pBlueprint].createComponent({ 'container': this });
    }
    getViewSets(){
        return this[pBlueprint].getViewSetManager().getViewSets();
    }
    setCurrentViewSet({ viewset }){
        this.actions.clear();
        this[pBlueprint].getViewSetManager().setCurrent({ viewset });
        this.warmup();
    }
    getProvider(){
        return this[pProvider];
    }
    getReducer(){
        return this[pReducer];
    }
    getComponent(){
        return this[pComponent];
    }
    getChain(){
        return this.chain;
    }
    getId(){
        return this.id;
    }
    getActions(){
        return this.actions;
    }
    getState(){
        return this[pProvider] ? this[pProvider].getState() : null;
    }
}

export default Container;
