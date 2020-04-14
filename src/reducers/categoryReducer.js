import { GET_CATEGORY, DELETE_CART, ITEMS_LOADING,INVALID_URL } from '../actions/types';



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
            case INVALID_URL:
                return{
                    ...state,
                    loading:false
                }          
        default:
            return state 
    }
}