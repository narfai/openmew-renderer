import { Store } from './store';
import { spread, action_collection } from './action';

export const anchor = (mithril) => ({
    'oninit': function({ 'attrs': { store, provider }}){
        this.component = provider.component(store);
    },
    'view': ({ state, attrs }) => mithril(
        'div',
        [
            mithril(
                state.component
            )
        ]
    )
});

export const anchor_group = (mithril) => ({
    'oninit': function({ 'attrs': { provider }}){
        const stores = {};
        this.attributes = (id, store) => ({
                provider,
                'store': stores.hasOwnProperty(id)
                    ? stores[id]
                    : stores[id] = Store.child_store(id, store)
            })
        ;
    },
    'view': ({ 'state': { attributes }, 'attrs': { store, provider, filterFn = () => true, wrapper = null }}) =>
        store.getState().children
            .filter((child_state) => filterFn(child_state))
            .map(
                ({id}) => wrapper !== null
                    ? mithril(wrapper, {'key': id}, [mithril(provider.Anchor, attributes(id, store))])
                    : mithril(provider.Anchor, attributes(id, store))
            )
});

export const component = (filter_resource) => (item) => (next) => (store = null) => {
        const next_component = next(store);
        if(store === null || filter_resource !== store.getState().resource) return next_component;

        const { resource } = store.getState();
        return filter_resource === resource
            ? item
            : next_component;
};

export const dispatcher = (store) => (action_creator) => (event = {}) => {
    event.id = store.id;
    event.resource = store.resource;
    event.redraw = false;
    event.result = store.dispatch(
        action_creator(store)({
            event,
            'state': store.getState()
        })
    );
    return event;
};

export const controller = (filter_resource) => (provider, action_creator = null) => (next) => (store) => {
    // console.log(filter_resource, provider, action_creator, next, store);
    const next_component = next(store);
    if(store === null || filter_resource !== store.getState().resource) return next_component;

    const { oninit = null } = next_component;

    return {
        ...next_component,
        'oninit': function(vnode){
            this.provider = provider;
            this.store = store instanceof Store
                ? store
                : new Store({ store, 'resource': filter_resource });

            if(action_creator !== null){
                this.action = action_collection(
                    action_creator,
                    dispatcher(store)
                );
            }
            if(oninit !== null) oninit.call(this, vnode);
        }
    };
};
