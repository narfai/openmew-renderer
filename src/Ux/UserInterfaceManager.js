import m from 'mithril';
// import { ManagedAnchor } from './ManagedAnchor.js';
// import { ManagedAnchorGroup } from './ManagedAnchorGroup.js';
// import { ManagedNamedAnchorGroup } from './ManagedNamedAnchorGroup.js';

import { resource as res, inject, namespace } from 'Core/Kernel/DependencyInjection/decorators';

@res('userInterfaceManager')
@inject(['providerManager', 'containerManager'])
@namespace('Core.Ux')
export class UserInterfaceManager {
    constructor({ providerManager, containerManager }){
        this.providerManager = providerManager;
        this.containerManager = containerManager;
        // this.uiResourceManager = new ResourceManager();

        // this.extraResourceManager = new ResourceManager();
        // this.extraResourceManager.plain('containerManager', this.containerManager);
        // this.extraResourceManager.service(ManagedAnchor, 'component');
        // this.extraResourceManager.service(ManagedAnchorGroup, 'component');
        // this.extraResourceManager.service(ManagedNamedAnchorGroup, 'component');
    }
    createRootContainer({ resource }){
        let container = this.containerManager.createContainer({
            'provider': this.providerManager.getProvider(),
            resource
        });
        this.providerManager.replaceReducer({ 'reducer': container.reduce });
        return container;
    }
    createRenderManager({ resourceIds }){
        @res('renderer')
        @inject(resourceIds)
        @namespace('Core.Ux')
        class Renderer {
            constructor(resources){
                this.resources = resources;
            }
            render({ resource, container, vm, vnode }){
                if(typeof this.resources[resource] === 'undefined')
                    throw new Error('Ui does not provide ' + resource + ' resource');
                let uiPartInstance = this.resources[resource];
                let { id, actions } = container;
                return uiPartInstance.render(
                    { id, actions, container, vm, vnode },
                    UserInterfaceManager.extractDepends(
                        container.provider.getState(),
                        uiPartInstance.getDataDependencies()
                    )
                );
            }
        }

        return Renderer;
    }
    createBlueprintManager({ resourceIds }){
        @res('blueprintManager')
        @inject(resourceIds)
        @namespace('Core.Ux')
        class BlueprintManager {
            constructor(resources){
                this.resources = resources;
            }
            get({ resourceId }){
                if(typeof this.resources[resourceId] === 'undefined')
                    throw new Error('No such blueprint resource : ' + resourceId);
                return this.resources[resourceId];
            }
        }
        return BlueprintManager;
    }
    mount({ container }){
        if(this.container === null)
            throw new Error('You can\'t mount before creating a root container');

        m.mount(this.element, container.component);
        this.providerManager.provider.subscribe(UserInterfaceManager.redraw);
        return this;
    }

    getDummyView(){
        UserInterfaceManager.getDummyView();
    }
    static getDummyView(){
        return () => m('#');
    }
    redraw(){
        UserInterfaceManager.redraw();
    }
    static redraw(){
        m.redraw();
    }
    static extractDepends(state, depends){
        let viewState = {};
        depends.forEach((depend) => {
            if(state.hasOwnProperty(depend))
                viewState[depend] = state[depend];
            else if(state.data.hasOwnProperty(depend))
                viewState[depend] = state.data[depend];
        });
        return viewState;
    }
    static injectDataSymbol(){
        return Symbol.for('Core.Ux.$injectData');
    }
    static useRenderSymbol(){
        return Symbol.for('Core.Ux.$useRender');
    }
}
export default UserInterfaceManager;
