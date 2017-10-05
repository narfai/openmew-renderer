/*
 This Source Code Form is subject to the terms of the Mozilla Public
 License, v. 2.0. If a copy of the MPL was not distributed with this
 file, You can obtain one at http://mozilla.org/MPL/2.0/.

 Copyright (C) 2017 François Cadeillan <francois@azsystem.fr>
 */

export class BlueprintRepository {
    constructor(){
        this.blueprints = {};
    }
    set(blueprint){
        if(typeof this.blueprints[blueprint.getId()] !== 'undefined')
            throw new Error('blueprint  #' + blueprint.getId() + ' already set');
        this.blueprints[blueprint.getId()] = blueprint;
    }
    get(id){
        if(typeof this.blueprints[id] === 'undefined')
            throw new Error('No such blueprint ' + id);
        return this.blueprints[id];
    }
}

export default BlueprintRepository;
