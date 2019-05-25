export class Store {
    constructor({ store, id = null, select = null }){
        this.store = store;
        this.select = select;
        this.chain = store instanceof Store
            ? store.getChain()
            : id === null
                ? []
                : [id]
        ;
    }

    getId(){
        const [ id ] = this.getChain().slice(-1);
        return id;
    }

    getChain(){
        return (
            ({ id = null }) =>
                id === null
                    ? [ ...this.chain ]
                    : [ ...this.chain, id]
        )(this.getState());
    }

    getState(){
        let state = this.store.getState();

        return this.select
            ? this.select(state)
            : state;
    }

    dispatch(action){
        return this.store.dispatch(action);
    }

    static child_store(child_id, store){
        return new Store({
            'id': store.getState().id,
            store,
            'select': ({children = []}) =>
                children.find(
                    ({id}) => id === child_id
                )
        });
    }
}
