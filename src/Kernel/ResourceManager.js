let pResources = Symbol('resources');

export class ResourceManager {
    constructor(){
        this[pResources] = {};
    }

    getResources(resources, Check = null){
        let dependencies = {};
        resources.forEach((resource) => {
            dependencies[resource] = this.getResource(resource, Check);
        });
        return dependencies;
    }
    getResource(resource, Check = null){
        if(typeof this[pResources][resource] === 'undefined')
            throw new Error('Invalid dependency resource : ' + resource);

        if(Check !== null){
            if (!(this[pResources][resource] instanceof Check))
                throw new Error('Resource does not implements expected class ', Check.toString());
        }
        return this[pResources][resource];
    }
    service(Service, method = null){
        if(typeof Service.describe !== 'function')
            throw new Error('Invalid service : please implements describe static method');

        let { resource, depends = [] } = Service.describe();

        if(!resource)
            throw new Error('Invalid service description : ', Service.describe());

        if(typeof this[pResources][resource] !== 'undefined')
            throw new Error('This service is already registered : ', Service);

        let service = new Service(this.getResources(depends));

        if(method !== null){
            if(typeof service[method] !== 'function')
                throw new Error('Unable to craft service from method ' + method);
            service = service[method]();
        }

        this[pResources][resource] = service;
        return service;
    }
    plain(resource, object){
        if(typeof this[pResources][resource] !== 'undefined')
            throw new Error('This service is already registered : ', resource);
        this[pResources][resource] = object;
    }
    list(){
        return Object.keys(this[pResources]);
    }
    has(resource){
        return (typeof this[pResources][resource] !== 'undefined');
    }
    delete(resource){
        if(typeof this[pResources][resource] === 'undefined')
            throw new Error('Invalid dependency resource : ' + resource);
        delete this[pResources][resource];
    }
    clear(){
        Object
            .keys(this[pResources])
            .forEach((resource) => {
                delete this[pResources][resource];
            });
        this[pResources] = {};
    }
}
export default ResourceManager;
