export class ViewRepository {
    constructor({ viewSetManager }){
        this.viewSetManager = viewSetManager;
        this.views = {};
    }
    resolve(view){
        return view.getViewSet() + '.' + view.getId();
    }
    resolveId(id){
        return this.viewSetManager.getCurrent() + '.' + id;
    }
    set(view){
        let id = this.resolve(view);
        if(typeof this.views[id] !== 'undefined')
            throw new Error('view #' + id + ' already defined');
        this.views[id] = view;
    }
    get(id){
        let fullId = this.resolveId(id);
        if(typeof this.views[fullId] === 'undefined')
            throw new Error('view #' + fullId + ' does not exists');
        return this.views[fullId];
    }
}

export default ViewRepository;
