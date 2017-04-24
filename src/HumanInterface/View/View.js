const pRender = Symbol('render'),
      pStatelesses = Symbol('statelesses'),
      pStateDepends = Symbol('stateDepends');

export class View {
    constructor({ id, render, stateDepends, statelesses, viewset = 'default' }){
        this[pRender] = render;
        this[pStateDepends] = stateDepends;
        this[pStatelesses] = statelesses;
        this.id = id;
        this.viewset = viewset;
    }
    getId(){
        return this.id;
    }
    getViewSet(){
       return this.viewset;
    }
    render({ container, vm, vnode }){
        let id = container.getId(),
            state = container.getState(),
            actions = container.getActions(),
            depends = this[pStateDepends];
        return this[pRender](
            { id, actions, container, vm, vnode },
            View.extractDepends({ state, depends }),
            this[pStatelesses]
        );
    }
    static extractDepends({ state, depends }){
        let viewState = {};
        depends.forEach((depend) => {
            if(state.hasOwnProperty(depend))
                viewState[depend] = state[depend];
            else if(state.data.hasOwnProperty(depend))
                viewState[depend] = state.data[depend];
        });
        return viewState;
    }
}

export default View;
