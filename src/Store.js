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


const store = new Store(store_redux, ({ toto }) => {
    return toto.tata;
});

const store = new Store(store_redux, (tata) => {
    return tata.titi;
});

store.getState(); //toto.tata.titi
