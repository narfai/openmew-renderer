/*
 This Source Code Form is subject to the terms of the Mozilla Public
 License, v. 2.0. If a copy of the MPL was not distributed with this
 file, You can obtain one at http://mozilla.org/MPL/2.0/.

 Copyright (C) 2017 François Cadeillan <francois@azsystem.fr>
 */

import { View } from './View';

export class ViewFactory {
    constructor({ statelessRepository }){
        this.statelessRepository = statelessRepository;
    }
    createView({ id, viewset, render, 'depends': { stateless = [], state = [] }}){
        let statelesses = this.getStatelessesComponents({ 'statelessDepends': stateless });
        return new View({
            id,
            viewset,
            render,
            'stateDepends': state,
            statelesses
        });
    }
    getStatelessesComponents({ statelessDepends }){
        let statelesses = {};
        statelessDepends.forEach((statelessId) => {
            statelesses[statelessId] = this.statelessRepository.get(statelessId).getComponent();
        });
        return statelesses;
    }
}

export default View;
