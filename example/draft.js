/* eslint-disable */


const stat = {
    'success': 0,
    'failed': 0
};
const assert = function (a, message = assert.format(a, ' is true')) {
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

(function({ rc: { Provider, module_identity, propagate_transducer, attach_transducer } }, { createStore }, m){
    const resource_filter_transducer = (next) => (resource) => (state, action) => {
        if(resource !== state.resource) return state;
        return next(resource)(state, action);
    };

    const increment_transducer = (next) => (resource) => (state = module_identity(resource, { 'number': 0 }), action) => {
        switch(action.type){
            case 'INCREMENT':
                return {
                    ...next(resource)(state, action),
                    'number': state.number
                        ? state.number + 1
                        : 1
                };
            default:
                return next(resource)(state, action);
        }
    };


    const provider = new Provider(m);

    const app_view = {
        'view': ({ state: { store, provider } }) => {
            console.log('App store chain', store.getChain());
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
        'view': ({ state: { store, provider } }) => {
            console.log('Hello store chain', store.getChain());
            const state = store.getState();
            return m(
                'div',
                [
                    // m('button', )
                    m('h1', 'Hello ! (' + state.resource + ') #' + state.id),
                    m(provider.AnchorGroup, { store, provider })
                ]
            );
        }
    };
    provider.connect_component('App', app_view, );
    // assert.not_equals(app_view, provider.component());
    // assert.equals(app_view, provider.component(new class Store { getState(){ return { 'resource': 'App' } } }));

    const hello_action_creators = () => {

    };
    provider.connect_component('Hello', hello_view);
    // assert.not_equals(hello_view, provider.component());
    // assert.equals(hello_view, provider.component(new class Store { getState(){ return { 'resource': 'Hello' } } }));

    provider.connect_transducers([ propagate_transducer, resource_filter_transducer, attach_transducer, increment_transducer ]);
    // assert.equals(provider.reducer('App')(undefined, { type: 'INCREMENT' }).number, 1);
    // assert.equals(typeof provider.reducer('App')(undefined, { type: 'INCREMENT', reduce: () => false }).number, 'undefined');
    const hello_state = {
        'resource': "Hello",
        'children': [
            {
                'resource': "Hello",
                'children': [],
                'id': 'boulhahaha2'
            },
            {
                'resource': "App",
                'children': [],
                'id': 'boulhahaha3'
            }
        ],
        'id': 'boulhahaha'
    };
    const app_state = {
        resource: "App",
        children: [
            hello_state
        ],
        id: "jw3r0qya"
    };
    const store = createStore(
        provider.reducer('App'),
        app_state
    );
    // const store = createStore(
    //     provider.reducer('Hello'),
    //     hello_state
    // );
    //
    // store.replaceReducer(provider.reducer('App'));

    m.mount(document.getElementById('app'), provider.component(store));
    console.log(store.getState(), stat);
})(OpenMewRenderer, Redux, m);

/***
 * As Library consumer, i can attach action creators with spreading to vnode.state ( provide id / chain at rendering ? )
 * As Library consumer, i can access local store state through vnode
 * As Library consumer, i can put anchors in views in order to display recursively instances of registered resources
 * As Library consumer, i must be able to load an existing previous state
  */
