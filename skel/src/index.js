import { createStore, applyMiddleware } from 'redux';
import { mock } from './mock';
import m from 'mithril';

import {
    Registry,
    Action,
    Anchor,
    AnchorGroup,
    NamedAnchorGroup,
    Spread,
    register_middleware,
    attach_middleware,
    detach_middleware
} from 'openmew-renderer';

const registry = new Registry();

const store = createStore(
    (state) => state,
    mock,
    applyMiddleware(
        register_middleware(registry),
        attach_middleware(registry),
        detach_middleware(registry)
    )
);

store.subscribe(() => {
    console.log('STATE', store.getState());
});

store.dispatch(Action.REGISTER_BLUEPRINT({
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
                    // filterFn={(c) => c.consumer_data().text === 'CreepyWorld' }
                    wrapper="li"
                />
            </div>
        </div>;
    }
}));

store.dispatch(Action.REGISTER_BLUEPRINT({
    'resource': 'Application.Hello',
    'controller': function HelloController({ container }){
        this.dispatch = {
            'doIncrement': Spread.self_scope(container, () => ({ 'type': 'INCREMENT' })),
            'doIncrementChain': Spread.chain_scope(container, () => ({ 'type': 'INCREMENT' })),
            'doIncrementAll': Spread.global_scope(container, () => ({ 'type': 'INCREMENT' })),
            'addNewModule': Spread.self_scope(container, () => (Action.ATTACH({
                'resource': 'Application.Hello',
                'parent_id': container.id,
                'consumer_data': { 'text': 'NEW MODULE !', 'number': '6666666' },
                'render': ({ container }) => {
                    console.log('render of submodule', container);
                }
            }))),
            'deleteMe': Spread.parent_scope(container, () => (Action.DETACH({
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

store.dispatch(Action.ATTACH({
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
