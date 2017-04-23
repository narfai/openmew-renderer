import { createStore } from 'redux';
import { StoreProvider, SubStoreProvider } from './StoreProviders.js';
import { resource, namespace } from 'Core/Kernel/DependencyInjection/decorators';

let pStore = Symbol('store');

@resource('providerManager')
@namespace('Core.Ux')
export class ProviderManager {
    constructor(deps, data){
        this[pStore] = createStore((state) => state, data | {});
        this.provider = new StoreProvider(this[pStore]);
    }
    replaceReducer({ reducer }){
        this[pStore].replaceReducer(reducer);
    }
    getProvider(){
        return this.provider;
    }
    createSubProvider({ id, parent, key, discriminator }){
        return new SubStoreProvider(
            parent,
            (s) => s[key].find(({ [discriminator]: stateId }) => stateId === id),
            id
        );
    }
}

export default ProviderManager;
