import { GET_PRODUCTS, ITEMS_LOADING, GET_PRODUCT, PRODUCT_LOADING } from './types';
import axios from 'axios';

export const getProducts = (businessId, email, catid) => dispatch =>{
    dispatch(setItemsLoading);
    axios.get(`http://localhost:8081/user/queryAllCategoryProducts?businessId=${businessId}&email=${email}&categoryId=${catid}`)
    .then(
        res => dispatch({
            type: GET_PRODUCTS,
            payload: res.data
        })
    )
}


export const getProduct = (email, catid) => dispatch =>{
    dispatch(setItemsLoading);
    axios.get(`http://localhost:8081/user/queryProduct?email=${email}&productId=${catid}`)
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
