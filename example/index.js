/*DO WHAT THE FUCK YOU WANT TO PUBLIC LICENSE
 Version 2, December 2004

 Copyright (C) 2019 Francois Cadeillan <francois@azsystem.fr>

 Everyone is permitted to copy and distribute verbatim or modified
 copies of this license document, and changing it is allowed as long
 as the name is changed.

 DO WHAT THE FUCK YOU WANT TO PUBLIC LICENSE
 TERMS AND CONDITIONS FOR COPYING, DISTRIBUTION AND MODIFICATION

 0. You just DO WHAT THE FUCK YOU WANT TO.
 */

/* eslint-disable */
var mock = {
    'id': 'jvs2qy94',
    'resource': 'Application.Main',
    'consumer_state': {
        'prefix': 'My',
        'name': 'application test'
    },
    'containers': [
        {
            'id': 'jsvs2qz18',
            'resource': 'Application.Hello',
            'consumer_state': {
                'text': 'CandyWorld',
                'number': 666
            },
            'containers': [
                {
                    'id': 'jvs2y66t',
                    'resource': 'Application.Hello',
                    'consumer_state': {
                        'text': 'CoolWorld',
                        'number': 777
                    },
                    'containers': [
                        {
                            'id': 'jvs2y6gi',
                            'resource': 'Application.Hello',
                            'consumer_state': {
                                'text': 'LollyWorld',
                                'number': 888
                            },
                            'containers': [
                                {
                                    'id': 'jvs2y6y4',
                                    'resource': 'Application.Hello',
                                    'consumer_state': {
                                        'text': 'CookieWorld',
                                        'number': 999
                                    },
                                    'containers': []
                                },
                                {
                                    'id': 'jvs2y724',
                                    'resource': 'Application.Hello',
                                    'consumer_state': { 'text': 'PrettyWorld', 'number': 1111 },
                                    'containers': []
                                }
                            ]
                        }
                    ]
                }
            ]
        },
        {
            'id': 'jvs2y6by',
            'name': 'CreepyWorld',
            'resource': 'Application.Hello',
            'consumer_state': { 'text': 'CreepyWorld', 'number': 888 },
            'containers': []
        }
    ]
};

(function(OpenMewRenderer, Redux, m){
    var registry = new OpenMewRenderer.Registry();
    var store = Redux.createStore(
        function(state){ return state },
        mock,
        Redux.applyMiddleware(
            OpenMewRenderer.register_middleware(registry),
            OpenMewRenderer.attach_middleware(registry),
            OpenMewRenderer.detach_middleware(registry)
        )
    );

    store.subscribe(function() {
        console.log('STATE', store.getState());
    });

    store.dispatch(OpenMewRenderer.Action.REGISTER_BLUEPRINT({
        'resource': 'Application.Main',
        'reducer': function(state, action){
            if(typeof state === 'undefined') state = {};
            if(typeof state.prefix === 'undefined') state.prefix = '';
            if(typeof state.name === 'undefined') state.name = '';
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
        'view': function(context) {
            return function(){
                var state = context.container.consumer_state();
                if(typeof state === 'undefined') state = {};
                if(typeof state.prefix === 'undefined') state.prefix = '';
                if(typeof state.name === 'undefined') state.name = '';
                return m('div',
                    {
                        className: 'App',
                        style: 'background-color: grey;'
                    },
                    [
                        m(
                            'h1',
                            {
                                style: 'color: green;'
                            },
                            'UI -' + state.prefix + ' ' + state.name
                        ),
                        m(
                            'div',
                            [
                                m('h2', 'Zone 1'),
                                m(OpenMewRenderer.NamedAnchorGroup, {
                                    id: context.container.id,
                                    registry: context.registry,
                                    name_key: 'text',
                                    name: 'CandyWorld',
                                    optional: 'this is optional data injected from App'
                                })
                            ]
                        ),
                        m(
                            'div',
                            [
                                m('h2', 'Zone 2'),
                                m(OpenMewRenderer.AnchorGroup, {
                                    id: context.container.id,
                                    registry: context.registry,
                                    wrapper: 'li'
                                })
                            ]
                        )
                    ]
                );
            }
        }
    }));

    store.dispatch(OpenMewRenderer.Action.REGISTER_BLUEPRINT({
        'resource': 'Application.Hello',
        'controller': function HelloController(context){
            this.dispatch = {
                'doIncrement': OpenMewRenderer.Spread.self_scope(context.container, function() { return { 'type': 'INCREMENT' }; }),
                'doIncrementChain': OpenMewRenderer.Spread.chain_scope(context.container, function() { return { 'type': 'INCREMENT' }; }),
                'doIncrementAll': OpenMewRenderer.Spread.global_scope(context.container, function() { return { 'type': 'INCREMENT' }; }),
                'addNewModule': OpenMewRenderer.Spread.self_scope(context.container, function() { return OpenMewRenderer.Action.ATTACH({
                    'resource': 'Application.Hello',
                    'parent_id': context.container.id,
                    'consumer_state': { 'text': 'NEW MODULE !', 'number': '6666666' },
                    'render': function(context){
                        console.log('render of submodule', context.container);
                    }
                });
                }),
                'deleteMe': OpenMewRenderer.Spread.parent_scope(context.container, function() {
                    return OpenMewRenderer.Action.DETACH({
                        'id': context.container.id
                    });
                })
            };
        },
        'reducer': function(state, action) {
            if(typeof state === 'undefined') state = {};
            if(typeof state.number === 'undefined') state.number = 0;
            if(typeof state.text === 'undefined') state.text = '';
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
        'view': function(context){
            return function(vnode){
                var state = context.container.consumer_state();
                if(typeof state === 'undefined') state = {};
                if(typeof state.text === 'undefined') state.text = '';
                if(typeof state.number === 'undefined') state.number = 0;

                return m(
                    'div',
                    { className: 'Hello' },
                    'Hello ' + state.text + ' #' + state.number,
                    [
                        m(
                            'button',
                            {
                                type: 'button',
                                onclick: vnode.state.dispatch.doIncrement
                            },
                            'Increment self ' + context.container.id
                        ),
                        m(
                            'button',
                            {
                                type: 'button',
                                onclick: vnode.state.dispatch.doIncrementChain
                            },
                            'Increment bubble'
                        ),
                        m(
                            'button',
                            {
                                type: 'button',
                                onclick: vnode.state.dispatch.doIncrementAll
                            },
                            'Increment all'
                        ),
                        m(
                            'button',
                            {
                                type: 'button',
                                onclick: vnode.state.dispatch.addNewModule
                            },
                            'Attach new'
                        ),
                        m(
                            'button',
                            {
                                type: 'button',
                                onclick: vnode.state.dispatch.deleteMe
                            },
                            'Detach me'
                        ),
                        m(
                            'ul',
                            [
                                m(OpenMewRenderer.AnchorGroup, { registry: registry, id: context.container.id, wrapper:'li' })
                            ]
                        )
                    ]
                );
            }
        }
    }));

    store.dispatch(OpenMewRenderer.Action.ATTACH({
        'resource': 'Application.Main',
        'render': function(context){
            console.log('cointainer');
            store.replaceReducer(context.container.reducer);
            store.subscribe(function() {
                console.log('RENDER');
                m.render(document.getElementById('app'), m(context.container.component));
            });
        }
    }));
})(OpenMewRenderer, Redux, m);
