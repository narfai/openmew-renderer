export class Blueprint {
    constructor({ containerManager, userInterfaceManager, renderManager }){
        this.containerManager = containerManager;
        this.userInterfaceManager = userInterfaceManager;
        this.renderManager = renderManager;
    }

    controller(/*{ vm, container }*/){
    }

    reducer(/*{ container }*/){
        return (state/*, action*/) => state;
    }

    render({ container, vm, vnode, resource }){
        return this.renderManager.render({
            resource,
            container,
            vm,
            vnode
        });
    }

    getReducer({ container }){
        return this.containerManager.getModuleReducer({
            'dataReduce': this.reducer({ container }),
            container
        });
    }

    getComponent({ container }){
        let component = {};
        component.view = (vm, vnode) => this.render({ vm, vnode, container });
        let self = this;
        component.oninit = function(){
            self.controller({ 'vm': this, container });
        };
        return component;
    }
}

export default Blueprint;
