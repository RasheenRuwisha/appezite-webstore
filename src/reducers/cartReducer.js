import {
    USER_LOADING,
    USER_LOADED,
    LOGIN_SUCCESS,
    REGISTER_SUCCESS,
    AUTH_ERROR,
    LOGIN_FAIL,
    LOGOUT_SUCCESS,
    REGISTER_FAIL,
    GET_CART,
    ADD_CART,
    CART_LOADED,
    DELETE_CART,
    CART_UPDATED,
    ORDER_PLACED,
    PLACE_ORDER,
    ADD_INIT_CART,
    UPDATE_CART
} from '../actions/types';
const initialState = {
    loading: true,
    cart: null,
    placingOrder: false
}

export default function (state = initialState, action) {
    switch (action.type) {
        case GET_CART:
            return {
                ...state,
                loading: true
            };
        case CART_LOADED:
            return {
                ...state,
                loading: false,
                cart: action.payload[0]
            };
        case CART_UPDATED:
            return {
                ...state,
                loading: false,
                cart: action.payload,
                placingOrder: false
            }
        case ADD_CART:
            return {
                ...state,
                loading: false,
                cart: action.payload[0]
            };
        case ADD_INIT_CART:
            return {
                ...state,
                loading: false,
                cart: action.payload
            };
        case DELETE_CART:
            {
                return {
                    ...state,
                    loading: false,
                    cart: null
                }
            };
        case ORDER_PLACED:
            {
                return {
                    ...state,
                    loading: false,
                    cart: null,
                    placingOrder: true
                }
            };
        case PLACE_ORDER:
            {
                return {
                    ...state,
                    lodaing: true
                }
            }
        case UPDATE_CART:
            {
                return{
                    ...state,
                    loading:true
                }
            }
        default:
            return state;

    }
}