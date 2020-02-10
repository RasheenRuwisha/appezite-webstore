import React, {Component} from 'react'
import {connect} from 'react-redux';
import {getProduct, setProductLoading} from '../actions/productActions';
import Grid from '@material-ui/core/Grid';
import Product from '../components/Product'
import './Home.css';
import Navbar from './Navbar';
import ReactLoading from 'react-loading';
import '../App.css';

class Products extends Component {

    constructor() {
        super()
    }

    componentDidMount() {
        this
            .props
            .setProductLoading();
        this
            .props
            .getProduct(this.props.business.business.email, this.props.match.params.prdid)

    }

    render() {
        return (
            <div style={{
                textAlign: "center"
            }}>
                <Navbar business={this.props.business}/> {this.props.products.product !== null
                    ? (
                        <div>
                            {this.props.products.product.name}
                        </div>
                    )
                    : <div className="centerLoader">
                        <ReactLoading type="bars" color="#000"/>
                    </div>}
            </div>
        )
    }
}

const mapStateToProps = (state) => ({categories: state.categories, business: state.business, products: state.products})

export default connect(mapStateToProps, {getProduct, setProductLoading})(Products);
