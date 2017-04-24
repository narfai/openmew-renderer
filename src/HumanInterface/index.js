import { ViewHandler } from './View/ViewHandler';

import { BlueprintFactory } from './Blueprint/BlueprintFactory';
import { BlueprintRepository } from './Blueprint/BlueprintRepository';

import { ContainerFactory } from './Container/ContainerFactory';
import { ContainerRepository } from './Container/ContainerRepository';

import { ViewFactory } from './View/ViewFactory';
import { ViewRepository } from './View/ViewRepository';

import { StatelessRepository } from './Stateless/StatelessRepository';
import { StatelessFactory } from './Stateless/StatelessFactory';

import { ProviderManager } from './Provider/ProviderManager';

export class HumanInterface {
    constructor({ data = {} }){
        this.providerManager = new ProviderManager({ data });

        this.statelessRepository = new StatelessRepository();
        this.viewRepository = new ViewRepository();
        this.blueprintRepository = new BlueprintRepository();
        this.containerRepository = new ContainerRepository();

        this.viewFactory = new ViewFactory({
            'statelessRepository': this.statelessRepository
        });

        this.statelessFactory = new StatelessFactory({
            'containerRepository': this.containerRepository,
            'statelessRepository': this.statelessRepository
        });

        this.containerFactory = new ContainerFactory({
            'viewRepository': this.viewRepository,
            'providerManager': this.providerManager
        });

        this.blueprintFactory = new BlueprintFactory({
            'blueprintRepository': this.blueprintRepository,
            'containerRepository': this.containerRepository,
            'containerFactory': this.containerFactory,
        });
    }
    registerView({ id, render, dataDepends, statelessDepends }){
        let view = this.viewFactory.createView({ id, render, dataDepends, statelessDepends });
        this.viewRepository.set(view);
    }
    registerStateless({ id, component }){
        let stateless = this.statelessFactory.createStateless({ id, component });
        this.statelessRepository.set(stateless);
    }
    registerBlueprint({ id, controller, dataReducer }){
        let blueprint = this.blueprintFactory.createBlueprint({ id, controller, dataReducer });
        this.blueprintRepository.set(blueprint);
    }
    mount({ id, element }){
        let provider = this.providerManager.getProvider(),
            blueprint = this.blueprintRepository.get(id),
            view = this.viewRepository.get(blueprint.getId());
        let container = this.containerFactory.createContainer({
            blueprint,
            provider,
            view
        });
        this.containerRepository.set(container);
        let reducer = container.getReducer();
        this.providerManager.replaceReducer({ reducer });

        let component = container.getComponent();
        ViewHandler.mount({ element, component });
        provider.subscribe(ViewHandler.redraw);
    }
}

export default HumanInterface;
