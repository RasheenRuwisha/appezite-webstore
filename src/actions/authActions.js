import axios from 'axios';
import {returnErrors} from './errorActions';
import {initCart, loadCart} from './cartActions';
import {USER_LOADING, USER_LOADED, AUTH_ERROR, REGISTER_SUCCESS, REGISTER_FAIL, LOGOUT_SUCCESS, LOGIN_SUCCESS, LOGIN_FAIL, NOTIFICATION_TOKEN} from './types';
import { BASE_URL } from '../properties';
import { getBusiness } from './businessActions';

// load the logged in user from the email stored in the local storage.
export const loadUser = () => (dispatch, getState) => {
    dispatch({type: USER_LOADING});

    let businessId = window
    .location
    .pathname
    .split("/")[1];
    const jsonBody = {businessId: businessId, email:localStorage.getItem('email')}
    const body = JSON.stringify(jsonBody)
    // Post a request to get the business user
    axios
        .post(`${BASE_URL}/getBusinessUser`,body, tokenConfig(getState))
        .then(res => {
            // Dispatch a request to update the user data with thereceived data
            dispatch({type: USER_LOADED, payload: res.data});
        })
        .catch(err => {
            // Dispatch auth error if any error occurs
            dispatch(returnErrors(err.response.data, err.response.status));
            dispatch({type: AUTH_ERROR});
        })
}

// register new user to the business
export const register = ({businessId, email, phone ,password,name}) => (dispatch, getState) => {
    const config = {
        headers: {
            'Content-Type': 'application/json'
        }
    }
    const notToken = getState().auth.notificationToken;
    const body = JSON.stringify({businessId, email,phone, password,name,notToken});

    // send post request to regiseter the user
    axios
        .post(`${BASE_URL}/createBusinessUser`, body, config)
        .then(res => {
            // dispatch request to load the user to redux state with the newly created account details
            dispatch({type: REGISTER_SUCCESS, payload: res.data});
            // dispatch request to create a new cart for the user
            dispatch(initCart(businessId,email))
            dispatch(getBusiness(businessId))
        })
        .catch(err => {
            // dispatch auth error if any error occurs
            dispatch(returnErrors(err.response.data, err.response.status, 'REGISTER_FAIL'));
            dispatch({type: REGISTER_FAIL})
        })
}

// logout current user and remove email from local storge
export const logout = () => {
    return{
        type: LOGOUT_SUCCESS
    }
}

// login the user
export const login = ({businessId, email, password}) => (dispatch, getState) => {
    const config = {
        headers: {
            'Content-Type': 'application/json'
        }
    }

    const notToken = getState().auth.notificationToken;
    const body = JSON.stringify({businessId, email, password,notToken});

    // send a post request with the credentials to login the user
    axios
        .post(`${BASE_URL}/loginBusinessUser`, body, config)
        .then(res => {
            // dispatch request to update redux state with the logged in user details
            dispatch({type: LOGIN_SUCCESS, payload: res.data});
            // dispatch a request to load the logged in users cart
            dispatch(loadCart());
            dispatch(getBusiness(businessId))
        })
        .catch(err => {
            // dispatch auth error if any error occurs
            dispatch(returnErrors(err.response.data, err.response.status, 'LOGIN_FAIL'));
            dispatch({type: LOGIN_FAIL})
        })
}


export const addTokenToState = (token) =>  dispatch => {
    dispatch({type:NOTIFICATION_TOKEN, payload:token});
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