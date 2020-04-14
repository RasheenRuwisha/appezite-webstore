import {GET_CATEGORY, DELETE_CART, ITEMS_LOADING, SEARCH_CATEGORY, INVALID_URL} from './types';
import axios from 'axios';
import { loadCart } from './cartActions';
import { BASE_URL } from '../properties';

// get categories
export const getCategories = (payload) => dispatch => {
    dispatch(setItemsLoading);
    axios
        .get(`${BASE_URL}/queryAllCategories?email=${payload.email}&businessId=${payload.businessId}`)
        .then(res => {
            dispatch({type: GET_CATEGORY, payload: res.data});
            dispatch(loadCart())
        })
}

export const deleteItem = (id) => {
    return {type: DELETE_CART, payload: id}
}

export const setItemsLoading = () => {
    return {type: ITEMS_LOADING}
}


export const setItemsLoadingFin = () => {
    return {type: INVALID_URL}
}