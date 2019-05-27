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

(function({ Provider, Renderer, Identity, Structural, Utility }, { createStore, applyMiddleware }, m){
    const increment_transducer = Identity.state_reducer((next, state = null, action) => {
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
        'view': ({ state: { store, provider, action} }) => {
            const state = store.getState();
            return m(
                'div',
                [
                    m(
                        'h1',
                        'App ! (' + state.resource + ') #' + state.id + ' number ' + state.number,
                        [
                            m('button', { 'onclick': action.increment }, 'INCREMENT'),
                            m('button', { 'onclick': action.attach }, 'ATTACH'),
                            m('button', { 'onclick': action.attach_hello }, 'ATTACH HELLO'),
                            m('button', { 'onclick': action.attach_app }, 'ATTACH APP'),
                            m('button', { 'onclick': action.detach }, 'DETACH'), //@NOTICE you cannot detach root component
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

    const hello_view = {
        'view': ({ state: { store, provider, action }}) => {
            const state = store.getState();
            return m(
                'div',
                [
                    m(
                        'h1',
                        'Hello ! (' + state.resource + ') #' + state.id + ' number ' + state.number,
                        [
                            m('button', { 'onclick': action.increment }, 'INCREMENT'),
                            m('button', { 'onclick': action.attach }, 'ATTACH'),
                            m('button', { 'onclick': action.attach_hello }, 'ATTACH HELLO'),
                            m('button', { 'onclick': action.attach_app }, 'ATTACH APP'),
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

    const action_creator = (spread) => ({
        'increment': spread(
            () => ({ 'type': 'INCREMENT'})
        )(spread.scope.self, spread.redraw.allow)
        ,
        'attach': spread.attach(
            ({ state, event }) => ({
                resource: state.resource,
                initial_state: { number: 10 }
            })
        )(spread.scope.self, spread.redraw.allow)
        ,
        'attach_hello': spread.attach(
            ({ state, event }) => ({
                resource: 'Hello',
                initial_state: { number: 10 }
            })
        )(spread.scope.self, spread.redraw.allow)
        ,
        'attach_app': spread.attach(
            ({ state, event }) => ({
                resource: 'App',
                initial_state: { number: 10 }
            })
        )(spread.scope.self, spread.redraw.allow)
        ,
        'detach': spread.detach(
            ({ state: { id }, event }) => ({ id })
        )(spread.scope.parent, spread.redraw.allow)
    });

    const { logger, debug } = Utility;
    const { detach, attach } = Structural;

    provider.connect_component('App', app_view, action_creator);
    provider.connect_component('Hello', hello_view, action_creator);
    provider.connect_transducers([ logger, debug(detach, 'DETACH REDUCER'), attach, increment_transducer ]);

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

    const store = createStore(
        provider.reducer, //NOTICE <= is combinable inside subkeys but ...
        // undefined,// app_state,
        applyMiddleware(Renderer.redraw_middleware(m))
    );
    // const store = createStore(
    //     provider.reducer,
    //     hello_state
    // );
    //
    // store.replaceReducer(provider.reducer('App'));

    m.mount(
        document.getElementById('app'),
        provider.component(store)
    ); //NOTICE ... <= Store wrapper with proper subkey selection have to be selected there

    store.subscribe(() => {
        console.log('state', store.getState());
        // m.redraw();
    });
    // console.log(store.getState(), stat);
})(OpenMewRenderer, Redux, m);

/***
 * As Library consumer, i can attach action creators with spreading to vnode.state ( provide id / chain at rendering ? )
 * As Library consumer, i can access local store state through vnode
 * As Library consumer, i can put anchors in views in order to display recursively instances of registered resources
 * As Library consumer, i must be able to load an existing previous state
  */
