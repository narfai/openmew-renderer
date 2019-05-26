export class Store {
    constructor({ store, select = null }){
        this.store = store;
        this.select = select;

        const { id, resource } = this.getState();
        this.id = id;
        this.resource = resource;
        this.chain = typeof store.chain === 'undefined'
            ? [this.id]
            : [...store.chain, this.id]
        ;
        // this.id = id;
        // this.resource = resource;
    }

    // getChain(){
    //     return (
    //         ({ id = null }) =>
    //             id === null
    //                 ? [ ...this.chain ]
    //                 : [ ...this.chain, id]
    //     )(this.getState());
    // }

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
            store,
            'select': ({children = []}) =>
                children.find(
                    ({id}) => id === child_id
                )
        });
    }
}
