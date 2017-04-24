export class Blueprint {
    constructor({ id, controller, reducerProvider }){
        this.id = id;
        this.controller = controller;
        this.reducerProvider = reducerProvider;
    }

    /**
     * @param container
     * @param view
     * @returns {{}}
     */
    createComponent({ container, view }){
        let component = {},
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

    getId(){
        return this.id;
    }
}

export default Blueprint;
