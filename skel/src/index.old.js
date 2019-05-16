import { createStore, applyMiddleware } from 'redux';
import { mock } from './mock';
import { StateRenderer } from 'openmew-renderer';
import m from 'mithril';


export const Main = {
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
    'view': ({ 'blueprints': { AnchorGroup, NamedAnchorGroup }, container }) => {
        let { prefix, name } = container.getState();
        return <div className="App" style="background-color: grey;">
            <h1 style="color: green;"> UI 1 - {prefix + ' ' + name} </h1>
            <div>
                <h2> Zone 1 </h2>
                <NamedAnchorGroup id={container.id} name="CreepyWorld"
                                  optional="this is optional data injected from App"/>
            </div>
            <div>
                <h2> Zone 2 </h2>
                <AnchorGroup id={container.id} filterFn={(c) => c.store.getState().name !== 'CreepyWorld'}
                             wrapper="li"/>
            </div>
        </div>;
    }
};

export const Hello = {
    'resource': 'Application.Hello',
    'controller': function HelloController({ container }){
        this.dispatcher = {
            'doIncrement': StateRenderer.spread().self_scope(container, () => ({ 'type': 'INCREMENT' })),
            'doIncrementChain': StateRenderer.spread().chain_scope(container, () => ({ 'type': 'INCREMENT' })),
            'doIncrementAll': StateRenderer.spread().global_scope(container, () => ({ 'type': 'INCREMENT' }))
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
    'view': ({ 'vnode': { 'state': { dispatcher } }, container, 'blueprints': { AnchorGroup } }) => {
        let { name, text, number } = container.getState();
        return <div className="Hello">
            Hello {name} {text} #{number}
            <button onclick={dispatcher.doIncrement} type="button">Increment self {container.id}</button>
            <button onclick={dispatcher.doIncrementChain} type="button">Increment bubble</button>
            <button onclick={dispatcher.doIncrementAll} type="button">Increment all</button>
            <ul>
                <AnchorGroup id={container.id} wrapper="li"/>
            </ul>
        </div>;
    }
};

let store = createStore(
    (state) => state,
    mock,
    applyMiddleware.apply(null, StateRenderer.middlewares()),
);

// store.subscribe(() => {
//     console.log('STATE', store.getState());
//     // m.redraw();
// });

console.log(store.getState());

store.dispatch({
    'type': 'REGISTER_BLUEPRINT',
    'resource': Hello.resource,
    'blueprint': Hello
});

store.dispatch({
    'type': 'REGISTER_BLUEPRINT',
    'resource': Main.resource,
    'blueprint': Main
});

store.dispatch({
    'type': 'CONNECT',
    'resource': Main.resource,
    'onConnect': ({ container }) => {
        console.log('connect');
        store.replaceReducer(container.reduce);
        store.subscribe(() => {
            m.render(document.getElementById('app'), m(container.component));
            console.log('STATE', store.getState());
            // m.redraw();
        });
        m.render(document.getElementById('app'), m(container.component));
    }
});


// StateRenderer.reduce);
// console.log(store.getState());
//


// let rootContainer = StateRenderer.connect({ store });


//
// store.subscribe(() => {
//     console.log('state', store.getState());
// });
