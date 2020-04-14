import { ADD_CART, GET_CART, CART_LOADED, AUTH_ERROR, CART_UPDATED, PLACE_ORDER, ORDER_PLACED,ADD_INIT_CART, UPDATE_CART } from "./types";
import axios from 'axios';
import {returnErrors} from './errorActions';
import { BASE_URL } from "../properties";
import React, {Component} from 'react';
import {toastr} from 'react-redux-toastr'




// init  cart for new users
export const initCart = (businessId, email) => (dispatch,getState) => {

    const bodyJson = {
        businessId: businessId,
        customerEmail: email,
        products: [],
        docType: "Cart"
    }
    const body = JSON.stringify(bodyJson);

    // send post request to create new car for the new users
    axios
        .post(`${BASE_URL}/createBusinessUserCart`, body, tokenConfig(getState))
        .then(res => {
            dispatch({type: ADD_INIT_CART, payload: res.data})
        })
        .catch(err => {
            dispatch(returnErrors(err.response.data, err.response.status, 'CART_INIT_FAILED'));
        })
}


export const updateCart = () => (dispatch) =>{
    dispatch({type: UPDATE_CART})
}

// load cart for existing users
export const loadCart = () => (dispatch, getState) => {
    dispatch({type: GET_CART});

    let businessId = window
    .location
    .pathname
    .split("/")[1];
    const jsonBody = {businessId: businessId, email:localStorage.getItem('email')}
    const body = JSON.stringify(jsonBody)
    // send post request to get the users cart
    axios
        .post(`${BASE_URL}/getBusinessUserCart`,body, tokenConfig(getState))
        .then(res => {
            dispatch({type: CART_LOADED, payload: res.data})
        })
        .catch(err => {
            dispatch(returnErrors(err.response.data, err.response.status));
            dispatch({type: AUTH_ERROR});
        })
}

// add item to cart
export const addToCart= (cartItem) => (dispatch,getState) => {
    let cart =  getState().cart.cart;
    // add new cartItem to the user cart
    cart.products.push(cartItem);
    // send post request with the updated cart to set the new user cart
    axios
        .post(`${BASE_URL}/addProductBusinessUserCart`,JSON.stringify(cart), tokenConfig(getState))
        .then(res => {
            // dispatch update to update the redux state with new cart
            dispatch({type: CART_UPDATED, payload: res.data})
        })
        .catch(err => {
            dispatch(returnErrors(err.response.data, err.response.status));
            dispatch({type: AUTH_ERROR});
        })
}

// remove item from cart
export const removeCart= (index) => (dispatch,getState) => {
    let cart =  getState().cart.cart;
    // remove the item at the index and update the cart
    cart.products.splice(index,1);    
    // send post request with the updated cart to set the new user cart
    axios
        .post(`${BASE_URL}/addProductBusinessUserCart`,JSON.stringify(cart), tokenConfig(getState))
        .then(res => {
             // dispatch update to update the redux state with new cart
            dispatch({type: CART_UPDATED, payload: res.data})
        })
        .catch(err => {
            dispatch(returnErrors(err.response.data, err.response.status));
            dispatch({type: AUTH_ERROR});
        })
}

// remove all cart items
export const removeAllCart= () => (dispatch,getState) => {
    let cart =  getState().cart.cart;
    cart.products = [];
    axios
        .post(`${BASE_URL}/addProductBusinessUserCart`,JSON.stringify(cart), tokenConfig(getState))
        .then(res => {
            dispatch({type: CART_UPDATED, payload: res.data})
        })
        .catch(err => {
            dispatch(returnErrors(err.response.data, err.response.status));
            dispatch({type: AUTH_ERROR});
        })
}

// place order
export const placeOrder = (order) => (dispatch, getState) =>{
    dispatch({type: PLACE_ORDER});
    axios
    .post(`${BASE_URL}/placeOrder`,JSON.stringify(order), tokenConfig(getState))
    .then(res => {

        // create new toast message to display when order is placed
const toastrOptions = {
    icon: (<myCustomIconOrAvatar />), // You can add any component you want but note that the width and height are 70px ;)
    onShowComplete: () => console.log('SHOW: animation is done'),
    onHideComplete: () => console.log('HIDE: animation is done'),
    onCloseButtonClick: () => console.log('Close button was clicked'),
    onToastrClick: () => console.log('Toastr was clicked'),
    showCloseButton: true, // false by default
    closeOnToastrClick: true,
    width:500,
    textAlign:'center',
    position:'top-center',
    component:(
        <div style={{textAlign:'center'}}>
            <br></br>
            <br></br>
            <p>Your Order Number is</p>
            <h3>{res.data.purchaseId}</h3>
            <p>Show this to the counter to collect your food.</p>
        </div>
    )
  }

        toastr.message('Cart', 'The order has been placed successfully',toastrOptions)
        // remove the items in cart after order is placed
        dispatch(removeAllCart())
        dispatch({type: ORDER_PLACED, payload: res.data});
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