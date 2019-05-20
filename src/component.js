import m from "mithril";


export function component_creator({ registry, view = null, controller = null }){
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
