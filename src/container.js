import { Store } from './state/store';

export class Container {
    constructor({ id, from_store, component_creator, reducer_creator, chain = []}){
        this.id = id;
        this.chain = [...chain, id];
        this.store = new Store({
            'store': from_store,
            'select':
                this.chain.length === 1
                    ? null
                    : (state) =>
                        (typeof state.containers !== 'undefined')
                            ? state.containers.find(
                            ({ 'id': state_id }) => state_id === this.id
                            )
                            : state
        });

        this.reducer = reducer_creator(this);
        this.component = component_creator(this);
    }

    consumer_data(){
        return this.store.getState().consumer_data;
    }
}
