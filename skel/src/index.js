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
    attach_middleware
} from 'openmew-renderer';

const registry = new Registry();

const store = createStore(
    (state) => state,
    mock,
    applyMiddleware(
        register_middleware(registry),
        attach_middleware(registry)
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
                    name="CandyWorld"
                    optional="this is optional data injected from App"
                />
            </div>
            <div>
                <h2> Zone 2 </h2>
                <AnchorGroup
                    id={container.id}
                    registry={registry}
                    filterFn={(c) => c.consumer_data().text === 'CreepyWorld' }
                    wrapper="li"
                />
            </div>
        </div>;
    }
}));

let uniq_id = 19;
store.dispatch(ActionCreator.REGISTER_BLUEPRINT({
    'resource': 'Application.Hello',
    'controller': function HelloController({ container }){
        this.dispatch = {
            'doIncrement': SpreadAction.self_scope(container, () => ({ 'type': 'INCREMENT' })),
            'doIncrementChain': SpreadAction.chain_scope(container, () => ({ 'type': 'INCREMENT' })),
            'doIncrementAll': SpreadAction.global_scope(container, () => ({ 'type': 'INCREMENT' })),
            'addNewModule': SpreadAction.self_scope(container, () => (ActionCreator.ATTACH({
                'id': ++uniq_id,
                'resource': 'Application.Hello',
                'parent_id': container.id,
                'consumer_data': { 'text': 'NEW MODULE !', 'number': '6666666' },
                'render': ({ container }) => {
                    console.log('render of submodule', container);
                }
            }))),
            'deleteMe': SpreadAction.parent_scope(container, () => (ActionCreator.DETACH({
                'id': container.id
            })))
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
                <button onclick={vnode.state.dispatch.addNewModule} type="button">Attach new</button>
                <button onclick={vnode.state.dispatch.deleteMe} type="button">Detach me</button>
                <ul>
                    <AnchorGroup registry={registry} id={container.id} wrapper="li"/>
                </ul>
            </div>
        ;
    }
}));

store.dispatch(ActionCreator.ATTACH({
    'id': 1,
    'resource': 'Application.Main',
    'render': ({ container }) => {
        console.log('cointainer');
        store.replaceReducer(container.reducer);
        store.subscribe(() => {
            console.log('RENDER');
            m.render(document.getElementById('app'), m(container.component));
        });
    }
}));

//TODO ADD / REMOVE / MOVE WIDGET

//VIEWSET MIDDLEWARE => allow
////Remove id => UNIQID => use realstore.getState().id or generate new one
//PORTAGE / CLEANUP / LINT
