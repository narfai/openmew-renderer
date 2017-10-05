/*
 This Source Code Form is subject to the terms of the Mozilla Public
 License, v. 2.0. If a copy of the MPL was not distributed with this
 file, You can obtain one at http://mozilla.org/MPL/2.0/.

 Copyright (C) 2017 François Cadeillan <francois@azsystem.fr>
 */

import { ViewHandler } from './View/ViewHandler';

import { BlueprintFactory } from './Blueprint/BlueprintFactory';
import { BlueprintRepository } from './Blueprint/BlueprintRepository';

import { ContainerFactory } from './Container/ContainerFactory';
import { ContainerRepository } from './Container/ContainerRepository';

import { ViewFactory } from './View/ViewFactory';
import { ViewSetManager } from './View/ViewSetManager';
import { ViewRepository } from './View/ViewRepository';

import { StatelessRepository } from './Stateless/StatelessRepository';
import { StatelessFactory } from './Stateless/StatelessFactory';

import { ProviderManager } from './Provider/ProviderManager';

import { ReduceHandler } from './Blueprint/ReduceHandler';

export class HumanInterface {
    constructor(data){
        //TODO implement dependency injections, promise and / or events by replacing callbacks
        //TODO prepare io interaction
        //TODO add comment and documentation
        //TODO maybe extract a reducerManager and a renderManager
        //TODO find a way to more split coupling ( maybe be less flat / more hierarchic dependency tree )
        //TODO find what we could use separately
        //TODO enhance action system to provide system wide action collection
        //TODO provide a way to execute some code on container initialization only
        //TODO replace ADD_MODULE by PREPREND_MODULE and APPEND_MODULE
        this.providerManager = new ProviderManager({ data });

        this.viewSetManager = new ViewSetManager({ 'current': 'default '});
        this.statelessRepository = new StatelessRepository();
        this.viewRepository = new ViewRepository({ 'viewSetManager': this.viewSetManager });
        this.blueprintRepository = new BlueprintRepository();
        this.containerRepository = new ContainerRepository();


        this.viewFactory = new ViewFactory({ 'statelessRepository': this.statelessRepository });

        this.statelessFactory = new StatelessFactory({
            'containerRepository': this.containerRepository,
            'statelessRepository': this.statelessRepository
        });

        this.containerFactory = new ContainerFactory({ 'providerManager': this.providerManager });

        this.blueprintFactory = new BlueprintFactory({
            'blueprintRepository': this.blueprintRepository,
            'containerRepository': this.containerRepository,
            'containerFactory': this.containerFactory,
            'viewRepository': this.viewRepository,
            'viewSetManager': this.viewSetManager
        });
    }
    registerViewSet({ viewset, views}){
        this.viewSetManager.registerViewSet({ viewset });
        views.forEach((part) => {
            part.viewset = viewset;
            this.registerView(part);
        });
        this.viewSetManager.setCurrent({ viewset });
    }
    registerView({ id, render, depends, viewset }){
        let view = this.viewFactory.createView({
            id,
            viewset,
            render,
            depends
        });
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
    subscribe(onContainerChange){
        this.providerManager.getProvider().localSubscribe(({ id, action }) => {
            let container = this.containerRepository.get(id);
            if(container !== null){
                let state = container.getState();
                if(ReduceHandler.allowReduce({ state, action }))
                    onContainerChange({ container, action });
            }
        });
    }
    setDefaultUi({ viewset }){
        this.viewSetManager.setCurrent({ viewset });
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

        let component = {
            'view': () => {
                return ViewHandler.component({ 'component': container.getComponent() });
            }
        };

        ViewHandler.mount({ element, component });
        provider.subscribe(ViewHandler.redraw);
    }
}

export default HumanInterface;