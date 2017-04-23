import { Container } from './Container.js';
import { UserInterfaceManager } from '../UserInterfaceManager.js';

import { resource as res, inject, namespace } from 'Core/DependencyInjection/decorators';

const pId = Symbol('id');
const pContainers = Symbol('containers');

@res('containerManager')
@inject(['providerManager','blueprintManager'])
@namespace('Core.Ux')
export class ContainerManager {
    constructor({ providerManager, blueprintManager }){
        this.providerManager = providerManager;
        this.blueprintManager = blueprintManager;
        this[pContainers] = [];
        this[pId] = ContainerManager.idGenerator();
    }

    createContainer({ blueprint, provider, chain = [], id = null }){
        id = id || this[pId]();
        chain = [ ...chain, id ];

        let container = new Container({ id, provider, 'chain': chain, blueprint });

        this[pContainers].push(container);
        return container;
    }

    createSubContainer({ blueprint, parent }){
        let id = this[pId]();
        let provider = this.providerManager.createSubProvider({
            id,
            'parent': parent.provider,
            'key': 'modules',
            'discriminator': 'id'
        });
        return this.createContainer({ blueprint, provider, 'chain': parent.chain, id });
    }

    getContainer({ id }){
        return this[pContainers].find((container) => container.id === id);
    }

    getComponent({ id }){
        let container = this.getContainer({ id });
        if(!container)
            return { 'view': UserInterfaceManager.getDummyView() };
        return container.getComponent();
    }

    getComponentByName({ name, container }){
        let { modules } = container.provider.getState();

        let moduleState = modules.find(({ ['name']: moduleName }) => moduleName === name);
        if(!moduleState)
            return {'view': UserInterfaceManager.getDummyView()};

        return this.getComponent({ 'id': moduleState.id });
    }


    getModuleReducer({ container, dataReduce }){
        let delegateReduce = this.getDelegateReducer({ container });
        return (state = { 'modules': [], 'data': {} }, action = null) => {
            let allow = ContainerManager.allowReduce({ state, action });
            return {
                'id': state.id || container.id, //tweak to give an id to root module
                'name': state.name,
                'resource': state.resource,
                'data': allow && dataReduce
                    ? dataReduce(state.data, action)
                    : state.data,
                'modules': delegateReduce({
                    'state': allow
                        ? ContainerManager.modulesReduce({'state': state.modules, action})
                        : state.modules,
                    action
                })
            };
        };
    }

    /**
     * @param container
     * @returns {function({state?: *, action?: *})}
     */
    getDelegateReducer({ container }){
        return ({ state = [], action = null }) => {
            return state.map((moduleState) => {
                let { resource = null, id = null } = moduleState;
                if(!resource)
                    return moduleState;

                let subContainer = this.getContainer({ id });
                if(typeof subContainer === 'undefined'){
                    subContainer = this.createSubContainer({
                        'blueprint': this.blueprintManager.get(resource),
                        'parent': container
                    });
                    moduleState.id = subContainer.id;
                }

                if (ContainerManager.allowPropagation({ 'state': moduleState, action }))
                    return subContainer.getReducer()(moduleState, action);

                return moduleState;
            });
        };
    }

    static idGenerator(){
        let id = 0;
        return () => ++id;
    }

    /**
     * Determine if an action can propagate down the store tree
     * @param state
     * @param action
     * @returns {boolean}
     */
    static allowPropagation({ state, action }){
        return (typeof action.propagate === 'undefined' || action.propagate(state) === true);
    }

    /**
     * Determine if an action can performs modification over this part of store tree
     * @param state
     * @param action
     * @returns {boolean}
     */
    static allowReduce({ state, action }){
        return typeof action.reduce === 'undefined' || action.reduce(state) === true;
    }

    static modulesReduce({ state = [], action}){
        switch (action.type){
            case 'ADD_MODULE':
                return [
                    ...state,
                    {
                        'data': action.data,
                        'resource': action.resource,
                        'name': action.name
                    }
                ];
            case 'REMOVE_MODULE':
                return (() => {
                    let index = state.findIndex(({ id }) => id === action.id);
                    if(index === -1)
                        return state;
                    return [
                        ...state.slice(0, index),
                        ...state.slice(index + 1)
                    ];
                })();
            default:
                return state;
        }
    }

    createAddModuleAction({ resource, data = {}, name = '' }){
        return {
            'type': 'ADD_MODULE',
            'resource': resource,
            'name': name,
            'data': data
        };
    }

    createRemoveModuleAction({ id }){
        return {
            'type': 'REMOVE_MODULE',
            'id': id
        };
    }

    static describe(){
        return {
            'resource': 'containerManager',
            'depends': [ 'providerManager', 'ResourceManager' ]
        };
    }
}
export default ContainerManager;
