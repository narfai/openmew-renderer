export const reducer = (state = {'prefix': '', 'name': ''}, action) => {
    switch (action.type){
        case 'AWESOME':
            return {
                'prefix': state.prefix + ' awesome ',
                'name': state.name
            };
        default:
            return state;
    }
};

export default reducer;
