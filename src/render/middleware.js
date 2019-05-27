/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * Copyright (C) 2019 François Cadeillan <francois@azsystem.fr>
 *
 */

import { Store } from '../state';
import { SWITCH_VIEWSET } from '../action/creator';

export class Middleware {
    static allowed_render(){
        return [SWITCH_VIEWSET];
    }

    static redraw_middleware(mithril){
        return (/*redux_store*/) => (next) => (action) => {
            console.log('ACTION', action);
            const result = next(action);
            if(typeof action.redraw !== 'undefined' && action.redraw) mithril.redraw();
            return result;
        };
    }

    static render_middleware(mithril, provider, root_element){
        return (store) => (next) => (action) => {
            if(!Middleware.allowed_render().includes(action.type)) next(action);

            const virtual_store = new Store({ store, select: action.select });
            mithril.mount(root_element, null);
            mithril.mount(root_element, provider.component({
                'store': virtual_store,
                'viewset': action.viewset
            }));

            return next(action);
        };
    }
}
