import m from 'mithril';
import Container from '../Container/Container.js';

import { resource, inject, namespace } from 'Core/Kernel/DependencyInjection/decorators';

@resource('ManagedAnchorGroup')
@inject(['containerManager', 'ManagedAnchor'])
@namespace('Core.Ux')
export class ManagedAnchorGroup {
    constructor({ containerManager, ManagedAnchor }){
        this.containerManager = containerManager;
        this.Anchor = ManagedAnchor;
    }
    component(){
        return {
            'view': (vnode) => {
                let { id, wrapper = null, filterFn = () => true } = vnode.attrs;
                let container = this.containerManager.getContainer({ id });
                if(typeof container === 'undefined' || !(container instanceof Container))
                    return m('#');

                let { modules = [] } = container.getState();
                let Anchor = this.Anchor; //eslint-disable-line no-unused-vars
                return modules
                    .filter(filterFn)
                    .map((module) => {
                            let attrs = Object.assign({}, vnode.attrs);
                            attrs.id = module.id;
                            attrs.key = module.id;
                            return wrapper
                                ? m(wrapper, {'key': module.id}, [ m(Anchor, attrs) ])
                                : m(Anchor, attrs);
                        }
                    );
            }
        };
    }
    static describe(){
        return {
            'resource': 'AnchorGroup',
            'depends': [ 'containerManager', 'Anchor' ]
        };
    }
}

export default ManagedAnchorGroup;
