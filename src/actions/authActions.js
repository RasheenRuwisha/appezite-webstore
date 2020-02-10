import axios from 'axios';
import {returnErrors} from './errorActions';
import {initCart, loadCart} from './cartActions';
import {USER_LOADING, USER_LOADED, AUTH_ERROR, REGISTER_SUCCESS, REGISTER_FAIL, LOGOUT_SUCCESS, LOGIN_SUCCESS, LOGIN_FAIL} from './types';

export const loadUser = () => (dispatch, getState) => {
    dispatch({type: USER_LOADING});

    let businessId = window
    .location
    .pathname
    .split("/")[1];
    const jsonBody = {businessId: businessId, email:localStorage.getItem('email')}
    const body = JSON.stringify(jsonBody)
    axios
        .post(`http://localhost:8081/getBusinessUser`,body, tokenConfig(getState))
        .then(res => {
            dispatch({type: USER_LOADED, payload: res.data});
        })
        .catch(err => {
            dispatch(returnErrors(err.response.data, err.response.status));
            dispatch({type: AUTH_ERROR});
        })
}

export const register = ({businessId, email, password,name}) => dispatch => {
    const config = {
        headers: {
            'Content-Type': 'application/json'
        }
    }

    const body = JSON.stringify({businessId, email, password,name});

    axios
        .post('http://localhost:8081/createBusinessUser', body, config)
        .then(res => {
            dispatch({type: REGISTER_SUCCESS, payload: res.data});
            dispatch(initCart(businessId,email))
        })
        .catch(err => {
            dispatch(returnErrors(err.response.data, err.response.status, 'REGISTER_FAIL'));
            dispatch({type: REGISTER_FAIL})
        })
}

export const logout = () => {
    return{
        type: LOGOUT_SUCCESS
    }
}

export const login = ({businessId, email, password}) => dispatch => {
    const config = {
        headers: {
            'Content-Type': 'application/json'
        }
    }

    const body = JSON.stringify({businessId, email, password});

    axios
        .post('http://localhost:8081/loginBusinessUser', body, config)
        .then(res => {
            dispatch({type: LOGIN_SUCCESS, payload: res.data});
            dispatch(loadCart());
        })
        .catch(err => {
            dispatch(returnErrors(err.response.data, err.response.status, 'LOGIN_FAIL'));
            dispatch({type: LOGIN_FAIL})
        })
}

export const tokenConfig = getState => {
    const token = getState().auth.token;

    const config = {
        headers: {
            "Content-type": "application/json"
        }
    }

    if (token) {
        config.headers['x-auth-token'] = token;
    }
    return config
}