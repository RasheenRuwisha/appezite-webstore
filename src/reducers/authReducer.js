import {
    USER_LOADING,
    USER_LOADED,
    LOGIN_SUCCESS,
    REGISTER_SUCCESS,
    AUTH_ERROR,
    LOGIN_FAIL,
    LOGOUT_SUCCESS,
    REGISTER_FAIL,
    NOTIFICATION_TOKEN
} from '../actions/types';
const initialState = {
    token: localStorage.getItem('token'),
    isAuthenticated: null,
    isLoading: false,
    user: null,
    notificationToken:null
}

export default function (state = initialState, action) {
    switch (action.type) {
        case USER_LOADING:
            return {
                ...state,
                isLoading: true
            };
        case USER_LOADED:
            return {
                ...state,
                isAuthenticated: true,
                isLoading: false,
                user: action.payload[0]
            };
        case LOGIN_SUCCESS:
                localStorage.setItem('token', action.payload.token);
                localStorage.setItem('email', action.payload.user[0].email);
                return {
                    ...state,
                    token:action.payload.token,
                    user:action.payload.user[0],
                    isAuthenticated: true,
                    isLoading: false
                };
        case REGISTER_SUCCESS:
            localStorage.setItem('token', action.payload.token);
            localStorage.setItem('email', action.payload.user.email);
            return {
                ...state,
                ...action.payload,
                isAuthenticated: true,
                isLoading: false
            };
        case LOGIN_FAIL:
        case LOGOUT_SUCCESS:
        case REGISTER_FAIL:
            localStorage.removeItem('token');
            localStorage.removeItem('email');
            return {
                ...state,
                token: null,
                user: null,
                isAuthenticated: false,
                isLoading: false
            };
        case AUTH_ERROR:
            return {
                ...state,
                token: null,
                user: null,
                isAuthenticated: false,
                isLoading: false
            };
        case NOTIFICATION_TOKEN:
            return {
                ...state,
                notificationToken: action.payload
            }
        default:
            return state;

    }
}