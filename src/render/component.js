import { Store } from '../state';

export class Component {
    static anchor(mithril){
        const component = Symbol('component');
        return {
            'oninit': function({ 'attrs': { id, viewset_override = false } }){
                const store = Store.child_store(id, this.store);
                const viewset = viewset_override === false
                    ? this.viewset
                    : viewset_override;

                this[component] = this.provider.component({ store, viewset });
            },
            'view': ({ state, attrs: { consumer_args = {} } }) => mithril(
                state[component],
                { 'from_anchor': consumer_args }
            )
        };
    }

    static anchor_group(mithril){
        return {
            'view': ({state, 'attrs': { filterFn = () => true, wrapper = null, viewset_override = false, consumer_args = {} }}) =>
                state.store.getState().children
                    .filter((child_state) => filterFn(child_state))
                    .map(
                        ({id}) => wrapper !== null
                            ? mithril(
                                wrapper,
                                {'key': id},
                                mithril(
                                    state.Anchor,
                                    { id, viewset_override, consumer_args }
                                )
                            )
                            : mithril(
                                state.Anchor,
                                {'key': id, id, viewset_override, consumer_args }
                            )
                    )
        };
    }

    static not_found(mithril){
        return {
            'view': () => mithril('h1', 'Resource not found')
        };
    }
}
