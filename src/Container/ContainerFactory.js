/*
 This Source Code Form is subject to the terms of the Mozilla Public
 License, v. 2.0. If a copy of the MPL was not distributed with this
 file, You can obtain one at http://mozilla.org/MPL/2.0/.

 Copyright (C) 2017 François Cadeillan <francois@azsystem.fr>
 */

import { Container } from './Container';

export class ContainerFactory {
    constructor({ providerManager }){
        this.id = 0;
        this.providerManager = providerManager;
    }
    createContainer({ blueprint, provider, chain = [], id }){
        id = id || ++this.id;
        chain = [ ...chain, id];
        let container = new Container({
            id,
            provider,
            chain,
            blueprint
        });
        container.warmup();
        return container;
    }
    createSubContainer({ blueprint, parent }){
        let id = ++this.id;
        let provider = this.providerManager.createSubProvider({
            id,
            'parent': parent.getProvider(),
            'key': 'modules',
            'discriminator': 'id'
        });
        return this.createContainer({ blueprint, provider, 'chain': parent.getChain(), id });
    }

}

export default ContainerFactory;
