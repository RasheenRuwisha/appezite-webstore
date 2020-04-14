import React, {Component} from 'react'
import {connect} from 'react-redux';
import {getProduct, setProductLoading} from '../../actions/productActions';
import Grid from '@material-ui/core/Grid';
import Product from './Product'
import '../Home/Home.css';
import Navbar from '../NavBar/Navbar';
import ReactLoading from 'react-loading';
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import CardMedia from '@material-ui/core/CardMedia'
import Typography from '@material-ui/core/Typography'
import Paper from '@material-ui/core/Paper';
import IconButton from '@material-ui/core/IconButton'
import AddtoCartLogin from '../auth/AddtoCartLogin'
import AddToCartModal from '../AddToCartModal/AddToCartModal'
import '../../App.css';

const styles = {
    root: {
        height: "100vh"
    },
    grid: {
        height: "100vh",
        textAlign: "left"
    },
    paperLeft: {
        height: "90%"
    },
    paperTop: {
        height: "20%"
    },
    paperMain: {
        height: "90%"
    },
    paperRight: {},
    paperBottom: {
        height: "20%"
    },
    paper: {
        textAlign: "center"
    },
    box: {
        width: "100%",
        textAlign: "center",
        justifyContent: "center",
        alignItems: "center"

    },
    image: {
        width: "100%",
        height: "100%"
    }
}

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
                        <Grid container spacing={1} className={styles.grid}>
                            <Grid item xs={12}>
                                <div style={styles.box}>
                                    <div
                                        style={{
                                        margin: "auto",
                                        width: "70%",
                                        height: "300px",
                                        backgroundPosition: 'center',
                                        backgroundSize: 'cover',
                                        backgroundRepeat: 'no-repeat',
                                        backgroundImage: "url(" + this.props.products.product.image + ")"
                                    }}></div>
                                </div>

                                <div style={{width:"70%",textAlign:"left", margin:"auto"}}>
                                <h3>{this.props.products.product.name}</h3> 
                                    <h2>LKR {this.props.products.product.price}</h2>
                                    <p>{this.props.products.product.description}</p>
                                    {this.props.auth.isAuthenticated
                                        ? <IconButton aria-label="add to favorites">
                                                <AddToCartModal product={this.props.products.product}/>
                                            </IconButton>
                                        : <IconButton>
                                            <AddtoCartLogin/>
                                        </IconButton>
}           
                                </div>

                            </Grid>

                        </Grid>
                    )
                    : <div className="centerLoader">
                        <ReactLoading type="bars" color="#000"/>
                    </div>}
            </div>
        )
    }
}

const mapStateToProps = (state) => ({categories: state.categories, business: state.business, products: state.products, auth: state.auth})

export default connect(mapStateToProps, {getProduct, setProductLoading})(Products);
