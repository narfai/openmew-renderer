import { ResourceManager } from './ResourceManager.js';
import { ProviderManager } from './Provider/ProviderManager.js';
import { ContainerManager } from './Container/ContainerManager.js';
import { UserInterfaceManager } from './UserInterface/UserInterfaceManager.js';

let pResourceManager = Symbol('ResourceManager');

export class Kernel {
    constructor({ data }){
        this[pResourceManager] = new ResourceManager();
        this[pResourceManager].plain('initial_data', data);
        this[pResourceManager].plain('ResourceManager', this[pResourceManager]);

        //loading Core service resources
        this[pResourceManager].service(ProviderManager);
        this[pResourceManager].service(ContainerManager);
        this[pResourceManager].service(UserInterfaceManager);
    }
    register(Resource){
        this[pResourceManager].service(Resource);
        return this;
    }
    attach({ resource, element, uiResource }){
        let uiManager = this[pResourceManager]
            .getResource('userInterfaceManager', UserInterfaceManager);

        uiManager
            .loadUi({ uiResource })
            .then((ui) => {
                uiManager.setUi(ui)
                    .createRootContainer({ resource })
                    .mount({ element });
            });

    }
}
export default Kernel;
