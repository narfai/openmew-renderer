import { Blueprint } from 'Core/Kernel/Abstract/Blueprint';
import { resource, inject, namespace } from 'Core/DependencyInjection/decorators';

@resource('HelloBlueprint')
@inject(['Core.Ux.containerManager', 'Core.Ux.userInterfaceManager', 'Core.Ux.renderManager'])
@namespace('Application.Hello')
export class HelloBlueprint extends Blueprint {
    controller({ vm, container }){
        super.controller({ vm, container });//Call parent if you want enable facilities
        let inc = 0;
        container.actions
            .createSelfAction('doIncrement', () => ({ 'type': 'INCREMENT' }))
            .createChainAction('doIncrementChain', () => ({ 'type': 'INCREMENT' }))
            .createGlobalAction('doIncrementAll', () => ({ 'type': 'INCREMENT' }))
            .createParentAction('doRemoveModule', () => (
                this.containerManager.createRemoveModuleAction({ 'id': container.id })
            ))
            .createSelfAction('doAddModule', () => (
                this.containerManager.createAddModuleAction({
                    'resource': 'Application.Hello.HelloBlueprint',
                    'data': { 'text': 'Child of #' + container.id },
                    'name': 'NewModule'
                })
            ), (e, data) => {
                data.data.text += (inc? inc : '');
                inc++;
                return data;
            });
        container.actions.createSelfAction('doSetActivePage', () => ({ }), (e, data) => {
            data.name = e.target.attrs['page-name'];
            return data;
        });
    }
    render({ container, vm, vnode }){
        return super.render({ container, vm, vnode, 'resource': 'Hello' });
    }
    reducer(){
        return (state = { 'number': 0, 'text': '' }, action) => {
            switch (action.type){
                case 'INCREMENT':
                    return {
                        'text': state.text,
                        'number': state.number? ++state.number : 1
                    };
                default:
                    return state;
            }
        };
    }
    static describe(){
        let { depends } = super.describe();
        return {
            'resource': 'Hello',
            'depends': depends
        };
    }
}

export default HelloBlueprint;
