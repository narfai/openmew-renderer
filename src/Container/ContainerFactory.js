/*
 This Source Code Form is subject to the terms of the Mozilla Public
 License, v. 2.0. If a copy of the MPL was not distributed with this
 file, You can obtain one at http://mozilla.org/MPL/2.0/.

 Copyright (C) 2017 François Cadeillan <francois@azsystem.fr>
 */

import { Container } from './Container';
import { SubStoreProvider } from './../StoreProviders';

export class ContainerFactory {
    constructor(){
        this.id = 0;
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
        let provider = this.createSubProvider({
            id,
            'parent': parent.getProvider(),
            'key': 'modules',
            'discriminator': 'id'
        });
        return this.createContainer({ blueprint, provider, 'chain': parent.getChain(), id });
    }
    createSubProvider({ id, parent, key, discriminator }){
        return new SubStoreProvider(
            parent,
            (s) => s[key].find(({ [discriminator]: stateId }) => stateId === id),
            id
        );
    }

}

export default ContainerFactory;
