import { ViewHandler } from '../View/ViewHandler';

export class ContainerRepository {
    constructor(){
        this.containers = {};
    }
    set(container){
        if(typeof this.containers[container.getId()] !== 'undefined')
            throw new Error('container #'+ container.getId() + ' already set');
        this.containers[container.getId()] = container;
    }
    get(id){
        if(typeof this.containers[id] === 'undefined')
            return null;
        return this.containers[id];
    }
    getAll(){
        return Object.keys(this.containers).map((key) => this.containers[key]);
    }
    getComponent({ id }){
        let container = this.getContainer({ id });
        if(!container)
            return { 'view': ViewHandler.createDummyView() };
        return container.component;
    }
    getComponentByName({ name, container }){
        let { modules } = container.provider.getState();

        let moduleState = modules.find(({ ['name']: moduleName }) => moduleName === name);
        if(!moduleState)
            return {'view': ViewHandler.createDummyView()};

        return this.getComponent({ 'id': moduleState.id });
    }
}

export default ContainerRepository;
