
const pActions = Symbol('actions');
export class ActionHandler {
    constructor({ id, chain, provider }){
        this.id = id;
        this.chain = chain;
        this.provider = provider;
        this[pActions] = {};
    }
    createSelfAction(name, data, handler = null){
        this.createGlobalAction(name, () => {
            let w = data();
            w.propagate = (state) => this.chain.indexOf(state.id) !== -1;
            w.reduce = (state) => state.id === this.id;
            return w;
        }, handler);
        return this;
    }
    createChainAction(name, data, handler = null){
        this.createGlobalAction(name, () => {
            let w = data();
            w.propagate = (state) => this.chain.indexOf(state.id) !== -1;
            return w;
        }, handler);
        return this;
    }
    createParentAction(name, data, handler = null){
        this.createGlobalAction(name, () => {
            let w = data();
            let parentId = this.chain.length > 1 ? this.chain[this.chain.length-2] : null;
            w.propagate = (state) => this.chain.indexOf(state.id) !== -1;
            w.reduce = (state) => state.id === parentId;
            return w;
        }, handler);
        return this;
    }
    createResourceAction(name, resource, data, handler = null){ //TODO Try it
        this.createGlobalAction(name, () => {
            let w = data();
            w.reduce = (state) => state.resource === resource;
            return w;
        }, handler);
        return this;
    }

    /**
     * @param name
     * @param data
     * @param handler
     * @returns {ActionHandler}
     */
    createGlobalAction(name, data, handler = null){
        this.set(name, (e) => {
            e.redraw = false;
            return handler
                ? this.provider.dispatch(handler(e, data()))
                : this.provider.dispatch(data());
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
            console.warn('Action ' + name + ' was replaced !' );
            // throw new Error('Action "' + name + '" already defined');
        this[pActions][name] = action;
    }

    static craftAddModuleAction({ resource, data = {}, name = '' }){
        return {
            'type': 'ADD_MODULE',
            'resource': resource,
            'name': name,
            'data': data
        };
    }

    static craftRemoveModuleAction({ id }){
        return {
            'type': 'REMOVE_MODULE',
            'id': id
        };
    }
}

export default ActionHandler;
