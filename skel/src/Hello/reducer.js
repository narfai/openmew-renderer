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

export const reducer = (state = { 'number': 0, 'text': '' }, action) => {
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
};

export default reducer;
