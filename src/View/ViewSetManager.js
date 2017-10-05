/*
 This Source Code Form is subject to the terms of the Mozilla Public
 License, v. 2.0. If a copy of the MPL was not distributed with this
 file, You can obtain one at http://mozilla.org/MPL/2.0/.

 Copyright (C) 2017 François Cadeillan <francois@azsystem.fr>
 */

export class ViewSetManager {
    constructor({ current = 'default' }){
        this.current = current;
        this.viewSets = [];
    }
    getCurrent(){
        return this.current;
    }
    registerViewSet({ viewset }){
        this.viewSets.push(viewset);
    }
    setCurrent({ viewset }){
        if(this.viewSets.indexOf(viewset) === -1)
            throw new Error('ViewSet #' + viewset + ' is not available');
        this.current = viewset;
    }
    getViewSets(){
        return this.viewSets;
    }
}

export default ViewSetManager;
