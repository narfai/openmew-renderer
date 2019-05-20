export class Store {
    constructor({ store, select = null }){
        this.store = store;
        this.select = select;
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
}

export default Store;
