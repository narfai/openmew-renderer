import { Store } from './state';

export const anchor = (mithril) => ({
    'oninit': function({ 'attrs': { store, provider }}){
        this.component = provider.component(store);
    },
    'view': (vnode) => {
        return mithril(
            'div',
            [
                mithril('h1', 'ANCHOR'),
                mithril(vnode.state.component)
            ]
        );
    }
});

export const anchor_group = (mithril) => ({
    'oninit': function({ 'attrs': { provider }}){
        const stores = {};
        this.attributes = (id, store) => {
            return ({
                provider,
                'store': stores.hasOwnProperty(id)
                    ? stores[id]
                    : stores[id] = Store.child_store(id, store)
            });
        };
    },
    'view': ({ 'state': { attributes }, 'attrs': { store, provider, filterFn = () => true, wrapper = null }}) => {
        return store.getState().children
            .filter((child_state) => filterFn(child_state))
            .map(({id}) => wrapper !== null
                ? mithril(wrapper, {'key': id}, [mithril(provider.Anchor, attributes(id, store))])
                : mithril(provider.Anchor, attributes(id, store))
            );
    }
});


export const component_transducer = (filter_resource) => (item) => (next) => (store = null) => {
        const next_component = next(store);
        if(store === null || filter_resource !== store.getState().resource) return next_component;

        const { resource } = store.getState();
        return filter_resource === resource
            ? item
            : next_component;
    }
;

export const controller_transducer = (filter_resource) => (provider, action_creators = null) => (next) => (store) => {
    const next_component = next(store);
    if(store === null || filter_resource !== store.getState().resource) return next_component;

    const { oninit = null } = next_component;

    return {
        ...next_component,
        'oninit': function(vnode){
            this.provider = provider;
            this.store = store instanceof Store
                ? store
                : new Store({ store });

            if(oninit !== null) oninit.call(this, vnode);
        }
    };
};
