import { Container } from './container';
import { reducer_creator } from './state/reducer';
import { component_creator } from './component';

export class Registry {
    constructor(){
        this.blueprints = {};
        this.containers = {};
    }

    register({ resource, view, reducer = null, controller = null }){
        if(typeof this.blueprints[resource] !== 'undefined')
            console.warn('Redefine ' + resource);
        this.blueprints[resource] = {
            resource,
            view,
            reducer,
            controller
        };
    }

    attach(store, { id, resource, parent_id = null }){
        if(typeof this.blueprints[resource] === 'undefined')
            throw new Error('Unregistered resource ' + resource);

        if(typeof this.containers[id] !== 'undefined')
            return null;

        const { chain, from_store } = (() => {
            if(parent_id){
                const parent = this.get_or_fail(parent_id);
                return {'from_store': parent.store, 'chain': parent.chain};
            }

            return {
                'chain': [],
                'from_store': store
            };
        })();

        const { view, reducer, controller } = this.blueprints[resource];

        const container = new Container({
            id,
            from_store,
            'component_creator': component_creator({ 'registry': this, view, controller }),
            'reducer_creator': reducer_creator({ 'registry': this, reducer }),
            chain
        });

        this.containers[container.id] = container;
        return container;
    }

    detach({ id }){
        if(typeof this.containers[id] !== 'undefined')
            delete this.containers[id];
    }

    get(id){
        if(typeof this.containers[id] === 'undefined')
            return null;
        return this.containers[id];
    }

    get_or_fail(id){
        return this.get(id) || (() => {
            throw new Error('Detached container #' + id);
        })();
    }
}
