export class BlueprintRepository {
    constructor(){
        this.blueprints = {};
    }
    set(blueprint){
        if(typeof this.blueprints[blueprint.getId()] !== 'undefined')
            throw new Error('blueprint  #' + blueprint.getId() + ' already set');
        this.blueprints[blueprint.getId()] = blueprint;
    }
    get(id){
        if(typeof this.blueprints[id] === 'undefined')
            throw new Error('No such blueprint ' + id);
        return this.blueprints[id];
    }
}

export default BlueprintRepository;
