const pRender = Symbol('render'),
      pId = Symbol('id'),
      pStatelesses = Symbol('statelesses'),
      pDependsProvider = Symbol('dependsProvider');

export class View {
    constructor({ id, render, dependsProvider, statelesses }){
        this[pId] = id;
        this[pRender] = render;
        this[pDependsProvider] = dependsProvider;
        this[pStatelesses] = statelesses;
    }
    getId(){
        return this[pId];
    }
    render({ container, vm, vnode }){
        let id = container.getId(),
            state = container.getState(),
            actions = container.getActions();
        return this[pRender](
            { id, actions, container, vm, vnode },
            this[pDependsProvider]({ state }),
            this[pStatelesses]
        );
    }
}

export default View;
