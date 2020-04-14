import { ADD_CART, GET_CART, CART_LOADED, AUTH_ERROR, GET_ORDERS, ORDERS_LOADED } from "./types";
import axios from 'axios';
import {returnErrors} from './errorActions';
import { BASE_URL } from "../properties";


// load all the user order
export const loadOrders = () => (dispatch, getState) => {
    dispatch({type: GET_ORDERS});

    let businessId = getState().business.business.businessId;

    axios
        .get(`${BASE_URL}/getBusinessUserOrder?businessId=${businessId}`, tokenConfig(getState))
        .then(res => {
            // dispatch request to update redux state with the orders
            dispatch({type: ORDERS_LOADED, payload: res.data})
        })
        .catch(err => {
            dispatch(returnErrors(err.response.data, err.response.status));
            dispatch({type: AUTH_ERROR});
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