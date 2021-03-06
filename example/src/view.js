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
        'view': ({state: { store, provider, action = {}, store_state, viewset, AnchorGroup }}) =>
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
                        // @Notice force all children to use alternate resource
                        // m(AnchorGroup, { wrapper: 'li', 'viewset_override': 'Alternate' })
                        m(AnchorGroup, { wrapper: 'li' })
                    )
                ]
            )
    };

    View.hello_view = {
        'view': ({state: {store, provider, action, store_state, AnchorGroup }}) =>
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
                        m(AnchorGroup, { wrapper: 'li' })
                    )
                ]
            )
    };

    View.hello_alternate_view = {
        'view': ({state: { store, action, store_state, AnchorGroup }}) =>
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
                        m(AnchorGroup, { wrapper: 'li'})
                    )
                ]
            )
    };

})(m);
