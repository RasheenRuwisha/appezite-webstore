import React, {Component} from 'react'
import {connect} from 'react-redux';
import {getProducts} from '../../actions/productActions';
import Grid from '@material-ui/core/Grid';
import Product from './Product'
import '../Home/Home.css';
import Navbar from '../NavBar/Navbar';

class Products extends Component {

    constructor() {
        super()
    }

    componentDidMount() {
        this
            .props
            .getProducts(this.props.business.business.businessId, this.props.business.business.email, this.props.match.params.catid)

    }

    render() {
        return (
            <div style={{
                textAlign: "center"
            }}>
                <Navbar business={this.props.business}/> {this.props.products.products.length > 0
                    ? (
                        <div>

                            <Grid
                                item
                                xs={30}
                                sm={12}
                                lg={12}
                                xl={5}
                                container
                                spacing={24}
                                style={{
                                padding: 24
                            }}>
                                {this
                                    .props
                                    .products
                                    .products
                                    .map(currentProduct => (currentProduct.visibility
                                        ? <Grid
                                                item
                                                xs={12}
                                                sm={4}
                                                lg={3}
                                                xl={5}
                                                style={{
                                                padding: 24
                                            }}>
                                                <Product
                                                    businessId={this.props.business.business.businessId}
                                                    product={currentProduct}/>
                                            </Grid>
                                        : null))}
                            </Grid>
                        </div>
                    )
                    : <div>

                        <p>No products found</p>
                    </div>}
            </div>
        )
    }
}

const mapStateToProps = (state) => ({categories: state.categories, business: state.business, products: state.products})

export default connect(mapStateToProps, {getProducts})(Products);
