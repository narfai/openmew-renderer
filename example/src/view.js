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
        //NOTICE: transducers use mithril state to give capabilities
        //store / provider / action comes from controller builtin tranducer
        //store_state comes from optional state_aware_component tranducer
        'view': ({state: { store, provider, action = {}, store_state, viewset }}) =>
            m(
                'div',
                [
                    m(
                        'h1',
                        'App ! (' + store_state.resource + ' / viewset ' + viewset + ') #' + store_state.id + ' number ' + store_state.number,
                        [
                            ...Object.keys(action).map(
                                (key) => m('button', {key, 'onclick': action[key]}, key)
                            )
                        ]
                    ),
                    m(
                        'ul',
                        //@NOTICE if you use viewset, you have to propagate it through anchors
                        //If you dont, children will fallback to default
                        m(provider.AnchorGroup, {store, provider, viewset, wrapper: 'li'})
                    )
                ]
            )
    };

    View.hello_view = {
        'view': ({state: {store, provider, action, store_state, viewset }}) =>
            m(
                'div',
                [
                    m(
                        'h1',
                        'Hello ! (' + store_state.resource + ') #' + store_state.id + ' number ' + store_state.number,
                        Object.keys(action).map(
                            (key) => m('button', {key, 'onclick': action[key]}, key)
                        )
                    ),
                    m(
                        'ul',
                        m(provider.AnchorGroup, {store, provider, viewset, wrapper: 'li'})
                    )
                ]
            )
    };

    View.hello_alternate_view = {
        'view': ({state: { store, provider, action, store_state, viewset }}) =>
            m(
                'div',
                [
                    m(
                        'h1',
                        'Alternate hello ! (' + store_state.resource + ') #' + store_state.id + ' number ' + store_state.number,
                        Object.keys(action).map(
                            (key) => m('button', {key, 'onclick': action[key]}, key)
                        )
                    ),
                    m(
                        'ul',
                        m(provider.AnchorGroup, {store, provider, viewset, wrapper: 'li'})
                    )
                ]
            )
    };

})(m);
