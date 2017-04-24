import { ViewHandler } from 'Core/HumanInterface/View/ViewHandler';

export const NamedAnchorGroup = {
    'id': 'NamedAnchorGroup',
    'component': ({ statelessRepository }) => {
        let AnchorGroup = statelessRepository.get('AnchorGroup').getComponent();
        return {
            'view': (vnode) => {
                let attributes = Object.assign(
                    { 'filterFn': (module) => module.name === vnode.attrs.name },
                    vnode.attrs
                );
                return ViewHandler.component({
                    'component': AnchorGroup,
                    attributes
                });
            }
        };
    }
};

export default NamedAnchorGroup;
