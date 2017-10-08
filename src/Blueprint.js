import { Container } from './Container';
import m from 'mithril';

let blueprints = {};

class ReduceFilters {
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
        return (typeof action.reduce === 'undefined' || action.reduce(state) === true);
    }

    static containersReduce({ state = [], action }){
        switch (action.type){
            case 'ADD_CONTAINER':
                return [
                    ...state,
                    {
                        'view': action.view || null,
                        'data': action.data || {},
                        'resource': action.resource,
                        'name': action.name,
                        'id': action.id
                    }
                ];
            case 'REMOVE_CONTAINER':
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

}

export class Blueprint {
    constructor({
        resource,
        reduce = null,
        controller = null,
        view = null
    }){
        this.resource = resource;
        this.reduce = reduce;
        this.controller = controller;
        this.view = view;
    }
    createReduce({ container }){
        let dataReduce = this.reduce;
        return (state = {'containers': [], 'data': {}}, action = null) => {
            let allow = ReduceFilters.allowReduce({state, action});
            return {
                'id': state.id, //tweak to give an id to root module
                'name': state.name,
                'view': state.view,
                'resource': state.resource,
                'data': allow && dataReduce
                    ? dataReduce(state.data, action)
                    : state.data,
                'containers': (
                        (containers) =>
                            containers.map((subState) =>
                                action.id && ReduceFilters.allowPropagation({'state': subState, action})
                                    ? Container.get({ 'id': action.id }).reduce(subState, action)
                                    : subState
                        )
                    )(allow
                        ? ReduceFilters.containersReduce({'state': state.containers, action, container})
                        : state.containers)
            };
        };
    }
    createComponent({ container = null }){
        let view = this.view;
        let controller = this.controller;
        let expose = { blueprints };
        if(container)
            expose = { ...expose, container, ...container.getData() };
        let component = {
            'view': view
                ? (vnode) => view({ vnode, ...expose })
                : () => m('#')
        };

        if (controller)
            component.oninit((vnode) => controller({ vnode, ...expose }));

        return component;
    }
    static get({ resource }){
        if(typeof blueprints[resource] !== 'undefined')
            return blueprints[resource];
        return null;
    }
    static add({ blueprint }){
        if(typeof blueprint.resource === 'undefined')
            throw new Error('Blueprint resource\'s field is missing');
        if(typeof blueprints[blueprint.resource] !== 'undefined')
            console.warn('Redefine ' + blueprint.resource);

        blueprints[blueprint.resource] = blueprint;
    }
}

export default Blueprint;
