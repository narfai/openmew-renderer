import { Container } from 'Core/DependencyInjection/Container';

import { UserInterfaceManager } from 'Core/Ux/UserInterfaceManager';
import { ContainerManager } from 'Core/Ux/Container/ContainerManager';
import { ProviderManager } from 'Core/Ux/Provider/ProviderManager';
import { ManagedAnchor } from 'Core/Ux/Managed/ManagedAnchor';
import { ManagedAnchorGroup } from 'Core/Ux/Managed/ManagedAnchorGroup';
import { ManagedNamedAnchorGroup } from 'Core/Ux/Managed/ManagedNamedAnchorGroup';

import { MainBlueprint } from 'Main/MainBlueprint';
import { HelloBlueprint } from 'Hello/HelloBlueprint';
import { ui } from '../myUi';

let clientContainer = new Container();

//Core managers
clientContainer.register(ContainerManager);
clientContainer.register(ProviderManager, {
    'name': 'MyApplication',
    'resource': 'App',
    'data': {
        'prefix': 'My',
        'name': 'application'
    },
    'modules': [
        {
            'name': 'CandyWorld',
            'resource': 'Application.Hello.HelloBlueprint',
            'data': {
                'text': 'CandyWorld',
                'number': 666
            },
            'modules': [
                {
                    'name': 'CoolWorld',
                    'resource': 'Application.Hello.HelloBlueprint',
                    'data': {
                        'text': 'CoolWorld',
                        'number': 777
                    },
                    'modules': [
                        {
                            'name': 'LollyWorld',
                            'resource': 'Application.Hello.HelloBlueprint',
                            'data': { 'text': 'LollyWorld', 'number': 888 },
                            'modules': [
                                {
                                    'name': 'CookieWorld',
                                    'resource': 'Application.Hello.HelloBlueprint',
                                    'data': { 'text': 'CookieWorld', 'number': 999 }
                                },
                                {
                                    'name': 'PrettyWorld',
                                    'resource': 'Application.Hello.HelloBlueprint',
                                    'data': { 'text': 'PrettyWorld', 'number': 1111 }
                                }
                            ]
                        }
                    ]
                }
            ]
        },
        {
            'name': 'CreepyWorld',
            'resource': 'Application.Hello.HelloBlueprint',
            'data': { 'text': 'CreepyWorld' }
        }
    ]
});
clientContainer.register(UserInterfaceManager);

//Ui facilities
clientContainer.register(ManagedAnchor);
clientContainer.register(ManagedAnchorGroup);
clientContainer.register(ManagedNamedAnchorGroup);

let uiManager = clientContainer.get('Core.Ux.UserInterfaceManager');

//Blueprints
let blueprints = {
    MainBlueprint,
    HelloBlueprint
};
Object.keys(blueprints).forEach((blueprintName) => clientContainer.register(blueprints[blueprintName]));
let blueprintManager = uiManager.createBlueprintManager({ 'resourceIds': blueprints.map((resource) => Container.resolve(resource))});
clientContainer.register(blueprintManager);

//Ui parts
Object.keys(ui).forEach((partName) => clientContainer.register(ui[partName]));
let renderManager = uiManager.createRenderManager({ 'resourceIds': ui.map((resource) => Container.resolve(resource))});
clientContainer.register(renderManager);

let rootContainer = uiManager.createRootContainer({ 'resource': clientContainer.get('Application.Main.MainBlueprint') });

uiManager.mount({
    'container': rootContainer,
    'element': document.getElementById('app')
});
