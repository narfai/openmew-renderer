/*
 This Source Code Form is subject to the terms of the Mozilla Public
 License, v. 2.0. If a copy of the MPL was not distributed with this
 file, You can obtain one at http://mozilla.org/MPL/2.0/.

 Copyright (C) 2017 François Cadeillan <francois@azsystem.fr>
 */

import { Stateless } from './Stateless';

export class StatelessFactory {
    constructor({ containerRepository, statelessRepository }){
        this.containerRepository = containerRepository;
        this.statelessRepository = statelessRepository;
    }
    createStateless({ id, component }){
        return new Stateless({
            id,
            'component': component({
                'containerRepository': this.containerRepository,
                'statelessRepository': this.statelessRepository
            })
        });
    }
}
