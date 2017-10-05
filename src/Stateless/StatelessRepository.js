/*
 This Source Code Form is subject to the terms of the Mozilla Public
 License, v. 2.0. If a copy of the MPL was not distributed with this
 file, You can obtain one at http://mozilla.org/MPL/2.0/.

 Copyright (C) 2017 François Cadeillan <francois@azsystem.fr>
 */

export class StatelessRepository {
    constructor(){
        this.statelesses = {};
    }
    set(stateless){
        if(typeof this.statelesses[stateless.getId()] !== 'undefined')
            throw new Error('stateless #' + stateless.getId() + ' already defined');
        this.statelesses[stateless.getId()] = stateless;
    }
    get(id){
        if(typeof this.statelesses[id] === 'undefined')
            throw new Error('stateless #' + id + ' does not exists');
        return this.statelesses[id];
    }
}
