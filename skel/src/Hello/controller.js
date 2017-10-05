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

export const controller = ({ vm, container }) => {
    let inc = 0;
    //Give values to the view
    //Create virtual methods
    container.actions
        .clear()
        .createSelfAction('doIncrement', () => ({ 'type': 'INCREMENT' }))
        .createChainAction('doIncrementChain', () => ({ 'type': 'INCREMENT' }))
        .createGlobalAction('doIncrementAll', () => ({ 'type': 'INCREMENT' }))
        .createParentAction('doRemoveModule', () => (
            container.actions.craftRemoveModuleAction({ 'id': container.id })
        ))
        .createSelfAction('doAddModule', () => (
            container.actions.craftAddModuleAction({
                'resource': 'Application.Hello',
                'data': { 'text': 'Child of #' + container.id + (inc? ' #' + ++inc : '') },
                'name': 'NewModule'
            })
        ));
};

export default controller;
