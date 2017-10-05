/*
 This Source Code Form is subject to the terms of the Mozilla Public
 License, v. 2.0. If a copy of the MPL was not distributed with this
 file, You can obtain one at http://mozilla.org/MPL/2.0/.

 Copyright (C) 2017 François Cadeillan <francois@azsystem.fr>
 */

export class ViewRepository {
    constructor({ viewSetManager }){
        this.viewSetManager = viewSetManager;
        this.views = {};
    }
    resolve(view){
        return view.getViewSet() + '.' + view.getId();
    }
    resolveId(id){
        return this.viewSetManager.getCurrent() + '.' + id;
    }
    set(view){
        let id = this.resolve(view);
        if(typeof this.views[id] !== 'undefined')
            throw new Error('view #' + id + ' already defined');
        this.views[id] = view;
    }
    get(id){
        let fullId = this.resolveId(id);
        if(typeof this.views[fullId] === 'undefined')
            throw new Error('view #' + fullId + ' does not exists');
        return this.views[fullId];
    }
}

export default ViewRepository;
