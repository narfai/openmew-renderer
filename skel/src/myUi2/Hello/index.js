/*DO WHAT THE FUCK YOU WANT TO PUBLIC LICENSE
 Version 2, December 2004

 Copyright (C) 2017 Francois Cadeillan <francois@azsystem.fr>

 Everyone is permitted to copy and distribute verbatim or modified
 copies of this license document, and changing it is allowed as long
 as the name is changed.

 DO WHAT THE FUCK YOU WANT TO PUBLIC LICENSE
 TERMS AND CONDITIONS FOR COPYING, DISTRIBUTION AND MODIFICATION

 0. You just DO WHAT THE FUCK YOU WANT TO.
 */

import m from 'mithril';
export const Hello = {
    'id': 'Application.Hello',
    'render': (
        { actions, id}, //Module level data
        { name = 'Dummy', text = '', number = 0}, //Specific requested data
        { AnchorGroup }, //eslint-disable-line no-unused-vars
    ) => {
        return (<div className="Hello">
            Hello { name } { text } #{number}
            <button onclick={actions.get('doIncrement')} type="button">Increment self {id}</button>
            <button onclick={actions.get('doIncrementChain')} type="button">Increment bubble</button>
            <button onclick={actions.get('doIncrementAll')} type="button">Increment all</button>
            <button onclick={actions.get('doRemoveModule')} type="button">Remove myself</button>
            <ul>
                <AnchorGroup id={id} wrapper="li" />
                <button onclick={actions.get('doAddModule')} type="button">Add submodule</button>
            </ul>
        </div>);
    },
    'depends': {
        'state': ['name', 'text', 'number', 'modules'],
        'stateless': ['AnchorGroup']
    }
};

export default Hello;