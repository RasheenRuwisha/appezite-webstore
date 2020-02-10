import React, {Component, Fragment} from 'react';
import 'bootstrap/dist/css/bootstrap.min.css'
import './App.css';
import Categories from './components/Categories';
import Orders from './components/Orders';
import Products from './components/Products';
import ProductDetails from './components/ProductDetails';
import Home from './components/Home';
import {BrowserRouter as Router, Route} from 'react-router-dom';
import {connect} from 'react-redux';
import {getCategories} from './actions/categoryActions';
import {getBusiness} from './actions/businessActions';
import PropTypes from 'prop-types';
import ReactLoading from 'react-loading';
import {loadUser} from './actions/authActions';
import {removeCart} from './actions/cartActions';
import store from './store';

class App extends Component {

    constructor(props) {
        super(props);
        this.myRef = React.createRef();
    }

    state = {
        right: false,
        drawerState: 'cart',
        selectedDate: new Date(),
        error: null,
        deliveryMethod: 'Pickup'
    }
    componentDidMount() {
        store.dispatch(loadUser());
        let businessId = window
            .location
            .pathname
            .split("/")[1];
        this
            .props
            .getBusiness(businessId);


    }

   
    

    
    render() {

        return (
            <Router>
                <div className="App">
                    {this.props.categories.loading
                        ? <div className="centerLoader">
                                <ReactLoading type="bars" color="#000"/>
                            </div>
                        : <div>
                            <Route exact path="/:id" component={Home}/>
                            <Route exact path="/:id/categories" component={Categories}/>
                            <Route exact path="/:id/categories/:catid" component={Products}/>
                            <Route exact path="/:id/product/:prdid" component={ProductDetails}/>
                            <Route exact path="/:id/orders" component={Orders}/>
                        </div>
}
                </div>
            </Router>
        );
    }
}

App.propTypes = {
    getCategories: PropTypes.func.isRequired,
    categories: PropTypes.object.isRequired,
    products: PropTypes.object.isRequired,
    business: PropTypes.object.isRequired
}

const mapStateToProps = (state) => ({categories: state.categories, cart: state.cart, business: state.business, products: state.products, auth: state.auth})

export default connect(mapStateToProps, {getCategories, getBusiness, removeCart})(App);