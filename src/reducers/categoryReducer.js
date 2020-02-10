import { GET_CATEGORY, DELETE_CART, ITEMS_LOADING } from '../actions/types';



const initialState = {
    categories : [],
    loading:true,
}

export default function (state = initialState, action){
    switch(action.type){
        case GET_CATEGORY:
            return{
                ...state,
                categories: action.payload,
                loading: false
            };
        case DELETE_CART:
            return{
                ...state,
                categories: state.categories.filter(categories => categories.id !== action.payload)
            };
        case ITEMS_LOADING:
            return{
                ...state,
                loading:true
            }        
        default:
            return state 
    }
}