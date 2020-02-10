import { GET_PRODUCTS, GET_PRODUCT, PRODUCT_LOADING } from '../actions/types';



const initialState = {
    products : [],
    product: null,
    loading:false,
}

export default function (state = initialState, action){
    switch(action.type){
        case GET_PRODUCTS:
            return{
                ...state,
                products: action.payload,
                loading: false
            };
        case GET_PRODUCT:
            return{
                ...state,
                product: action.payload
            };
        case PRODUCT_LOADING:
            return{
                ...state,
                product:null
            }
        default:
            return state 
    }
}