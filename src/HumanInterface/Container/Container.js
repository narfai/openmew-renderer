import { ActionHandler } from './ActionHandler.js';

const pProvider = Symbol('provider'),
      pReducer = Symbol('reducer'),
      pComponent = Symbol('component');

export class Container {
    constructor({ id, provider, chain }){
        this[pProvider] = provider;
        this[pReducer] = (state) => state;
        this[pComponent] = {};
        this.id = id;
        this.chain = chain;
        this.actions = new ActionHandler({ id, provider, 'chain': this.chain });
    }
    setReducer(reducer){
        this[pReducer] = reducer;
    }
    setComponent(component){
        this[pComponent] = component;
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
