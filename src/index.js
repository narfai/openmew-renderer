import { Store } from './Store';
import m from 'mithril';

const REGISTER_TYPE = 'REGISTER';
const ATTACH_TYPE = 'ATTACH';
const DETACH_TYPE = 'DETACH';

export const Anchor = {
    'view': (vnode) => {
        const { id, registry } = vnode.attrs;
        const container = registry.get(id);

        if(container === null) return m('#');

        const attributes = Object.assign({}, vnode.attrs);
        return m(container.component, attributes);
    }
};

export const AnchorGroup = {
    'view': (vnode) => {
        const { wrapper = null, filterFn = () => true, id, registry } = vnode.attrs;
        const container = registry.get(id);

        if(!container) return m('#');

        const state = container.store.getState();

        if(typeof state.containers === 'undefined') return m('#');

        return state.containers
            .filter(({ id }) => filterFn(registry.get(id)))
            .map(({ 'id': sub_id }) => {
                    let attributes = Object.assign({}, vnode.attrs);
                    attributes.id = sub_id;
                    attributes.key = sub_id;
                    attributes.registry = registry;
                    return wrapper !== null
                        ? m(wrapper, {'key': sub_id}, [m(Anchor, attributes)])
                        : m(Anchor, attributes);
                }
            );
    }
};

export const NamedAnchorGroup = {
    'view': ({ 'attrs': { name_key, name, ...attrs } }) => {
        let attributes = Object.assign(
            {
                'filterFn': (container) => {
                    let consumer_data = container.consumer_data();
                    return !(typeof consumer_data[name_key] === 'undefined'
                        || typeof name_key === 'undefined'
                        || typeof name === 'undefined'
                        || consumer_data[name_key] !== name);
                }
            },
            attrs
        );
        return m(AnchorGroup, attributes);
    }
};


export class SpreadAction {
    static self_scope(container, creator){
        return SpreadAction.global_scope(container, () => {
            const w = creator();
            w.propagate = (state) => container.chain.indexOf(state.id) !== -1;
            w.reduce = (state) => state.id === container.id;
            return w;
        });
    }
    static chain_scope(container, creator){
        return SpreadAction.global_scope(container, () => {
            const w = creator();
            w.propagate = (state) => container.chain.indexOf(state.id) !== -1;
            return w;
        });
    }
    static parent_scope(container, creator){
        return SpreadAction.global_scope(container, () => {
            const w = creator();
            const parentId = container.chain.length > 1 ? container.chain[container.chain.length-2] : null;
            w.propagate = (state) => container.chain.indexOf(state.id) !== -1;
            w.reduce = (state) => state.id === parentId;
            return w;
        });
    }

    static resource_scope(container, resource, creator){ //TODO Try it
        return SpreadAction.global_scope(container, () => {
            const w = creator();
            w.reduce = (state) => state.resource === resource;
            return w;
        });
    }

    static custom_scope(container, creator, reduce = null, propagate = null){
        return SpreadAction.global_scope(container, () => {
            const w = creator();
            if(reduce) w.reduce = reduce;
            if(propagate) w.propagate = propagate;
            return w;
        });
    }

    static global_scope(container, creator){
        return (e = {}) => {
            e.redraw = false;
            const action = creator(e);
            action.container_id = container.id;
            e.dispatch_result = container.store.dispatch(action);
            return e;
        };
    }
}

export class ActionCreator {
    static REGISTER_BLUEPRINT({ resource, view, reducer = null, controller = null}){
        return {
            'type': REGISTER_TYPE,
            resource,
            view,
            reducer,
            controller
        };
    }

    static ATTACH({ id, resource, consumer_data, parent_id = null, render = null }){
        return {
            'type': ATTACH_TYPE,
            id,
            resource,
            consumer_data,
            parent_id,
            render
        };
    }

    static DETACH({ id }){
        return {
            'type': DETACH_TYPE,
            id
        };
    }
}

export class Registry {
    constructor(){
        this.blueprints = {};
        this.containers = {};
    }

    register({ resource, view, reducer = null, controller = null }){
        if(typeof this.blueprints[resource] !== 'undefined')
            console.warn('Redefine ' + resource);
        this.blueprints[resource] = {
            resource,
            view,
            reducer,
            controller
        };
    }

