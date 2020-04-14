import React, {Component, Fragment} from 'react';
import 'bootstrap/dist/css/bootstrap.min.css'
import './App.css';
import Categories from './components/Category/Categories';
import Orders from './components/Orders/Orders';
import Products from './components/Product/Products';
import ProductDetails from './components/Product/ProductDetails';
import Home from './components/Home/Home';
import {BrowserRouter as Router, Route} from 'react-router-dom';
import {connect} from 'react-redux';
import {getCategories} from './actions/categoryActions';
import {getBusiness} from './actions/businessActions';
import PropTypes from 'prop-types';
import ReactLoading from 'react-loading';
import {loadUser, addTokenToState} from './actions/authActions';
import {removeCart} from './actions/cartActions';
import {setItemsLoadingFin} from './actions/categoryActions'
import store from './store';
import FourZeroFour from './components/error/404';
import { useLocation } from 'react-router-dom'
import ErrorBoundary from './components/error/ErrorHandler';
import { messaging } from "./init-fcm";


if ("serviceWorker" in navigator) {
    navigator.serviceWorker
      .register("./../firebase-messaging-sw.js")
      .then(function(registration) {
        console.log("Registration successful, scope is:", registration.scope);
      })
      .catch(function(err) {
        console.log("Service worker registration failed, error:", err);
      });
  }

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

    async componentDidMount() {
        store.dispatch(loadUser());
        let businessId = window
            .location
            .pathname
            .split("/")[1];

            if(window.location.pathname != "/"){
                this
                .props
                .getBusiness(businessId);
            }else{
                this.props.setItemsLoadingFin()
            }
            
            messaging.requestPermission()
            .then(async function() {
                    const token = await messaging.getToken();
                    store.dispatch(addTokenToState(token))
                    console.log(token)
            })
            .catch(function(err) {
              console.log("Unable to get permission to notify.", err);
            });
          navigator.serviceWorker.addEventListener("message", (message) => console.log(message));
    }

   
    

    
    render() {

        return (
            <Router>
                <ErrorBoundary>
                <div className="App">
                    {this.props.categories.loading
                        ? <div className="centerLoader">
                                <ReactLoading type="bars" color="#000"/>
                            </div>
                        : <div>
                            <Route exact path="/" component={FourZeroFour}/>
                            <Route exact path="/:id" component={Home}/>
                            <Route exact path="/:id/categories" component={Categories}/>
                            <Route exact path="/:id/categories/:catid" component={Products}/>
                            <Route exact path="/:id/product/:prdid" component={ProductDetails}/>
                            <Route exact path="/:id/orders" component={Orders}/>
                        </div>
}
                </div>
                </ErrorBoundary>
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

export default connect(mapStateToProps, {getCategories, getBusiness, removeCart, setItemsLoadingFin, addTokenToState})(App);