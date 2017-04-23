import m from 'mithril';
import { resource, inject, namespace } from 'Core/DependencyInjection/decorators';

@resource('ManagedNamedAnchorGroup')
@inject(['containerManager', 'ManagedAnchorGroup'])
@namespace('Core.Ux')
export class ManagedNamedAnchorGroup {
    constructor({ containerManager, ManagedAnchorGroup }){
        this.containerManager = containerManager;
        this.AnchorGroup = ManagedAnchorGroup;
    }
    component(){
        let AnchorGroup = this.AnchorGroup;
        return {
            'view': (vnode) => {
                let attrs = Object.assign(
                    { 'filterFn': (module) => module.name === vnode.attrs.name },
                    vnode.attrs
                );
                return m(AnchorGroup, attrs);
            }
        };
    }
}

export default ManagedNamedAnchorGroup;
