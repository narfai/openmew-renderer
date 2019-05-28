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
    'resource': "App",
    'children': [
        hello_state
    ],
    'id': "jw3r0qya"
};

(function(
    // @NOTICE Only the provider is really required
    // Other dependencies are exposed for extended use or convenience purpose
    { Provider, Renderer, Middleware, Structural, Utility, Functional, ActionCreator },
    { createStore, applyMiddleware },
    m,
    View,
    Behavior
){
    const provider = new Provider(m, 'App');

    // @NOTICE you can register view component & action creators anytime ...
    provider.connect_component(
        'App',
        View.app_view,
        Behavior.attach_creator
    );

    // @NOTICE you can attach as much action creators you want to a resource, anytime
    provider.connect_component(
        'Hello',
        View.hello_view,
        Behavior.attach_creator,
        Behavior.detach_creator,
        Behavior.increment_creator,
        Behavior.switch_creator
    );

    const { logger, debug } = Utility;
    const { detach, append, prepend } = Structural;

    // @NOTICE you can attach as much state transducers you want to a resource, anytime, order matter ...
    provider.connect_state_transducers(
        // @NOTICE you can easily log state wherever you want in the pipe
        logger,
        // @NOTICE you easily can debug the I/O of a state transducer with debug wrapper
        debug(detach, 'DETACH REDUCER'),
        append,
        prepend,
        Behavior.increment_transducer
    );

    // @NOTICE you can attach as much global component transducers you want, anytime, order matter ....
    // Those transducers will be used at dynamic component creation
    // giving abilities to generated components
    provider.connect_component_transducers(
        Renderer.debug_redraw(// @NOTICE this tranducer allow debug of redraw evalutin choice by a transducer
            Functional.pipe( //Order matter
                // @NOTICE this transducer provide `vnode.state.store_state` to component's view
                Renderer.state_aware,
                // @NOTICE this transducer optimize by preventing mithril to evaluate redraws of unchanged components
                // according to the state tree ( depends on state_aware for its diff )
                Renderer.skip_redraw,
            )
        )
    );

    const store = createStore(
        provider.reducer, // @NOTICE <= produced reducer is combinable with Redux.combinerReducers
        app_state, //hello_state // @NOTICE <= will also work over any subtree parts ...
        // ... as long root state respect { id, resource, children } interface
        applyMiddleware(
            // @NOTICE this middleware mount or remount ( updated and/or alternatives ) resources to DOM
            // on { type: 'SWITCH_VIEWSET', viewset: null | String, select: null | Function } action
            // any state transducer can react to that action safely
            Middleware.render(m, provider, document.getElementById('app')),
            // @NOTICE this middleware trigger redraw when any { redraw: true } action is dispatched
            Middleware.redraw(m)
        )
    );

    // @NOTICE State behaviors Hotloading
    // if other tranducers are connected after store creation, you can use Redux.replaceReducer fonction
    // provider.connect_transducers(lazy_transducers);
    // store.replaceReducer(provider.reducer);

    // @NOTICE Rendering Mithril way
    // m.mount( //
    //     document.getElementById('app'),
    //     provider.component({ store /*, 'viewset': 'Alternate'*/ })
    // );

    // @NOTICE Rendering Redux way with Middleware.render_middleware
    store.dispatch(ActionCreator.switch());//@NOTICE select default viewset

    // @NOTICE Render behaviors Hotloading
    // Define lazily alternative resources with viewset
    // If a component cannot suite to viewset, default resource is used.
    // If a component does not have default viewset, error
    provider.connect_component(
        { 'name': 'Hello', 'viewset': 'Alternate' },
        View.hello_alternate_view,
        //@NOTICE you can also factorize and persist your creators capabilities with `combine_creators`
        ActionCreator.combine_creators(
            Behavior.attach_creator,
            Behavior.detach_creator,
            Behavior.increment_creator,
            Behavior.switch_creator
        )
    );

    // @NOTICE Then switch manually viewset to display added resource
    // store.dispatch(ActionCreator.switch({ 'viewset': 'Alternate' }));
    // You have to render anyway since there could be some viewset_overrides
    // which using the new resource partially
    store.dispatch(ActionCreator.switch());

    store.subscribe(() => {
        console.log('state', store.getState());
        // @NOTICE for debugging or tiny project convenience,
        // it could be usefull to always redraw after a state change
        // ( but you have to disable the more consice redraw_middleware )
        // m.redraw();
    });
})(OpenMewRenderer, Redux, m, View, Behavior);


//TODO may its possible to attach different dom elements to differents resources with same store state tree
//May it only needs two render middleware registration, or manual m.mounts
