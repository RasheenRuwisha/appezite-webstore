import React, {Component} from 'react';
import {connect} from 'react-redux';
import {getBusiness} from '../actions/businessActions';
import {getCategories} from '../actions/categoryActions';
import PropTypes from 'prop-types';
import Navbar from './Navbar';
import Grid from '@material-ui/core/Grid';
import Category from './Category';

class Categories extends Component {

    state = {
        categories: [],
        initCategories: [],
        searchString: ''
    }

    componentDidMount() {
        this.setState({categories: this.props.categories.categories, initCategories: this.props.categories.categories})
    }
    
    render() {
        return (
            <div style={{
                textAlign: "center"
            }}>
                <Navbar business={this.props.business} page="Category"/>
                
                {this.state.categories.length > 0
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
                                    .state
                                    .categories
                                    .map(currentCategory => (currentCategory.visibility
                                        ? <Grid
                                                item
                                                xs={12}
                                                sm={4}
                                                lg={3}
                                                xl={5}
                                                style={{
                                                padding: 24
                                            }}>
                                                <Category
                                                    businessId={this.props.business.business.businessId}
                                                    product={currentCategory}/>
                                            </Grid>
                                        : null))}
                            </Grid>
                        </div>
                    )
                    : <div>

                        <p>No categories found</p>
                    </div>}
            </div>
        )

    }

}

Categories.propTypes = {
    getCategories: PropTypes.func.isRequired,
    categories: PropTypes.object.isRequired,
    products: PropTypes.object.isRequired,
    business: PropTypes.object.isRequired
}

const mapStateToProps = (state) => ({categories: state.categories, business: state.business, products: state.products})

export default connect(mapStateToProps, { getCategories, getBusiness })(Categories);