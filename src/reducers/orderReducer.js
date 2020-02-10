import { GET_ORDERS,ORDERS_LOADED } from '../actions/types';



const initialState = {
    orders : {},
    loading:false,
}

export default function (state = initialState, action){
    switch(action.type){
        case GET_ORDERS:
            return{
                ...state,
                loading: true
            };
        case ORDERS_LOADED:
            return{
                ...state,
                orders:action.payload,
                loading:false
            } 
        default:
            return state 
    }
}