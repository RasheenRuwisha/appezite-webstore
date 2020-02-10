import {GET_CATEGORY, DELETE_CART, ITEMS_LOADING, SEARCH_CATEGORY} from './types';
import axios from 'axios';
import { loadCart } from './cartActions';

export const getCategories = (payload) => dispatch => {
    dispatch(setItemsLoading);
    axios
        .get(`http://localhost:8081/user/queryAllCategories?email=${payload.email}&businessId=${payload.businessId}`)
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
