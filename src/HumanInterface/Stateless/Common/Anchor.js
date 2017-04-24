import { ViewHandler } from 'Core/HumanInterface/View/ViewHandler';

export const Anchor = {
    'id': 'Anchor',
    'component': ({ containerRepository }) => {
        return {
            'view': (vnode) => {
                let {id} = vnode.attrs;
                let attributes = Object.assign({}, vnode.attrs),
                    container = containerRepository.get(id);
                if(container === null)
                    return ViewHandler.createDummyElement();

                let component = container.getComponent();
                return ViewHandler.component({
                    component,
                    attributes
                });
            }
        };
    }
};
export default Anchor;
