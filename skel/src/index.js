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
    'view': ({ prefix, name, 'blueprints': { AnchorGroup, NamedAnchorGroup }, container }) =>
        <div className="App" style="background-color: grey;">
            <h1 style="color: green;"> UI 1 - {prefix + ' ' + name } </h1>
            <div>
                <h2> Zone 1 </h2>
                <NamedAnchorGroup id={container.id} name="CreepyWorld" optional="this is optional data injected from App" />
            </div>
            <div>
                <h2> Zone 2 </h2>
                <AnchorGroup id={container.id} filterFn={(c) => c.store.getState().name !== 'CreepyWorld'} wrapper="li"/>
            </div>
        </div>
};

export const Hello = {
    'resource': 'Application.Hello',
    'reducer': (state = { 'number': 0, 'text': '' }, action) => {
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
    'view': ({ name, text, number, container, 'blueprints': { AnchorGroup } }) => (
        <div className="Hello">
            Hello { name } { text } #{number}
            <ul>
                <AnchorGroup id={container.id} wrapper="li" />
            </ul>
        </div>
    )
};

let store = createStore(
    (state) => state,
    mock,
    applyMiddleware.apply(null, StateRenderer.middlewares()),
);

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
        store.replaceReducer(container.reduce);
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
