import { GET_PRODUCTS, ITEMS_LOADING, GET_PRODUCT, PRODUCT_LOADING } from './types';
import axios from 'axios';
import { BASE_URL } from '../properties';

// get all products for a category
export const getProducts = (businessId, email, catid) => dispatch =>{
    dispatch(setItemsLoading);
    axios.get(`${BASE_URL}/queryAllCategoryProducts?businessId=${businessId}&email=${email}&categoryId=${catid}`)
    .then(
        res => dispatch({
            type: GET_PRODUCTS,
            payload: res.data
        })
    )
}

// get individual product
export const getProduct = (email, catid) => dispatch =>{
    dispatch(setItemsLoading);
    axios.get(`${BASE_URL}/queryProduct?email=${email}&productId=${catid}`)
    .then(
        res => dispatch({
            type: GET_PRODUCT,
            payload: res.data
        })
    )
}

export const setItemsLoading = () =>{
    return{
        type: ITEMS_LOADING
    }   
}

export const setProductLoading= () =>{
    return{
        type: PRODUCT_LOADING
    }   
}
