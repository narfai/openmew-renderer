import { Store } from './Store';
import { Blueprint } from './Blueprint';

let containers = [];

export class Container {
    constructor({ blueprint, store, id, chain = [] }){
        this.id = id;
        this.chain = [ ...chain, id ];
        let container = this;

        this.store = new Store({
            store,
            'select':
                this.chain.length === 1
                    ? null
                    : (state) => {
                        console.log('select', state, this.id);
                        return (typeof state.containers !== 'undefined')
                            ? state.containers.find(({ 'id': stateId }) => stateId === this.id)
                            : state;
                    }
        });

        this.reduce = blueprint.createReduce({ container });
        this.component = blueprint.createComponent({ container });
    }

    getData(){
        return this.store.getState().data;
    }

    getContainers(){
        let state = this.store.getState();
        if(!state.containers || !state.containers.length)
            return [];
        return state.containers
            .map(({ id }) => Container.get({ id }))
            .filter((container) => container);
    }

    static get({ id }){
        return containers
                .find((container) => container.id === id);
    }

    static add({ container }){
        containers.push(container);
        let state = container.store.getState();
        if(state.containers && state.containers.length){
            state.containers.forEach(({ id, resource }) => {
                if(!Container.get({ id })){
                    let blueprint = Blueprint.get({ resource });
                    if(blueprint){
                        Container.add({
                            'container': new Container({
                                blueprint,
                                'store': container.store,
                                'chain': container.chain,
                                id
                            })
                        });
                    }
                }
            });
        }
    }
}
export default Container;
