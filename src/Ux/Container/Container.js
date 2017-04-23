import { ActionHandler } from './ActionHandler.js';

export class Container {
    constructor({ id, provider, chain, blueprint }){
        this.id = id;
        this.provider = provider;
        this.chain = chain;
        this.actions = new ActionHandler({ id, provider, 'chain': this.chain });
        this.reduce = blueprint.getReducer({ 'container': this });
        this.component = blueprint.getComponent({ 'container': this });
    }
    getReducer(){
        return this.reduce;
    }
    getComponent(){
        return this.component;
    }
    getBlueprint(){
        return this.blueprint;
    }
    getState(){
        return this.provider ? this.provider.getState() : null;
    }
}

export default Container;
