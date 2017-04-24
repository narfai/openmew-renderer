export class Stateless {
    constructor({ id, component }){
        this.id = id;
        this.component = component;
    }
    getId(){
        return this.id;
    }
    getComponent(){
        return this.component;
    }
}
