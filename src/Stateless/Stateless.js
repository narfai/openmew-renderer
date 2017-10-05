/*
 This Source Code Form is subject to the terms of the Mozilla Public
 License, v. 2.0. If a copy of the MPL was not distributed with this
 file, You can obtain one at http://mozilla.org/MPL/2.0/.

 Copyright (C) 2017 François Cadeillan <francois@azsystem.fr>
 */

export class Stateless {
    constructor({ id, component }){
        this.id = id;
        this.component = component;
    }
    getId(){
        return this.id;
    }
    getComponent(){
        return this.component;
    }
}
