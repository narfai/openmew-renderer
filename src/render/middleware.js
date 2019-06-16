/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * Copyright (C) 2019 François Cadeillan <francois@azsystem.fr>
 *
 */

import { Store } from '../state';
import { ActionCreator } from '../action';

export class Middleware {
    static redraw(mithril){
        return (/*redux_store*/) => (next) => (action) => {
            const result = next(action);
            if(typeof action.redraw !== 'undefined' && action.redraw) mithril.redraw();
            return result;
        };
    }

    static render(mithril, provider, root_element, allowed = [ActionCreator.SWITCH_VIEWSET]){
        return (store) => (next) => (action) => {
            if(!allowed.includes(action.type)) return next(action);
            const virtual_store = new Store({ store, select: action.select });
            mithril.mount(root_element, null);
            mithril.mount(root_element, provider.component({
                'store': virtual_store,
                'viewset': action.viewset
            }));

            next(action);

            return virtual_store;
        };
    }
}
