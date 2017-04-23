import m from 'mithril';

import { resource, inject, namespace } from 'Core/Kernel/DependencyInjection/decorators';

@resource('ManagedAnchor')
@inject(['containerManager'])
@namespace('Core.Ux')
export class ManagedAnchor {
    constructor({ containerManager }){
        this.containerManager = containerManager;
    }
    component(){
        return {
            'view': (vnode) => {
                let { id } = vnode.attrs;
                let attrs = Object.assign({}, vnode.attrs);
                return m(this.containerManager.getComponent({'id': id}), attrs);
            }
        };
    }
}

export default ManagedAnchor;
