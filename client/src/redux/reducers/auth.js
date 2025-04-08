const initialState = {
    isAuthenticated: !!localStorage.getItem('authToken'),
    roleId: null,
}
const authReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'LOGIN_SUCCESS': {
            return {
                ...state,
                isAuthenticated: action.payload,
            }
        }
        case 'LOGOUT': {
            return {
                ...state,
                isAuthenticated: action.payload,
                roleId: null,

            }
        }
        case 'CHECK_ACCOUNT': {
            return {
                ...state,
                roleId: action.payload,
            }
        }
        default:
            return state;
    }
}

export default authReducer;