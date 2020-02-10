import { combineReducers } from 'redux';
import categoryReducer from './categoryReducer';
import businessReducer from './businessReducer';
import productReducer from './productReducer';
import errorReducer from './errorReducer';
import authReducer from './authReducer';
import cartReducer from './cartReducer';
import orderReducer from './orderReducer';

export default combineReducers({
    categories: categoryReducer,
    business: businessReducer,
    products: productReducer,
    error: errorReducer,
    auth:authReducer,
    cart:cartReducer,
    orders:orderReducer
})