export class ViewSetManager {
    constructor({ current = 'default' }){
        this.current = current;
        this.viewSets = [];
    }
    getCurrent(){
        return this.current;
    }
    registerViewSet({ viewset }){
        this.viewSets.push(viewset);
    }
    setCurrent({ viewset }){
        if(this.viewSets.indexOf(viewset) === -1)
            throw new Error('ViewSet #' + viewset + ' is not available');
        this.current = viewset;
    }
    getViewSets(){
        return this.viewSets;
    }
}

export default ViewSetManager;
