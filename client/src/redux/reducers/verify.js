const initialState = {
    userName: '',
    email: '',
    code: '',
}
const vertifyReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'USERNAME': {
            return {
                ...state,
                userName: action.payload,
            }
        }
        case 'EMAIL': {
            return {
                ...state,
                email: action.payload,

            }
        }
        case 'CODE': {
            return {
                ...state,
                code: action.payload,
            }
        }
        default:
            return state;
    }
}

export default vertifyReducer;