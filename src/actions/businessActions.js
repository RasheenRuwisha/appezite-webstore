import { GET_BUSINESS, ITEMS_LOADING } from './types';
import axios from 'axios';
import { getCategories } from './categoryActions';
import { BASE_URL } from '../properties';


// get the business details
export const getBusiness = (businessId) => dispatch =>{
    dispatch(setItemsLoading);
    axios.get(`${BASE_URL}/getBusiness?businessId=${businessId}`)
    .then(
        res => {
            // sets the business details from the redux state
            dispatch({
                type: GET_BUSINESS,
                payload: res.data
            })
            // dispatch request to load categories.
            dispatch(getCategories(res.data))
        }
    )
}


export const setItemsLoading = () =>{
    return{
        type: ITEMS_LOADING
    }   
}