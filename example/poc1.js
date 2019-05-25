/* eslint-disable */


const assert = function (a, message = 'Fail to assert is true') {
    if(a !== true) return;
    throw new Error(message);
};

assert.equals = (a, b) => {
    assert(a === b, 'Fail to assert that ' + a + ' equals to ' + b);
};

assert.not_equals = (a, b) => {
    assert(a !== b, 'Fail to assert that ' + a + ' not equals to ' + b);
};


(function({ draft: { Provider, module_identity } }, Redux, m){
    const increment_transducer = (resource) => (next) => (state = module_identity(resource, { 'number': 0 }), action) => {
        switch(action.type){
            case 'INCREMENT':
                return {
                    ...next(state, action),
                    'number': state.number + 1
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

    provider.connect_transducers('App', [ increment_transducer ]);
    assert.equals(provider.reducer(undefined, { type: 'INCREMENT' }).number, 1);

    m.mount(document.getElementById('app'), provider.component('App'));
})(OpenMewRenderer, Redux, m);
