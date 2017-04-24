import { Blueprint } from './Blueprint';
import { ReduceHandler } from './ReduceHandler';

export class BlueprintFactory {
    constructor(
        {
            blueprintRepository,
            containerRepository,
            viewRepository,
            containerFactory,
            viewSetManager
        }){
            this.blueprintRepository = blueprintRepository;
            this.containerFactory = containerFactory;
            this.containerRepository = containerRepository;
            this.viewRepository = viewRepository;
            this.viewSetManager = viewSetManager;
    }
    createBlueprint({ id, controller, dataReducer }){
        let reducerProvider = this.createReducerProvider({ dataReducer });
        return new Blueprint({
            id,
            controller,
            reducerProvider,
            'viewProvider': this.createViewProvider(id),
            'viewSetManager': this.viewSetManager
        });
    }
    createViewProvider(id){
        return () => {
            return this.viewRepository.get(id);
        };
    }
    createReducerProvider({ dataReducer }){
        return ({ container }) => {
            let delegateReducer = this.createDelegateReducer({ container });
            return (state = { 'modules': [], 'data': {} }, action = null) => {
                let allow = ReduceHandler.allowReduce({ state, action });
                return {
                    'id': state.id || container.getId(), //tweak to give an id to root module
                    'name': state.name,
                    'resource': state.resource,
                    'data': allow && dataReducer
                        ? dataReducer(state.data, action)
                        : state.data,
                    'modules': delegateReducer({
                        'state': allow
                            ? ReduceHandler.modulesReduce({'state': state.modules, action})
                            : state.modules,
                        action
                    })
                };
            };
        };
    }
    createDelegateReducer({ container }){
        return ({ state = [], action = null }) => {
            return state.map((moduleState) => {
                let { resource = null, id = null } = moduleState;
                if(!resource)
                    return moduleState;

                let subContainer = this.containerRepository.get(id);
                if(subContainer === null){
                    let blueprint = this.blueprintRepository.get(resource);
                    subContainer = this.containerFactory.createSubContainer({
                        blueprint,
                        'parent': container
                    });
                    this.containerRepository.set(subContainer);
                    moduleState.id = subContainer.getId();
                }

                if (ReduceHandler.allowPropagation({ 'state': moduleState, action }))
                    return subContainer.getReducer()(moduleState, action);

                return moduleState;
            });
        };
    }
}
