export class Blueprint {
    constructor({ id, controller, reducerProvider, viewProvider, viewSetManager }){
        this.id = id;
        this.controller = controller;
        this.reducerProvider = reducerProvider;
        this.viewProvider = viewProvider;
        this.viewSetManager = viewSetManager;
    }

    /**
     * @param container
     * @param view
     * @returns {{}}
     */
    createComponent({ container }){
        let component = {},
            view = this.viewProvider(this.id),
            self = this;

        component.view = function(vnode){
            return view.render({ 'vm': this, vnode, container });
        };
        component.oninit = function(){
            self.controller({ 'vm': this, container });
        };
        return component;
    }
    createReducer({ container }){
        return this.reducerProvider({ container });
    }

    getViewSetManager(){
        return this.viewSetManager;
    }

    getId(){
        return this.id;
    }
}

export default Blueprint;
