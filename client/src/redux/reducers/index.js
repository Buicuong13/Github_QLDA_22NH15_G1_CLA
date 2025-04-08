import { combineReducers } from "redux";
import authReducer from './auth'
import vertifyReducer from './verify'
const rootReducer = combineReducers({
    auth: authReducer,
    verify: vertifyReducer,
})
export default rootReducer;