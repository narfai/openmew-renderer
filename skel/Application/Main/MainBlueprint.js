import { Blueprint } from 'Core/Kernel/Abstract/Blueprint';
import { resource, inject, namespace } from 'Core/DependencyInjection/decorators';

@resource('MainBlueprint')
@inject(['Core.Ux.containerManager', 'Core.Ux.userInterfaceManager', 'Core.Ux.renderManager'])
@namespace('Application.Main')
export class MainBlueprint extends Blueprint {
    reducer(){
        return (state = {'prefix': '', 'name': ''}, action) => {
            switch (action.type){
                case 'AWESOME':
                    return {
                        'prefix': state.prefix + ' coucou anne ',
                        'name': state.name
                    };
                default:
                    return state;
            }
        };
    }
    render({ container, vm, vnode }){
        return super.render({ container, vm, vnode, 'resource': 'App' });
    }
    controller({ vm, container }){
        super.controller({ vm, container });

        container.actions.createSelfAction('doAppAwesome', () => ({ 'type': 'AWESOME' }));

        let inc = 0;
        container.actions.createSelfAction('doAddModule', () => (
            this.containerManager.createAddModuleAction({
                'resource': 'Application.Hello.HelloBlueprint',
                'data': { 'text': 'Houhou' },
                'name': 'NewModule'
            })
        ), (e, data) => {
            data.data.text += (inc? inc : '');
            inc++;
            return data;
        });

        vm.switchUi = (uiResource) => () => {
            this.userInterfaceManager
                .loadUi({ uiResource })
                .then((ui) => {
                    this.userInterfaceManager.replaceUi(ui);
                });
        };
    }
    static describe(){
        let { depends } = super.describe();
        return {
            'resource': 'App',
            'depends': depends
        };
    }
}

export default MainBlueprint;

