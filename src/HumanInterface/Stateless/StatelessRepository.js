export class StatelessRepository {
    constructor(){
        this.statelesses = {};
    }
    set(stateless){
        if(typeof this.statelesses[stateless.getId()] !== 'undefined')
            throw new Error('stateless #' + stateless.getId() + ' already defined');
        this.statelesses[stateless.getId()] = stateless;
    }
    get(id){
        if(typeof this.statelesses[id] === 'undefined')
            throw new Error('stateless #' + id + ' does not exists');
        return this.statelesses[id];
    }
}
