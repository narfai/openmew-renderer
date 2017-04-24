export class ViewRepository {
    constructor(){
        this.views = {};
    }
    set(view){
        if(typeof this.views[view.getId()] !== 'undefined')
            throw new Error('view #' + view.getId() + ' already defined');
        this.views[view.getId()] = view;
    }
    get(id){
        if(typeof this.views[id] === 'undefined')
            throw new Error('view #' + id + ' does not exists');
        return this.views[id];
    }
}

export default ViewRepository;
