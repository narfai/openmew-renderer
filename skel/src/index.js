import { createStore, applyMiddleware } from 'redux';
import { mock } from './mock';
import m from 'mithril';

import {
    Registry,
    ActionCreator,
    Anchor,
    AnchorGroup,
    NamedAnchorGroup,
    SpreadAction,
    register_middleware,
    connect_middleware
} from 'openmew-renderer';

const registry = new Registry();

const store = createStore(
    (state) => state,
    mock,
    applyMiddleware(
        register_middleware(registry),
        connect_middleware(registry)
    )
);

store.subscribe(() => {
    console.log('STATE', store.getState());
    // m.redraw();
});

///May its just useless to register stateless ... it could be use directly
// store.dispatch(ActionCreator.REGISTER_BLUEPRINT(Anchor));
// store.dispatch(ActionCreator.REGISTER_BLUEPRINT(AnchorGroup));
// store.dispatch(ActionCreator.REGISTER_BLUEPRINT(AnchorNamedAnchor));

store.dispatch(ActionCreator.REGISTER_BLUEPRINT({
    'resource': 'Application.Main',
    'reducer': (state = {'prefix': '', 'name': ''}, action) => {
        switch (action.type){
            case 'AWESOME':
                return {
                    'prefix': state.prefix + ' awesome ',
                    'name': state.name
                };
            default:
                return state;
        }
    },
    'view': ({ container, registry }) => () => {
        const { prefix, name } = container.consumer_data();
        return <div className="App" style="background-color: grey;">
            <h1 style="color: green;"> UI 1 - {prefix + ' ' + name} </h1>
            <div>
                <h2> Zone 1 </h2>
                <NamedAnchorGroup
                    id={container.id}
                    registry={registry}
                    name_key="text"
                    name="CreepyWorld"
                    optional="this is optional data injected from App"
                />
            </div>
            <div>
                <h2> Zone 2 </h2>
                <AnchorGroup
                    id={container.id}
                    registry={registry}
                    filterFn={(c) => c.store.getState().name !== 'CreepyWorld'}
                    wrapper="li"
                />
            </div>
        </div>;
    }
}));

store.dispatch(ActionCreator.REGISTER_BLUEPRINT({
    'resource': 'Application.Hello',
    'controller': function HelloController({ container }){
        this.dispatch = {
            'doIncrement': SpreadAction.self_scope(container, () => ({ 'type': 'INCREMENT' })),
            'doIncrementChain': SpreadAction.chain_scope(container, () => ({ 'type': 'INCREMENT' })),
            'doIncrementAll': SpreadAction.global_scope(container, () => ({ 'type': 'INCREMENT' }))
        };
    },
    'reducer': (state = { 'number': 0, 'text': '' }, action) => {
        console.log('Hello reducer', action);
        switch (action.type){
            case 'INCREMENT':
                return {
                    'text': state.text,
                    'number': state.number? ++state.number : 1
                };
            case 'SET_MODULE_TEXT':
                return {
                    'text': action.text,
                    'number': state.number
                };
            default:
                return state;
        }
    },
    'view': ({ container, registry }) => (vnode) => {
        const { name, text, number } = container.consumer_data();
        return <div className="Hello">
                Hello {name} {text} #{number}
                <button onclick={vnode.state.dispatch.doIncrement} type="button">Increment self {container.id}</button>
                <button onclick={vnode.state.dispatch.doIncrementChain} type="button">Increment bubble</button>
                <button onclick={vnode.state.dispatch.doIncrementAll} type="button">Increment all</button>
                <ul>
                    <AnchorGroup registry={registry} id={container.id} wrapper="li"/>
                </ul>
            </div>
        ;
    }
}));

store.dispatch(ActionCreator.CONNECT({
    'id': 1,
    'resource': 'Application.Main',
    'customer_data': {'prefix': 'MOUHAHAHHA...', 'name': '...HAHAHAHAHAHAHAHAHA'},
    'render': ({ container }) => {
        console.log('cointainer');
        store.replaceReducer((state, action) => container.reducer(state, action));
        store.subscribe(() => m.render(document.getElementById('app'), m(container.component)));
    }
}));


// console.log(store.getState());
//
// store.dispatch({
//     'type': 'REGISTER_BLUEPRINT',
//     'resource': Hello.resource,
//     'blueprint': Hello
// });
//
// store.dispatch({
//     'type': 'REGISTER_BLUEPRINT',
//     'resource': Main.resource,
//     'blueprint': Main
// });
//
// store.dispatch({
//     'type': 'CONNECT',
//     'resource': Main.resource,
//     'onConnect': ({ container }) => {
//         console.log('connect');
//         store.replaceReducer(container.reduce);
//         store.subscribe(() => {
//             console.log('STATE', store.getState());
//             // m.redraw();
//         });
//         m.render(document.getElementById('app'), m(container.component));
//     }
// });

