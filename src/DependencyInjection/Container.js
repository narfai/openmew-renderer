let pResources = Symbol('resources');
let pInstances = Symbol('instances');
let pArguments = Symbol('arguments');

export class Container {
    constructor(){
        this[pResources] = [];
        this[pInstances] = {};
        this[pArguments] = new WeakMap();
    }
    static resourceSymbol(){
        return Symbol.for('DependencyInjection.$resource');
    }
    static injectSymbol(){
        return Symbol.for('DependencyInjection.$inject');
    }
    static namespaceSymbol(){
        return Symbol.for('DependencyInjection.$namespace');
    }
    static resolveNamespace(Resource){
        if(typeof Resource[Container.namespaceSymbol()] !== 'undefined')
            return Resource[Container.namespaceSymbol()];
        return null;
    }
    static resolveInjection(resourceId, namespace){
        let alias = null;
        if(Array.isArray(resourceId)){
            alias = resourceId[1];
            resourceId = resourceId[0];
        }
        if(resourceId.indexOf('.') === -1){
            alias = resourceId;
            if(namespace !== null)
                resourceId = namespace + '.' + resourceId;
        } else if(alias === null){
            let splitted = resourceId.split('.');
            alias = splitted[splitted.length - 1];
        }
        return {
            alias,
            'id': resourceId
        };
    }
    static resolve(Resource){
        let namespace = Container.resolveNamespace(Resource);
        return (namespace? namespace + '.' : '') + Resource[Container.resourceSymbol()];
    }
    register(ResourceObject, ...args){
        if(typeof ResourceObject[Container.resourceSymbol()] === 'undefined')
            throw new Error('Resource cannot be registered : please specify @resource');
        if(typeof this[pResources].find((res) => Container.resolve(res) === Container.resolve(ResourceObject)) !== 'undefined')
            throw new Error('@resource('+ResourceObject[Container.resourceSymbol()]+') already registered');
        this[pResources].push(ResourceObject);
        this[pArguments].set(ResourceObject, ...args);
    }
    get(targetId, parents = []){
        let Resource = this[pResources].find((res) => Container.resolve(res) === targetId);
        if(typeof Resource === 'undefined')
            throw new Error('No such resource ' + targetId);

        let fullId = Container.resolve(Resource),
            namespace = Container.resolveNamespace(Resource);
        if(typeof this[pInstances][fullId] === 'undefined'){
            let injected = {},
                injectSymbol = Container.injectSymbol();
            if(typeof Resource[injectSymbol] !== 'undefined'){
                parents.push(fullId);
                Resource[injectSymbol].forEach((resourceId) => {
                    let {alias, id} = Container.resolveInjection(resourceId, namespace);

                    if(typeof parents.find((pResId) => pResId === id) !== 'undefined')
                        throw new Error('Dependency recursion detected : ' + id + ' needs himself');

                    injected[alias] = this.get(id, parents);
                });
            }
            let args = this[pArguments].get(Resource);
            this[pInstances][fullId] = new Resource(injected, args);
        }
        return this[pInstances][fullId];
    }
}
export default Container;
