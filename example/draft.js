/* eslint-disable */


const stat = {
    'success': 0,
    'failed': 0
};
const assert = function (a, message = assert.format(a, ' is true')) { //TODO embed class moved in lib
    if(a === true) {
        stat.success += 1;
        return;
    }
    stat.failed += 1;
    throw new Error('Fail to assert that ' + message);
};
assert.format = (...args) => JSON.stringify([...args]);
assert.equals = (a, b) => assert(a === b, assert.format(a, ' equals to ', b));
assert.not_equals = (a, b) => assert(a !== b, assert.format(a, ' not equals to ', b));

(function({ rc: { Provider, module_identity, attach, state_reducer, resource_filter, detach, logger } }, { createStore }, m){
    const increment_transducer = state_reducer((next, state = null, action) => {
        switch(action.type){
            case 'INCREMENT':
                return {
                    ...next(state, action),
                    'number': state.number
                        ? state.number + 1
                        : 1
                };
            default:
                return next(state, action);
        }
    });


    const provider = new Provider(m, 'App');

    const app_view = {
        'view': ({ state: { store, provider } }) => {
            // console.log('App store chain', store.id, store.chain);
            return m(
                'div',
                [
                    // m('button', )
                    m('h1', 'App !'),
                    m(provider.AnchorGroup, { store, provider })
                ]
            );
        }
    };

    const hello_view = {
        'view': ({ state: { store, provider, action }}) => {
            // console.log('Hello store chain', store.id, store.chain);
            const state = store.getState();
            // console.log('Hello store chain', store.id, store.chain);
            // console.log('increment', action.increment());
            return m(
                'div',
                [
                    m(
                        'h1',
                        'Hello ! (' + state.resource + ') #' + state.id + ' number ' + state.number,
                        [
                            m('button', { 'onclick': action.increment }, 'INCREMENT'),
                            m('button', { 'onclick': action.attach }, 'ATTACH'),
                            m('button', { 'onclick': action.detach }, 'DETACH'),
                        ]
                    ),
                    m(
                        'ul',
                        m(provider.AnchorGroup, { store, provider, wrapper: 'li' })
                    )
                ]
            );
        }
    };
    provider.connect_component('App', app_view);
    // assert.not_equals(app_view, provider.component());
    // assert.equals(app_view, provider.component(new class Store { getState(){ return { 'resource': 'App' } } }));

    const hello_action_creator = (spread) => ({
        'increment': spread(
            () => ({ 'type': 'INCREMENT'})
        )(spread.scope.self, spread.redraw.allow)
        ,
        'attach': spread.attach(
            ({ state, event }) => ({
                resource: state.resource,
                initial_state: { number: 10 }
            })
        )(spread.scope.self)
        ,
        'detach': spread.detach(
            ({ state: { id }, event }) => ({ id })
        )(spread.scope.parent, spread.redraw.allow)
    });

    provider.connect_component('Hello', hello_view, hello_action_creator);
    // assert.not_equals(hello_view, provider.component());
    // assert.equals(hello_view, provider.component(new class Store { getState(){ return { 'resource': 'Hello' } } }));

    provider.connect_transducers([ logger, detach, attach, increment_transducer ]);
    // provider.connect_transducers([ resource_filter('App'), increment_transducer ]);
    // provider.connect_transducers([ resource_filter('Hello'),  ]);
    // assert.equals(provider.reducer('App')(undefined, { type: 'INCREMENT' }).number, 1);
    // assert.equals(typeof provider.reducer('App')(undefined, { type: 'INCREMENT', reduce: () => false }).number, 'undefined');
    const hello_state = {
        'resource': "Hello",
        'children': [
            {
                'resource': "Hello",
                'children': [],
                'id': 'boulhahaha2',
                'number': 0
            },
            {
                'resource': "App",
                'children': [],
                'id': 'boulhahaha3'
            }
        ],
        'id': 'boulhahaha',
        'number': 18
    };
    const app_state = {
        resource: "App",
        children: [
            hello_state
        ],
        id: "jw3r0qya"
    };

    const store = createStore(
        provider.reducer, //NOTICE <= is combinable inside subkeys but ...
        app_state
        //TODO redraw middleware
    );
    // const store = createStore(
    //     provider.reducer('Hello'),
    //     hello_state
    // );
    //
    // store.replaceReducer(provider.reducer('App'));

    m.mount(
        document.getElementById('app'),
        provider.component(store)
    ); //NOTICE ... <= Store wrapper with proper subkey selection have to be selected there

    store.subscribe(() => {
        console.log('redraw on state', store.getState());
        m.redraw();
    });
    // console.log(store.getState(), stat);
})(OpenMewRenderer, Redux, m);

/***
 * As Library consumer, i can attach action creators with spreading to vnode.state ( provide id / chain at rendering ? )
 * As Library consumer, i can access local store state through vnode
 * As Library consumer, i can put anchors in views in order to display recursively instances of registered resources
 * As Library consumer, i must be able to load an existing previous state
  */
