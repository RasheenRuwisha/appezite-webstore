import { USER_LOADING, USER_LOADED, LOGIN_SUCCESS, REGISTER_SUCCESS, AUTH_ERROR, LOGIN_FAIL, LOGOUT_SUCCESS, REGISTER_FAIL } from '../actions/types';
const initialState = {
    token: localStorage.getItem('token'),
    isAuthenticated:null,
    isLoading:false,
    user:null
}

export default function(state = initialState, action){
    switch(action.type){
        case USER_LOADING:
            return{
                ...state,
                isLoading: true
            };
        case USER_LOADED:
            return{
                ...state, 
                isAuthenticated:true,
                isLoading:false,
                user:action.payload
            };
        case LOGIN_SUCCESS:
        case REGISTER_SUCCESS:
            localStorage.setItem('token',action.payload.token);
            localStorage.setItem('email',action.payload.user.email);
            return{
                ...state, 
                ...action.payload, 
                isAuthenticated:true,
                isLoading:false,
            };
        case LOGIN_FAIL:
        case LOGOUT_SUCCESS:
        case REGISTER_FAIL:
            localStorage.removeItem('token');
            localStorage.removeItem('email');
            return{
                ...state,
                token:null,
                user:null,
                isAuthenticated:false,
                isLoading:false
            };
        case AUTH_ERROR:
            return{
                ...state,
                token:null,
                user:null,
                isAuthenticated:false,
                isLoading:false
            };
        default:
            return state;         

    }
}