/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * Copyright (C) 2019 François Cadeillan <francois@azsystem.fr>
 *
 */
/* eslint-disable */

class View {}

(function(m){
    // https://mithril.js.org/hyperscript.html
    View.app_view = {
        'view': ({state: {store, provider, action}}) => {
            const state = store.getState();
            return m(
                'div',
                [
                    m(
                        'h1',
                        'App ! (' + state.resource + ') #' + state.id + ' number ' + state.number,
                        [
                            m('button', {'onclick': action.attach}, 'STATIC ATTACH'),
                            m('button', {'onclick': action.attach_hello}, 'STATIC ATTACH HELLO'),
                            m('button', {'onclick': action.attach_app}, 'STATIC ATTACH APP'),
                        ]
                    ),
                    m(
                        'ul',
                        m(provider.AnchorGroup, {store, provider, wrapper: 'li'})
                    )
                ]
            );
        }
    };

    View.hello_view = {
        'view': ({state: {store, provider, action}}) => {
            const state = store.getState();
            return m(
                'div',
                [
                    m(
                        'h1',
                        'Hello ! (' + state.resource + ') #' + state.id + ' number ' + state.number,
                        Object.keys(action).map(
                            (key) => m('button', {key, 'onclick': action[key]}, 'DYNAMIC ' + key.toUpperCase())
                        )
                    ),
                    m(
                        'ul',
                        m(provider.AnchorGroup, {store, provider, wrapper: 'li'})
                    )
                ]
            );
        }
    };

})(m);
