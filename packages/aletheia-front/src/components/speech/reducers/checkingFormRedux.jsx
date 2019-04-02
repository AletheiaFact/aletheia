export default (state = [], action) => {
    switch (action.type){
        case 'LOAD_FORM':
            return [
                ...state,
                action.newState
            ];
        default:
            return state;
    }

};