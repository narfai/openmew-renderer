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
