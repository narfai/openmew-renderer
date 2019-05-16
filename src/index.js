import { Store } from './Store';
import m from 'mithril';

const REGISTER_TYPE = 'REGISTER';
const CONNECT_TYPE = 'CONNECT';

export const Anchor = {
    'resource': 'Anchor',
    'view': (vnode) => {
        let {id} = vnode.attrs;
        let attributes = Object.assign({}, vnode.attrs),
            container = Container.get({ id });
        if(container === null)
            return m('#');

        return m(container.component, attributes);
    }
};

export const AnchorGroup = {
    'resource': 'AnchorGroup',
    'view': ({ attrs, container = null }) => {
        let { wrapper = null, filterFn = () => true } = attrs;

        if(!container)
            return m('#');

        return container.store.getState().containers
            .filter(filterFn)
            .map(({ id }) => {
                    let attributes = Object.assign({}, attrs);
                    attributes.id = id;
                    attributes.key = id;
                    return wrapper !== null
                        ? m(wrapper, {'key': id}, [m(Anchor, attributes)])
                        : m(Anchor, attributes);
                }
            );
    }
};

export const NamedAnchorGroup = {
    'resource': 'NamedAnchorGroup',
    'view': ({ 'attrs': { name_key, ...attrs } }) => {
        let attributes = Object.assign(
            {
                'filterFn': (container) => {
                    let consumer_data = container.consumer_data();
                    return !(typeof consumer_data[name_key] !== 'undefined'
                        && typeof attrs[name_key] !== 'undefined'
                        && consumer_data[name_key] === attrs[name_key]);
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
            let w = creator();
            w.propagate = (state) => container.chain.indexOf(state.id) !== -1;
            w.reduce = (state) => state.id === container.id;
            return w;
        });
    }
    static chain_scope(container, creator){
        return SpreadAction.global_scope(container, () => {
            let w = creator();
            w.propagate = (state) => container.chain.indexOf(state.id) !== -1;
            return w;
        });
    }
    static parent_scope(container, creator){
        return SpreadAction.global_scope(container, () => {
            let w = creator();
            let parentId = container.chain.length > 1 ? container.chain[container.chain.length-2] : null;
            w.propagate = (state) => container.chain.indexOf(state.id) !== -1;
            w.reduce = (state) => state.id === parentId;
            return w;
        });
    }

    static resource_scope(container, resource, creator){ //TODO Try it
        return SpreadAction.global_scope(container, () => {
            let w = creator();
            w.reduce = (state) => state.resource === resource;
            return w;
        });
    }

    static custom_scope(container, creator, reduce = null, propagate = null){
        return SpreadAction.global_scope(container, () => {
            let w = creator();
            if(reduce)
                w.reduce = reduce;
            if(propagate)
                w.propagate = propagate;
            return w;
        });
    }

    static global_scope(container, creator){
        return (e) => {
            e.redraw = false;
            let action = creator(e);
            action.id = container.id;
            container.store.dispatch(action);
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

    static CONNECT({ id, resource, consumer_data = {}, parent_id = null, render = null }){
        return {
            'type': CONNECT_TYPE,
            id,
            resource,
            parent_id,
            render,
            consumer_data
        };
    }
}

export class Registry {
    constructor(){
        this.blueprints = {};
        this.containers = [];
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

    connect({ store, id, resource, parent_id = null }){
        if(typeof this.blueprints[resource] === 'undefined')
            throw new Error('Unregistered resource ' + resource);

        if(typeof this.containers[id] !== 'undefined')
            return null;

        let { chain, from_store } = (() => {
            if (parent_id)
                return { 'from_store': this.get_or_fail(parent_id).store };
            return {
                'chain': [],
                'from_store': store
            };
        })();

        let { view, reducer, controller } = this.blueprints[resource];

        let container = new Container({
            id,
            from_store,
            'component_creator': Container.component_creator({ 'registry': this })({
                view,
                controller
            }),
            'reducer_creator': Container.reducer_creator({ 'registry': this }),
            chain
        });

        this.containers[container.id] = container;
        return container;
    }

    get(id){
        if(typeof this.containers[id] === 'undefined')
            return null;
        return this.containers[id];
    }

    get_or_fail(id){
        let container = this.get(id);
        if(!container)
            throw new Error('Unconnected container #' + id);

        return container;
    }
}


export class Container {
    constructor({ id, from_store, component_creator, reducer_creator, chain = []}){
        this.id = id;
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

    static component_creator({ registry }){
        return ({ view, controller = null }) => (container) => {
            let expose = { registry };
            if(container)
                expose = { ...expose, container };
            let component = {
                'view': view
                    ? (vnode) => view({ vnode, ...expose })
                    : () => m('#')
            };

            if(controller){
                component.oninit = function BlueprintController(initial_vnode){
                    controller.call(this, { initial_vnode, ...expose });
                    return this;
                };
            }
            return component;
        };
    }

    static reducer_creator({ registry }){
        return (container) => (state = { 'containers': [], 'consumer_data': {} }, action = null) => {
            let allow = Container.allow_reduction({state, action});
            return {
                'id': state.id,
                'name': state.name,
                'view': state.view,
                'resource': state.resource,
                'consumer_data': allow && container
                    ? container.reducer(state.consumer_data, action)
                    : state.consumer_data,
                'containers': (
                    (containers) =>
                        containers.map((subState) =>
                            action.id && Container.allow_propagation({'state': subState, action})
                                ? registry.get_or_fail(action.id).reducer(subState, action)
                                : subState
                        )
                )(
                    allow
                    ? Container.internal_reducer({'state': state.containers, action, container})
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
            case 'CONNECT':
                return [
                    ...state,
                    {
                        'id': action.id,
                        'consumer_data': action.consumer_data || {},
                        'resource': action.resource,
                        'containers': []
                    }
                ];
            // case 'UNCONNECT'://TODO
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

export const connect_middleware = (registry) => (store) => (next) => (action) => {
    console.log('action', action);
    if (action.type !== CONNECT_TYPE)
        return next(action);

    if(typeof action.store === 'undefined')
        action.store = store;

    let container = registry.connect(action);
    if(container){
        let { containers } = container.store.getState();

        containers.forEach(({id, resource, consumer_data}) => store.dispatch(
            ActionCreator.CONNECT({
                id,
                resource,
                consumer_data,
                'store': container.store,
                'parent_id': container.id
            }))
        );

        if (action.render)
            action.render({container});
        delete action.render;
    }
    delete action.store;
    return next(action);
};

//TODO unconnect
