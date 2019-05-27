/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * Copyright (C) 2019 François Cadeillan <francois@azsystem.fr>
 *
 */
/* eslint-disable */

const hello_state = {
    'resource': "Hello",
    'children': [
        {
            'resource': "Hello",
            'children': [],
            'id': 'jw3r0qze',
            'number': 0
        },
        {
            'resource': "App",
            'children': [],
            'id': 'jw3r0qdb'
        }
    ],
    'id': 'jw3r0qza',
    'number': 18
};
const app_state = {
    resource: "App",
    children: [
        hello_state
    ],
    id: "jw3r0qya"
};

(function(
    { Provider, Renderer, Identity, Structural, Utility },
    { createStore, applyMiddleware },
    m,
    View,
    Behavior
){
    const provider = new Provider(m, 'App');

    //@NOTICE[1] you can register view component & action creators anytime ...
    provider.connect_component(
        'App',
        View.app_view,
        Behavior.attach_creator
    );

    //@NOTICE you can attach as much action creators you want to a resource, anytime
    provider.connect_component(
        'Hello',
        View.hello_view,
        Behavior.attach_creator,
        Behavior.detach_creator,
        Behavior.increment_creator
    );

    const { logger, debug } = Utility;
    const { detach, attach } = Structural;

    //@NOTUCE[2] you can attach as much state transducers you want to a resource, anytime, order matter ...
    provider.connect_transducers([
        logger,
        debug(detach, 'DETACH REDUCER'), //@NOTICE you easily can debug the I/O of a state transducer with debug
        attach,
        Behavior.increment_transducer
    ]);

    const store = createStore(
        provider.reducer, //@NOTICE[3] <= produced reducer is combinable with Redux.combinerReducers but ...
        app_state, //hello_state //@NOTICE <= will also work over any subtree parts ... as long root respect { id, resource, children } interface
        applyMiddleware(Renderer.redraw_middleware(m))
    );

    //@NOTICE[2]... if other tranducers are connected after store creation, you can use Redux.replaceReducer fonction
    //provider.connect_transducers(lazy_transducer);
    // store.replaceReducer(provider.reducer);

    m.mount(//@NOTICE you can render the way you want
        document.getElementById('app'),
        //NOTICE[3]... <= you have to wrap redux Store with OpenMewRenderer.Store wrapper with proper subkey select function
        provider.component(store)
    );

    //@NOTICE[1] if you want to register a view after mount you may have to redraw

    store.subscribe(() => {
        console.log('state', store.getState());
        // m.redraw(); //@NOTICE for debugging or tiny project convenience, it could be usefull to always redraw
    });
})(OpenMewRenderer, Redux, m, View, Behavior);

//TODO onbeforeupdate + update *OPTIONAL* optimization
/***
 * As Library consumer, i can attach action creators with spreading to vnode.state ( provide id / chain at rendering ? )
 * As Library consumer, i can access local store state through vnode
 * As Library consumer, i can put anchors in views in order to display recursively instances of registered resources
 * As Library consumer, i must be able to load an existing previous state
  */
