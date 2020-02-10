import { GET_BUSINESS, ITEMS_LOADING } from './types';
import axios from 'axios';
import { getCategories } from './categoryActions';

export const getBusiness = (businessId) => dispatch =>{
    dispatch(setItemsLoading);
    axios.get(`http://localhost:8081/getBusiness?businessId=${businessId}`)
    .then(
        res => {
            dispatch({
                type: GET_BUSINESS,
                payload: res.data
            })
            dispatch(getCategories(res.data))
        }
    )
}


export const setItemsLoading = () =>{
    return{
        type: ITEMS_LOADING
    }   
}