    attach({ store, id, resource, parent_id = null }){
        if(typeof this.blueprints[resource] === 'undefined')
            throw new Error('Unregistered resource ' + resource);

        if(typeof this.containers[id] !== 'undefined')
            return null;

        const { chain, from_store } = (() => {
            if(parent_id){
                const parent = this.get_or_fail(parent_id);
                return {'from_store': parent.store, 'chain': parent.chain};
            }

            return {
                'chain': [],
                'from_store': store
            };
        })();

        const { view, reducer, controller } = this.blueprints[resource];

        const container = new Container({
            id,
            from_store,
            resource,
            'component_creator': Container.component_creator({ 'registry': this, view, controller }),
            'reducer_creator': Container.reducer_creator({ 'registry': this, reducer }),
            chain
        });

        this.containers[container.id] = container;
        return container;
    }

    detach({ id }){
        if(typeof this.containers[id] !== 'undefined')
            delete this.containers[id]
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
}


export class Container {
    constructor({ id, from_store, resource, component_creator, reducer_creator, chain = []}){
        this.id = id;
        this.resource = resource;
        this.chain = [...chain, id];
        this.store = new Store({
            'store': from_store,
            'select':
                this.chain.length === 1
                    ? null
                    : (state) =>
                        (typeof state.containers !== 'undefined')
                            ? state.containers.find(
                                ({ 'id': stateId }) => stateId === this.id
                            )
                            : state
        });

        this.reducer = reducer_creator(this);
        this.component = component_creator(this);
    }

    consumer_data(){
        return this.store.getState().consumer_data;
    }

    static component_creator({ registry, view = null, controller = null }){
        return (container) => {
            const expose = { registry, container };

            const component = {
                'view': view !== null
                    ? view(expose)
                    : () => m('#')
            };

            if(controller !== null){
                component.oninit = function BlueprintController(initial_vnode){
                    controller.call(this, { initial_vnode, ...expose });
                    return this;
                };
            }
            return component;
        };
    }

    static reducer_creator({ registry, reducer }){
        return (container) => (state = { 'containers': [], 'consumer_data': {} }, action = null) => {
            const allow = Container.allow_reduction({state, action});
            return {
                'id': state.id || container.id,
                'resource': state.resource || container.resource,
                'consumer_data': allow === true
                    ? reducer(state.consumer_data, action)
                    : state.consumer_data,
                'containers': (
                    (containers) =>
                        containers.map((subState) =>
                            typeof action.container_id !== 'undefined' && Container.allow_propagation({'state': subState, action}) === true
                                ? registry.get_or_fail(action.container_id).reducer(subState, action)
                                : subState
                        )
                )(
                    allow === true
                    ? Container.internal_reducer({'state': state.containers, action })
                    : state.containers
                )
            };
        };
    }

    static allow_propagation({ state, action }){
        return (typeof action.propagate === 'undefined' || action.propagate(state) === true);
    }

    static allow_reduction({ state, action }){
        return (typeof action.reduce === 'undefined' || action.reduce(state) === true);
    }

    static internal_reducer({ state = [], action }){
        switch (action.type){
            case 'ATTACH':
                if(action.parent_id === null) {
                    return state;
                }
                return [
                    ...state,
                    {
                        'id': action.id,
                        'consumer_data': action.consumer_data || {},
                        'resource': action.resource,
                        'containers': []
                    }
                ];
            case 'DETACH':
                return state.filter(({ id }) => id !== action.id);
            default:
                return state;
        }
    }
}

export const register_middleware = (registry) => (store) => (next) => (action) => {
    if (action.type !== REGISTER_TYPE)
        return next(action);

    registry.register(action);

    delete action.view;
    delete action.reducer;
    delete action.controller;
    return next(action);
};

//TODO unregister
export const attach_middleware = (registry) => (store) => (next) => (action) => {
    if (action.type !== ATTACH_TYPE)
        return next(action);

    if(typeof action.store === 'undefined')
        action.store = store;

    const container = registry.attach(action);
    console.log('ACTION', action);
    if(container !== null){
        const state = container.store.getState();

        if(state && typeof state.containers !== 'undefined'){
            state.containers.forEach(({id, resource, consumer_data}) => store.dispatch(
                ActionCreator.ATTACH({
                    id,
                    resource,
                    consumer_data,
                    'store': container.store,
                    'parent_id': container.id
                }))
            );
        }
    }

    if (action.render)
        action.render({container});
    delete action.render;
    delete action.store;

    // delete action.store;
    return next(action);
};

export const detach_middleware = (registry) => (store) => (next) => (action) => {
    if (action.type !== DETACH_TYPE)
        return next(action);

    const container = registry.get(action.id);
    if(container !== null){
        console.log('detach');
        registry.detach({ 'id': container.id });
    }

    return registry.connect(action);
};
