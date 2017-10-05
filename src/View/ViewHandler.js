/*
 This Source Code Form is subject to the terms of the Mozilla Public
 License, v. 2.0. If a copy of the MPL was not distributed with this
 file, You can obtain one at http://mozilla.org/MPL/2.0/.

 Copyright (C) 2017 François Cadeillan <francois@azsystem.fr>
 */

import m from 'mithril';

export class ViewHandler {
    static createDummyView(){
        return () => ViewHandler.createDummyElement();
    }
    static createDummyElement(){
        return m('#');
    }
    static redraw(){
        m.redraw();
    }
    static mount({ element, component }){
        m.mount(element, component);
    }
    static component({ component, attributes = {}, childs = [] }){
        if(!component) {
            console.warn('Falsy component', component);
            component = '';
        }

        return m(component, attributes, childs);
    }
}

export default ViewHandler;
