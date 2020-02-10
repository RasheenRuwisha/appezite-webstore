import { GET_BUSINESS, ITEMS_LOADING } from '../actions/types';



const initialState = {
    business : {},
    loading:true,
}

export default function (state = initialState, action){
    switch(action.type){
        case GET_BUSINESS:
            return{
                ...state,
                business: action.payload,
                loading: false
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