import m from 'mithril';
import uniqid from 'uniqid';
import { reducer_creator} from './state';
import { component_creator } from './render';
import { Store } from '../state/store';
import {Action, ATTACH_TYPE, DETACH_TYPE, REGISTER_TYPE} from '../state/action';
import format from "../format";

class Registry {
    constructor(){
        this.containers = {};
    }

    replace(container){
        const old_container = this.get_or_fail();
        this.containers[container.id] = container;
        return old_container;
    }

    get(id){
        if(typeof this.containers[id] === 'undefined')
            return null;
        return this.containers[id];
    }

    get_or_fail(id){
        return this.get(id) || (() => {
            throw new Error('Detached container #' + id);
        })();
    }

    register({ resource, ...other }){
        this.blueprints[resource] = format.blueprint({ resource, ...other });
    }

    attach(container){
        this.containers[container.id] = container;
        return container;
    }

    detach(id){
        if(typeof this.containers[id] !== 'undefined'){
            const container = this.containers[id];
            const { containers } = container.store.getState();
            containers.forEach((child) => {
                this.detach({'id': child.id });
            });
            delete this.containers[id];
        }
    }
}

class Container {
    constructor(resource, chain = []){
        this.id = uniqid();
        this.resource = resource;
        this.reducer = reducer_creator(this);
        this.chain = [...chain, this.id];
    }

    containers_reducer(){
        return (state) => state;
    }

    consumer_reducer(){
        return (state) => state;
    }

    connect(store, blueprint){
        const { id, chain, resource } = this;
        return new ConnectedContainer({
            id,
            chain,
            store,
            blueprint,
            resource
        });
    }
}

class ConnectedContainer {
    constructor({ id, chain, resource, store, blueprint }){
        this.id = id;
        this.resource = resource;
        this.chain = [...chain, id];
        this.store = new Store({
            store,
            'select':
                this.chain.length === 1
                    ? null
                    : (state) =>
                        (typeof state.containers !== 'undefined')
                            ? state.containers.find(
                            ({ 'id': state_id }) => state_id === this.id
                            )
                            : state
        });

        this.consumer_reducer = blueprint.consumer_reducer
            ? blueprint.consumer_reducer
            : (state) => state;
        this.containers_reducer = blueprint.containers_reducer
            ? blueprint.containers_reducer
            : (state) => state;

        this.component = component_creator(blueprint);
        this.reducer = reducer_creator(this);
    }
}

export const register_middleware = (registry) => (store) => (next) => (action) => {
    if (action.type !== REGISTER_TYPE) return next(action);

    const { containers = [], resource = null } = store.getState();
    if (action.resource === null) return next(action);

    const container = registry.get_or_fail(action.id);
    const propagate_registration = (recursive_containers, parent_container) => recursive_containers
            .filter(({ 'resource': next_resource }) => next_resource === action.resource)
            .forEach(({ 'containers': next_containers }) => {
                const detached = new Container(
                    registry.get_or_fail(parent_container.id)
                );

                registry.attach(
                    detached.connect(parent_container.store, action)
                );
                propagate_registration(next_containers);
            });

    propagate_registration(containers, container);

    delete action.view;
    delete action.consumer_reducer;
    delete action.containers_reducer;
    delete action.controller;
    delete action.lifecycle;
    return next(action);
};

export const attach_middleware = (registry) => (store) => (next) => (action) => {
    if (action.type !== ATTACH_TYPE)
        return next(action);

    const parent_container = registry.get_or_fail(action.parent_id);
    const detached = new Container(
        registry.get_or_fail(parent_container.id)
    );

    registry.attach(
        detached.connect(parent_container.store, action)
    );

    return next(action);
};

export const detach_middleware = (registry) => () => (next) => (action) => {
    if (action.type !== DETACH_TYPE)
        return next(action);

    const { id } = registry.get_or_fail(action.id);

    registry.detach(id);

    return next(action);
};
