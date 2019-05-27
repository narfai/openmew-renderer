import { Store } from '../state';

export class Component {
    static anchor(mithril){
        const component = Symbol('component');
        return {
            'oninit': function({ 'attrs': { store, provider, viewset = null }}){
                this[component] = provider.component({ store, viewset });
            },
            'view': ({ state }) => mithril(
                'div',
                [
                    mithril(
                        state[component]
                    )
                ]
            )
        };
    }

    static anchor_group(mithril){
        const attributes = Symbol('attributes');
        return {
            'oninit': function({ 'attrs': { provider, viewset = null }}){
                const stores = {};
                this[attributes] = (id, store) => ({
                    provider,
                    viewset,
                    'store': stores.hasOwnProperty(id)
                        ? stores[id]
                        : stores[id] = Store.child_store(id, store)
                });
            },
            'view': ({ state, 'attrs': { store, provider, filterFn = () => true, wrapper = null }}) =>
                store.getState().children
                    .filter((child_state) => filterFn(child_state))
                    .map(
                        ({id}) => wrapper !== null
                            ? mithril(wrapper, {'key': id}, [mithril(provider.Anchor, state[attributes](id, store))])
                            : mithril(provider.Anchor, state[attributes](id, store))
                    )
        };
    }
}
