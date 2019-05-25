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

(function({ draft: { Provider, module_identity, propagate_transducer, attach_transducer } }, Redux, m){
    const increment_transducer = (resource) => (next) => (state = module_identity(resource, { 'number': 0 }), action) => {
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
    };


    const provider = new Provider(m);

    const app_view = { 'view': () => m('h1', 'Hello') };
    provider.connect_component('App', app_view);
    assert.not_equals(app_view, provider.component());
    assert.equals(app_view, provider.component('App'));

    provider.connect_transducers('App', [ propagate_transducer, attach_transducer, increment_transducer ]);
    assert.equals(provider.reducer(undefined, { type: 'INCREMENT' }).number, 1);
    assert.equals(typeof provider.reducer(undefined, { type: 'INCREMENT', reduce: () => false }).number, 'undefined');

    m.mount(document.getElementById('app'), provider.component('App'));
    console.log(stat);
})(OpenMewRenderer, Redux, m);

/***
 * As Library consumer, i can attach action creators with spreading to vnode.state ( provide id / chain at rendering ? )
 * As Library consumer, i can access local store state through vnode
 * As Library consumer, i can put anchors in views in order to display recursively instances of registered resources
 * As Library consumer, i must be able to load an existing previous state
  */
